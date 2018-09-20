export default function checkPerms({ user, permissions }: any, requiredPermissions?: string[]) {
  if (!user) {
    throw new Error('CheckPerms: missing user');
  }

  if (!permissions) {
    throw new Error('CheckPerms: missing permissions');
  }

  requiredPermissions &&
    requiredPermissions.forEach(reqPerm => {
      if (!permissions.find(userPerm => userPerm === reqPerm)) {
        throw new Error(`CheckPerms: missing premission ${reqPerm}`);
      }
    });
}
