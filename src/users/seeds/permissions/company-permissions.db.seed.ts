import { permissionActions, permissionSubjectName, subject } from './abilities';

export const companyPermissionsDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 3,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.GET_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 3,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 3,
  },
  {
    action: permissionActions.DELETE,
    title: permissionSubjectName.DELETE_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 3,
  },
];
