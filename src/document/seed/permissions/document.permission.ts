import { permissionActions, permissionSubjectName, subject } from './abilities';

export const documentPermissionDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE,
    subject: subject.document,
    permissionGroupId: 39,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.document,
    permissionGroupId: 39,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE,
    subject: subject.document,
    permissionGroupId: 39,
  },
  {
    action: permissionActions.DELETE,
    title: permissionSubjectName.DELETE,
    subject: subject.document,
    permissionGroupId: 39,
  },
];
