import { permissionActions, permissionSubjectName, subject } from './abilities';

export const ncdmbPermissionDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE,
    subject: subject.admin,
    permissionGroupId: 34,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.admin,
    permissionGroupId: 34,
  },
  {
    action: permissionActions.REPORT,
    title: permissionSubjectName.REPORT,
    subject: subject.admin,
    permissionGroupId: 34,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE,
    subject: subject.admin,
    permissionGroupId: 34,
  },
];
