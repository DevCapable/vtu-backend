import * as ejs from 'ejs';
import * as fs from 'fs';
import path from 'path';
import { generateRandomCode } from './functions';
import puppeteer from 'puppeteer';
import * as qrcode from 'qrcode';
import dayjs from 'dayjs';
import { CustomInternalServerException } from '../error';
import { LoggerService } from '@app/logger';
import { StringHelper } from '../helpers';

let loggerService: LoggerService;
export const generatePdfDocument = async ({
  template,
  isPortrait = false,
  data,
  pdfOptions = {},
}) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      `${process.env.CERTIFICATE_ROOT}`,
      template + '.ejs',
    );

    let qrCode;

    if (data.qrCodeUrl) {
      qrCode = await new Promise<string>((resolve, reject) => {
        qrcode.toDataURL(
          `${process.env.QRCODE_WEBSITE_ADDRESS}${data.qrCodeUrl}`,
          {
            quality: 0.3,
            margin: 0,
            type: 'png',
            qzone: 100,
          },
          (err, url) => {
            if (err) {
              reject(err);
            } else {
              resolve(url);
            }
          },
        );
      });
    }

    const logo = `${process.env.IMAGE_DOMAIN}logo-cert.png`;

    const governmentLogo = `${process.env.IMAGE_DOMAIN}pdf_coat_arms.png`;

    const backgroundImage = `${process.env.IMAGE_DOMAIN}logo_watermark.png`;

    const { esSignature, cbGmSignature, esName, cbGmTitle } =
      await getSignatures(data);

    const font =
      'data:application/x-font-woff;base64,' +
      convertToBase64(
        path.join(process.cwd(), `public`, 'fonts', 'open-sans.woff'),
      );

    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const renderedHtml = ejs.render(templateContent, {
      ...data,
      font,
      esSignature,
      backgroundImage,
      logo,
      governmentLogo,
      cbGmSignature,
      cbGmTitle,
      esName,
      ...(qrCode && { qrCode }),
    });

    const pdfName = `${generateRandomCode(8)}-${StringHelper.slugify(
      data.companyName,
    )}-${template}.pdf`;

    const pdfFilePath = path.join(
      process.cwd(),
      `${process.env.UPLOADED_FILE_DESTINATION}`,
      pdfName,
    );

    // TODO remove the args when deploying to production due to security issues
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 60000,
    });

    const page = await browser.newPage();

    await page.emulateMediaType('print');

    await page.setContent(renderedHtml, {
      timeout: 60000,
    });

    await page.pdf({
      path: pdfFilePath,
      format: 'A4',
      landscape: !isPortrait,
      printBackground: true,
      displayHeaderFooter: true,
      timeout: 120000,
      ...pdfOptions,
    });

    await browser.close();

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

export const generatePdfEqLetter = async ({ template, data }) => {
  const { additionalData, pdfOptions } = transformEqLetterPdfData(data);

  return generatePdfDocument({
    template,
    isPortrait: true,
    data: {
      ...data,
      ...additionalData,
    },
    pdfOptions,
  });
};

export const generatePdfEqCertificate = async ({ template, data }) => {
  const { additionalData, pdfOptions } = transformEqCertificatePdfData(data);

  return generatePdfDocument({
    template,
    isPortrait: false,
    data: {
      ...data,
      ...additionalData,
    },
    pdfOptions,
  });
};

export const transformEqLetterPdfData = (data: any) => {
  const baseStylePartial = path.join(
    process.cwd(),
    `${process.env.CERTIFICATE_ROOT}/partials`,
    '_eq-letter-base-style.ejs',
  );

  const signaturePartial = path.join(
    process.cwd(),
    `${process.env.CERTIFICATE_ROOT}/partials`,
    '_eq-letter-signature.ejs',
  );

  const requestAppendixPartial = path.join(
    process.cwd(),
    `${process.env.CERTIFICATE_ROOT}/partials`,
    '_eq-letter-request-appendix.ejs',
  );

  const requestTablePartial = path.join(
    process.cwd(),
    `${process.env.CERTIFICATE_ROOT}/partials`,
    '_eq-request-table.ejs',
  );

  const appendices = ['D', 'C', 'B', 'A'];

  const pdfOptions = {
    margin: {
      top: '160px',
    },
    headerTemplate: `<div style="margin-top:-20px"><img src="data:image/png;base64,${convertToBase64(
      path.join(process.cwd(), `public`, 'letterheader.png'),
    )}"  style="width: 1180px" alt="TES"/> 
        <div style="text-align: right; font-size: 18px; margin: 20px 50px 0 0">Ref: ${
          data.certificateNumber
        }<br>
            Date: ${data.issuedDate}</div>
        </div>`,
  };

  return {
    additionalData: {
      baseStylePartial,
      signaturePartial,
      requestAppendixPartial,
      requestTablePartial,
      appendices,
    },
    pdfOptions,
  };
};

