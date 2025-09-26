export enum PermisionActionTypeEnum {
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  CREATE = 'create',
  MANAGE = 'manage',
  READ_REPORT = 'read-report',
  ARCHIVE = 'archived',
  ACTIVATION = 'activation',
  PASSWORD = 'password',
  WORKFLOW_GROUP = 'workflow-group',
  REPORT = 'report',
  DOWNLOAD = 'download',
  CREATE_DOCUMENTS = 'create-documents',
  RESEND_ACKNOWLEDGEMENT = 'resend-acknowledgement',
  EVALUATION = 'evaluate',
}

export enum PermisionSubjectTypeEnum {
  USER = 'user',
  ALL = 'all',
  AUDIT_LOGS = 'audit-logs',
  CUSTOMER = 'customer',
  DOCUMENT = 'document',
}
