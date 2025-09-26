import dayjs from 'dayjs';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as htmlToPdf from 'html-pdf';
import { createHash } from 'node:crypto';
import path from 'path';
import request from 'request';
import { randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
import {
  CustomBadRequestException,
  CustomInternalServerException,
} from '../error';
import { LoggerService } from '@app/logger';
import { StringHelper } from '../helpers';

const asyncRandomBytes = promisify(randomBytes);

let loggerService: LoggerService;
export const generateRandomCode = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export async function generateCryptoString(bytes: number) {
  return asyncRandomBytes(bytes).then((buff) => buff.toString('hex'));
}

export const generateRandomNumber = (length) => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const convertNameToSlug = (name: string) => {
  return (
    name
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '') +
    '-' +
    generateRandomCode(10)
  );
};

export const sendRequest = async (method, url = '', data = {}, token) => {
  const options = {
    method,
    url,
    headers: {
      'content-type': 'application/json',
      authorization: `${token}`,
    },
    body: data,
    json: true,
  };

  // return await axios({
  //   method: options.method,
  //   url: options.url,
  //   data: options.body,
  //   headers: options.headers,
  // });
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) return reject(error);

      return resolve(body);
    });
  });
};

export const transform = (obj, predicate) => {
  return Object.keys(obj).reduce((memo, key) => {
    if (predicate(obj[key], key)) {
      memo[key] = obj[key];
    }
    return memo;
  }, {});
};

export const omit = (obj, items) =>
  transform(obj, (value, key) => !items.includes(key));

export const pick = (obj, items) =>
  transform(obj, (value, key) => items.includes(key));

export const validateAccountId = (accountId, accounts) =>
  accountId && !accounts?.find((account) => account.id === accountId);

export const getNextExactTimeAndYear = () => {
  // Get the current date and time
  const now = new Date();

  // Calculate the next exact time by rounding up to the nearest minute
  const nextMinute = Math.ceil(now.getMinutes());
  const nextExactTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    nextMinute,
  );

  // Calculate the next exact year by adding one to the current year
  const nextExactYear = now.getFullYear() + 1;

  // Combine the next exact time and year into a single Date object
  return new Date(
    nextExactYear,
    nextExactTime.getMonth(),
    nextExactTime.getDate(),
    nextExactTime.getHours(),
    nextExactTime.getMinutes(),
  );
};

export const generate_code = (prefix: any) => {
  const unique_no = Math.floor(Math.random() * 899999 + 100000);
  if (prefix !== null) return prefix + unique_no;
  return unique_no;
};

export const decodeURLParams = (urlParams) => {
  const decodedParams = {};

  for (const key in urlParams) {
    const value = urlParams[key];
    const decodedValue = decodeURIComponent(value);

    if (decodedValue) {
      decodedParams[key] = decodedValue.split(',');
    }
  }

  return decodedParams;
};

export const removeSpecialCharacters = (str: any) => {
  if (str === undefined || str === null) return '';

  return str.toString().replace(/[^\w\s-\[\]()\/\\]/gi, ' ');
};

export const formatDate = (date?: string | Date, format = 'MMMM D, YYYY') =>
  dayjs(date).format(format);

export const generatePdf = async (data: any) => {
  data.logo = `${process.env.IMAGE_DOMAIN}pdf_logo.jpg`;
  const templatePath = path.join(
    process.cwd(),
    `${process.env.CERTIFICATE_ROOT}`,
    data.letterName,
  );

  try {
    const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
    const renderedHtml = ejs.render(templateContent, data);

    const pdfOptions = {
      format: data.format,
      orientation: data.orientation,
    };

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      htmlToPdf.create(renderedHtml, pdfOptions).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });

    const pdfName = `${
      generateRandomCode(5) + '_' + StringHelper.slugify(data.companyName)
    }-${data.certificateType.name}.pdf`;
    const pdfFilePath = path.join(
      process.cwd(),
      `${process.env.UPLOADED_FILE_DESTINATION}`,
      pdfName,
    );

    fs.writeFileSync(pdfFilePath, buffer);

    return {
      name: pdfName,
    };
  } catch (error) {
    loggerService.error('error', error);
    throw new CustomInternalServerException(
      'Error generating or saving the PDF.',
    );
  }
};

export const getExpiryDate = (
  date: string | Date,
  frequency = 1,
  duration = 'YEAR',
) => {
  const currentDate = dayjs(date);
  let expiryDate;
  switch (duration.toUpperCase()) {
    case 'DAY':
      expiryDate = currentDate.add(frequency, 'D');
      break;
    case 'WEEK':
      expiryDate = currentDate.add(frequency, 'w');
      break;
    case 'YEAR':
      expiryDate = currentDate.add(frequency, 'y');
      break;
    default:
      expiryDate = currentDate.add(frequency, 'M');
      break;
  }
  return expiryDate.subtract(1, 'day').toISOString();
};

export const addTrailingZeros = (num: number, digits = 2) => {
  if (!num) return 0;
  let numString = num.toString();
  while (numString.length < digits) {
    numString = '0' + numString;
  }
  return numString;
};

export const sha256 = (content: string) => {
  return createHash('sha256').update(content).digest('hex');
};

export const getNextApprovalCommand = (userPositionCode: string | null) => {
  if (userPositionCode === 'PO' || userPositionCode === 'SP') {
    return 'MGR';
  } else if (userPositionCode === 'DMGR' || userPositionCode === 'MGR') {
    return 'DIR';
  } else if (userPositionCode === 'DIR') {
    return 'ES';
  } else if (userPositionCode === 'ES') {
    return 'APPROVE';
  } else {
    return 'PO';
  }
};

export const generateCertificateNumber = (app, total, approvalDate, base) => {
  const appNo = addTrailingZeros(total + 1, 4);
  const requestCount = app.requests.length;
  const dateApproved = formatDate(approvalDate, 'DD/MM/YY');
  return `${base}${appNo}/${requestCount}/${dateApproved}`;
};

export const badRequestException = (msg: string, errorCode?: string) => {
  throw new CustomBadRequestException(msg, errorCode);
};
