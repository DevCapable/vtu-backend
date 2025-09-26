export type Document = {
  id?: number;
  filePath: string;
  size: string;
  mimeType: string;
};

export type DocumentFile = {
  id?: number;
  filePath: string;
  awsKey: string;
  size: string;
  mimeType: string;
  fileableId: number;
  fileableType: string;
  documentId: number;
};

export enum DocumentFormat {
  PDF = 'PDF',
  JPG = 'JPG',
  PNG = 'PNG',
  DOC = 'DOC',
  DOCX = 'DOCX',
  XLS = 'XLS',
  XLSX = 'XLSX',
  TXT = 'TXT',
  CSV = 'CSV',
  ZIP = 'ZIP',
  RAR = 'RAR',
  JPEG = 'JPEG',
}

// export enum DocumentDomain {
//   NOGIC = 'NOGIC',
//   NCDF = 'NCDF',
//   E_MARKET = 'E_MARKET',
// }

export enum CertificateType {
  NCEC = 'NCEC',
  NCRC = 'NCRC',
  NCTRC = 'NCTRC',
  MARINE_VESSEL = 'MARINE_VESSEL',
  COR = 'COR',
}
