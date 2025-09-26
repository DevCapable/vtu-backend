import { permissionActions, permissionSubjectName, subject } from './abilities';

export const customerPermissionDbSeed = [
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.customer,
    permissionGroupId: 31,
  },
  {
    action: permissionActions.REPORT,
    title: permissionSubjectName.REPORT,
    subject: subject.customer,
    permissionGroupId: 31,
  },
];
