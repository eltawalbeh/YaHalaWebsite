const ROLES = new Set(["super_admin", "moderator"]);

export function isSupportedRole(role) {
  return typeof role === "string" && ROLES.has(role);
}

export function canManageUsers(role) {
  return role === "super_admin";
}

export function canManagePublicContent(role) {
  return role === "super_admin";
}

export function canManageInbox(role) {
  return role === "super_admin" || role === "moderator";
}