export const transformEqCertificatePdfData = (data: any) => {
  const { additionalData } = transformEqLetterPdfData(data);

  const requestAppendixPartial = path.join(
    process.cwd(),
    `${process.env.CERTIFICATE_ROOT}/partials`,
    '_eq-certificate-request-appendix.ejs',
  );

  const font =
    'data:application/x-font-woff;base64,' +
    convertToBase64(
      path.join(process.cwd(), `public`, 'fonts', 'open-sans.woff'),
    );

  const headerFile = fs.readFileSync(
    path.join(
      process.cwd(),
      `${process.env.CERTIFICATE_ROOT}/partials`,
      '_eq-certificate-header.ejs',
    ),
    'utf-8',
  );

  const logo = convertToBase64(
    path.join(process.cwd(), `public`, 'logo-cert.png'),
  );

  const pdfOptions = {
    margin: {
      top: '170px',
    },
    headerTemplate: ejs.render(headerFile, {
      logo,
      font,
      ...data,
    }),
    footerTemplate: `
      <div style="width: 60%; margin: 0 auto;">
          <p style="text-align: center; font-size: 14px;">
          This certificate binds <strong>${
            data.companyName
          }</strong> to the terms and conditions of this
          ${
            data.isExpatriateQuota
              ? 'Expatriate Quota Approval'
              : 'Exchange Program Approval'
          }
        </p>
      </div>
    `,
  };

  return {
    additionalData: {
      requestAppendixPartial,
      requestTablePartial: additionalData.requestTablePartial,
      appendices: [...additionalData.appendices],
      summaryAppendices: [...additionalData.appendices],
      logo,
    },
    pdfOptions,
  };
};

// function to convert images to base64 encoding
export const convertToBase64 = (file: any) => {
  // Read File
  const bitmap = fs.readFileSync(file);
  // Convert to base64
  return Buffer.from(bitmap).toString('base64');
};

const getSignatures = async ({ dateApprovedRaw }: any) => {
  let esSignature = `${process.env.IMAGE_DOMAIN}sigs/es-signature.png`;
  let cbGmSignature = `${process.env.IMAGE_DOMAIN}sigs/gm-cb-signature.png`;
  let cbGmTitle = 'General Manager, CBD';
  let esName = 'ENGR. FELIX OMATSOLA OGBE';

  if (dateApprovedRaw) {
    const handOverDate = dayjs('2023-12-18');
    const dateApproved = dayjs(dateApprovedRaw);
    const newCBHandOverDate = dayjs('2024-11-04');
    const newerCBHandOverDate = dayjs('2025-05-22');

    if (dateApproved.isBefore(handOverDate)) {
      esSignature = `${process.env.IMAGE_DOMAIN}sigs/es-signature-old.jpg`;
      cbGmSignature = `${process.env.IMAGE_DOMAIN}sigs/gm-cb-signature-old.jpg`;
      esName = 'ENGR. SIMBI WABOTE';
    }

    if (
      dateApproved.isAfter(newCBHandOverDate) &&
      dateApproved.isBefore(newerCBHandOverDate)
    ) {
      cbGmSignature = `${process.env.IMAGE_DOMAIN}sigs/gm-cb-signature-old.jpg`;
      cbGmTitle = 'Director, CBD';
    } else if (dateApproved.isAfter(newerCBHandOverDate)) {
      cbGmSignature = `${process.env.IMAGE_DOMAIN}sigs/dir-cb-signature-bamidele.png`;
      cbGmTitle = 'Director, CBD';
    }
  }

  return { esSignature, cbGmSignature, esName, cbGmTitle };
};
