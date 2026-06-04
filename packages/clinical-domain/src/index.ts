export { CLINICAL_ROLES, isClinicalRole, type ClinicalRole } from './roles.js';
export { PERMISSIONS, isPermission, type Permission } from './permissions.js';
export {
  ROLE_PERMISSIONS,
  permissionsForRole,
  roleHasPermission,
  assertPermission,
} from './rbac.js';
export {
  SYNTHETIC_USERS,
  findSyntheticUser,
  verifyDemoAuthKey,
  type SyntheticUser,
} from './demoUsers.js';
