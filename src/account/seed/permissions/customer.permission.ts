import { permissionActions, permissionSubjectName, subject } from './abilities';

export const individualPermissionDbSeed = [
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.individual,
    permissionGroupId: 31,
  },
  {
    action: permissionActions.REPORT,
    title: permissionSubjectName.REPORT,
    subject: subject.individual,
    permissionGroupId: 31,
  },
];
