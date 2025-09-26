import { permissionActions, permissionSubjectName, subject } from './abilities';

export const operatorPermissionsDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 4,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.GET_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 4,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 4,
  },
  {
    action: permissionActions.DELETE,
    title: permissionSubjectName.DELETE_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 4,
  },
];
