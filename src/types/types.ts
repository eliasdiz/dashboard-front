// Tipos compartidos para el sistema de gestión de usuarios

// Tipos de usuario
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended" | "pending";
  lastSeen: string;
  avatar?: string;
}

// Tipos de rol
export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystem?: boolean;
  permissions: Record<string, boolean>;
}

// Tipos de registro de actividad
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
  ipAddress: string;
  metadata?: string;
}

// Tipos para invitaciones de usuario
export interface UserInvite {
  email: string;
  role: string;
  message?: string;
  sendCopy?: boolean;
}

export interface BulkUserInvite {
  emails: string;
  role: string;
  message?: string;
}

// Tipos para permisos
export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface PermissionCategory {
  id: string;
  name: string;
  permissions: Permission[];
}

// Props para componentes
export interface UserListProps {
  users: User[];
  roles: Role[];
  onUserUpdate: (user: User) => void;
  onUserDelete: (userId: string) => void;
  onUserCreate: (user: Omit<User, "id" | "lastSeen" | "status">) => void;
}

export interface RoleManagementProps {
  roles: Role[];
  onRoleUpdate: (role: Role) => void;
  onRoleCreate: (role: Omit<Role, "id">) => void;
}

export interface ActivityLogsProps {
  logs: ActivityLog[];
  users: User[];
}

export interface UserInviteProps {
  roles: Role[];
  onUserInvite: (invite: UserInvite) => void;
}

export interface UserManagementProps {
  // Props opcionales si se necesitan
  initialUsers?: User[];
  initialRoles?: Role[];
  initialLogs?: ActivityLog[];
}

export interface PerformanceData {
  WEBSITE_CLICKS: {
    timeSeries?: {
      datedValues: Array<{
        date: { year: number; month: number };
        value: string;
      }>;
    };
  };
  CALL_CLICKS: {
    timeSeries?: {
      datedValues: Array<{
        date: { year: number; month: number };
        value: string;
      }>;
    };
  };
  BUSINESS_CONVERSATIONS: {
    timeSeries?: {
      datedValues: Array<{
        date: { year: number; month: number };
        value: string;
      }>;
    };
  };
}
