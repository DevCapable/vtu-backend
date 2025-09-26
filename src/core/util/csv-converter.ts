import dayjs from 'dayjs';
import { createReadStream, readFileSync } from 'fs';
import _ from 'lodash';
import papa, { parse } from 'papaparse';
import * as XLSX from 'xlsx';
import { performance } from 'perf_hooks';
import { CustomUnprocessableEntityException } from '../error';
import { LoggerService } from '@app/logger';

let loggerService: LoggerService;

export async function* readCsvStream(
  path,
  options,
  delayMillis: number = 10,
  start: number = 0,
  end: number = Infinity,
) {
  // Record the start time
  const startTime = performance.now();

  let headerProcessed = false;
  let header: string[] = [];
  let rowIndex = 0;

  const csvStream = createReadStream(path);
  const parseStream = parse(papa.NODE_STREAM_INPUT, {
    ...options,
    header: false,
  });

  csvStream.pipe(parseStream);

  for await (const chunk of parseStream) {
    if (!headerProcessed) {
      header = chunk.map((h: string) => h.toLowerCase());
      headerProcessed = true;
      continue;
    }

    rowIndex++;
    if (rowIndex < start || rowIndex > end) continue;

    const rowData = chunk;
    const rowObj = {};

    header.forEach((col, index) => {
      rowObj[col] = rowData[index];
    });

    yield rowObj;

    if (delayMillis > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMillis));
    }
  }

  // Calculate streaming time
  const endTime = performance.now();
  const streamingTime = endTime - startTime;
  loggerService.log(`Streaming time: ${streamingTime} milliseconds`);
}

export const convertCSVToObject = async (filePath) => {
  const csvFile = readFileSync(filePath);
  const csvData = csvFile.toString();
  const parsedCsv = await parse(csvData, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase(),
  });
  return parsedCsv.data;
};

export const convertKeysToCamelCase = async (
  arrayOfObjects,
): Promise<any[]> => {
  const camelCaseArray = arrayOfObjects.map((obj) => {
    const camelCaseObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) =>
          letter.toUpperCase(),
        );
        camelCaseObj[camelCaseKey] = obj[key];
      }
    }
    return camelCaseObj;
  });
  loggerService.log(camelCaseArray[0]);
  return camelCaseArray;
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const isURL = (value) => {
  const regexp =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  return regexp.test(value);
};

const parseValueOfType = (value, type) => {
  if (value === null) return { value: null };
  switch (type) {
    case String:
      return { value: value };

    case Number:
    case 'Integer':
      value = Number(value.replace(/[^0-9\.]+/g, ''));
      if (isNaN(value)) return { error: 'Please enter a valid number' };
      return { value: value };

    case 'URL':
      if (!isURL(value)) {
        return { error: 'invalid' };
      }
      return { value: value };

    case 'Email':
      if (!validateEmail(value)) {
        return { error: 'Email is invalid' };
      }
      return { value: value };

    case Date:
      const error = 'Invalid date, please enter a date in format: dd/mm/yyyy';
      const dateArray = value.split('/');
      if (dateArray.length !== 3) return { error };

      const day = dateArray[0];
      const month = dateArray[1];
      const year = dateArray[2];

      const formattedYear = year.length === 2 ? `20${year}` : year;

      const formattedDate = `${formattedYear}-${month}-${day}`;

      const date = dayjs(formattedDate, 'YYYY-MM-DD');

      if (!date.isValid()) return { error };

      return { value: date.format() };

    default:
      throw new CustomUnprocessableEntityException(
        'Unknown schema type: ' + ((type && type.name) || type),
      );
  }
};

export const csvProcessing = (csvFile: any, csvSchema: any) => {
  const failedRows = [];
  const formattedExcelData = [];

  try {
    if (!csvSchema) {
      failedRows.push({
        row: 0,
        error:
          'Schema Required, Read the documentation on how to define a schema',
      });
      return { total: 0, failedRows, payload: [] };
    }

    const wb = XLSX.read(csvFile, { type: 'buffer' });

    // Convert excel to csv
    const csvData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
      raw: false,
      blankrows: false,
    });

    const schemaKeys = Object.keys(csvSchema);

    if (_.isEmpty(csvData)) {
      failedRows.push({
        row: 0,
        error:
          'The uploaded excel is invalid or empty, ensure to download the template and ensure it contains data.',
      });
      return { total: 0, failedRows, payload: [] };
    }

    const csvHeadingKey = Object.keys(csvData[0]);
    const missingKeys = schemaKeys.filter((column) => {
      return csvSchema[column].required && !csvHeadingKey.includes(column);
    });

    if (!_.isEmpty(missingKeys)) {
      failedRows.push({
        row: 0,
        error: `The uploaded template does not have the following required columns: ${missingKeys.join(', ')}`,
      });
      return { total: 0, failedRows, payload: [] };
    }

    csvData.forEach((data, index) => {
      const row: any = {};
      let rowHasError = false;

      schemaKeys.forEach((column) => {
        const schemaEntry = csvSchema[column];
        const rowValue = _.isEmpty(data[column]) ? null : data[column].trim();
        // eslint-disable-next-line prefer-const
        let { error, value } = parseValueOfType(rowValue, schemaEntry.type);

        if (!error && value === null && schemaEntry.required) {
          error = 'Column cannot be empty';
        }

        if (error) {
          failedRows.push({
            row: index + 2,
            column,
            error,
            value: rowValue,
          });
          rowHasError = true;
        }

        row['rowId'] = index;
        row[schemaEntry.prop] = value;
      });

      if (!rowHasError) {
        formattedExcelData.push(row);
      }
    });

    return {
      total: csvData.length,
      failedRows,
      payload: formattedExcelData,
    };
  } catch (error) {
    failedRows.push({
      row: 0,
      error: `Processing error: ${error.message || error}`,
    });

    return { total: 0, failedRows, payload: [] };
  }
};

export async function* generate(arrayObj) {
  for (const item of arrayObj) {
    yield item;
  }
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
