export interface PermissionGroup {
  id: number;
  name: string;
  type: string;
  groupSlug: string | null;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: number;
  action: string;
  subject: string;
  title: string;
  inverted: boolean;
  conditions: any;
  reason: any;
  permissionGroupId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  permissionGroup: PermissionGroup;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  slug: string;
  accountId: number;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
}
