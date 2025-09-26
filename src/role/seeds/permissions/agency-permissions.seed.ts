import { permissionActions, permissionSubjectName, subject } from './abilities';

export const agencyPermissionsDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE_ROLE,
    subject: subject.name,
    permissionGroupId: 30,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.GET_ROLE,
    subject: subject.name,
    permissionGroupId: 30,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE_ROLE,
    subject: subject.name,
    permissionGroupId: 30,
  },
  {
    action: permissionActions.DELETE,
    title: permissionSubjectName.DELETE_ROLE,
    subject: subject.name,
    permissionGroupId: 30,
  },
];
