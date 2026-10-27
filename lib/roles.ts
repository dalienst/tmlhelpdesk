// Single place that decides which portal a user belongs to.
// Order matters: a user can hold several flags, the first match wins.

export type RoleFlags = {
  is_admin?: boolean | null;
  is_superuser?: boolean | null;
  is_director?: boolean | null;
  is_general_manager?: boolean | null;
  is_group_manager?: boolean | null;
  is_technician?: boolean | null;
  is_manager?: boolean | null;
  is_hod?: boolean | null;
  is_employee?: boolean | null;
};

export type RolePrefix =
  | "admin"
  | "director"
  | "gm"
  | "group-manager"
  | "technician"
  | "manager"
  | "employee";

export function primaryRole(user?: RoleFlags | null): RolePrefix {
  if (!user) return "employee";
  if (user.is_admin || user.is_superuser) return "admin";
  if (user.is_director) return "director";
  if (user.is_general_manager) return "gm";
  if (user.is_group_manager) return "group-manager";
  // Technicians take precedence over department managers
  if (user.is_technician) return "technician";
  if (user.is_manager || user.is_hod) return "manager";
  return "employee";
}

export const ROLE_TITLES: Record<RolePrefix, string> = {
  admin: "System Administrator",
  director: "Executive Director",
  gm: "General Manager",
  "group-manager": "Group Operations Manager",
  technician: "Support Technician",
  manager: "Department Manager",
  employee: "Staff Employee",
};

export function dashboardPath(user?: RoleFlags | null): string {
  return `/${primaryRole(user)}/dashboard`;
}

// Whether a user may open pages under /<prefix>/. A user with several roles
// (e.g. a GM who is also a department manager) may open each of their portals.
export function canOpenPortal(user: RoleFlags | null | undefined, prefix: string): boolean {
  if (!user) return false;
  if (user.is_admin || user.is_superuser) return true;
  switch (prefix) {
    case "admin":
      return false;
    case "director":
      return Boolean(user.is_director);
    case "gm":
      return Boolean(user.is_general_manager);
    case "group-manager":
      return Boolean(user.is_group_manager);
    case "technician":
      return Boolean(user.is_technician);
    case "manager":
      return Boolean(user.is_manager || user.is_hod);
    case "employee":
      return true;
    default:
      return true;
  }
}
