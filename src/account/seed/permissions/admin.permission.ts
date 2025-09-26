import { permissionActions, permissionSubjectName, subject } from './abilities';

export const ncdmbPermissionDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE,
    subject: subject.ncdmb_staff,
    permissionGroupId: 34,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.ncdmb_staff,
    permissionGroupId: 34,
  },
  {
    action: permissionActions.REPORT,
    title: permissionSubjectName.REPORT,
    subject: subject.ncdmb_staff,
    permissionGroupId: 34,
  },
  {
    action: permissionActions.WORKFLOW,
    title: permissionSubjectName.WORKFLOW_GROUP,
    subject: subject.ncdmb_staff,
    permissionGroupId: 34,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE,
    subject: subject.ncdmb_staff,
    permissionGroupId: 34,
  },
];
