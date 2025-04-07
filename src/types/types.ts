export interface Login {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface UserBusiness {
  id?: string;
  businessName: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userId: string;
  token: {
    client_id: string;
    client_secret: string;
    expiry: string;
    refresh_token: string;
    scopes: string[];
    token: string;
    token_uri: string;
    universe_domain: string;
  };
}

export interface Business {
  id?: string;
  location: string;
  location_id: string;
  name: string;
  phone: string[];
  services: string[];
  social_tags: string[];
  target_locations: string[];
  user_params: {
    amount_words: number;
    keywords: string;
  }
  website: string;
}

export interface Review {
  reviewId: string;
  reviewer: {
    profilePhotoUrl: string;
    displayName: string;
  };
  starRating: "FIVE" | "FOUR" | "THREE" | "TWO" | "ONE";
  comment: string;
  createTime: string;
  updateTime: string;
  name: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  }
}

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

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystem?: boolean;
  permissions: Record<string, boolean>;
}

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
