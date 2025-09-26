import { permissionActions, permissionSubjectName, subject } from './abilities';

export const baseRecordPermissionDbSeed = [
  {
    action: permissionActions.CREATE,
    title: permissionSubjectName.CREATE,
    subject: subject.base_record,
    permissionGroupId: 38,
  },
  {
    action: permissionActions.READ,
    title: permissionSubjectName.READ,
    subject: subject.base_record,
    permissionGroupId: 38,
  },
  {
    action: permissionActions.UPDATE,
    title: permissionSubjectName.UPDATE,
    subject: subject.base_record,
    permissionGroupId: 38,
  },
  {
    action: permissionActions.DELETE,
    title: permissionSubjectName.DELETE,
    subject: subject.base_record,
    permissionGroupId: 38,
  },
];
