import { permissionActions, permissionSubjectName, subject } from './abilities';

export const agencyPermissionsDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 5,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.GET_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 5,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE_USER_ADMINISTRATION,
    subject: subject.name,
    permissionGroupId: 5,
  },
  {
    action: permissionActions.ACTIVATION,
    title: permissionSubjectName.ACTIVATION,
    subject: subject.name,
    permissionGroupId: 5,
  },
  {
    action: permissionActions.PASSWORD,
    title: permissionSubjectName.CHANGE_PASSWORD,
    subject: subject.name,
    permissionGroupId: 5,
  },
  {
    action: permissionActions.WORKFLOW,
    title: permissionSubjectName.WORKFLOW_TASK,
    subject: subject.name,
    permissionGroupId: 5,
  },
  {
    action: permissionActions.ARCHIVE,
    title: permissionSubjectName.ARCHIVE,
    subject: subject.name,
    permissionGroupId: 5,
  },
];
