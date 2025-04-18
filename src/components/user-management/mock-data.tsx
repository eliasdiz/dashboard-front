// Mock data for the User Management component
import type { User, Role, ActivityLog } from "../../types/types.js"

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "role-1", // Admin
    status: "active",
    lastSeen: "2 minutes ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-2",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "role-2", // Editor
    status: "active",
    lastSeen: "3 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "role-3", // Viewer
    status: "active",
    lastSeen: "Yesterday",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "role-2", // Editor
    status: "suspended",
    lastSeen: "5 days ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-5",
    name: "James Wilson",
    email: "james.wilson@example.com",
    role: "role-4", // Content Manager
    status: "active",
    lastSeen: "1 hour ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-6",
    name: "Jessica Martinez",
    email: "jessica.martinez@example.com",
    role: "role-3", // Viewer
    status: "pending",
    lastSeen: "Never",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-7",
    name: "David Anderson",
    email: "david.anderson@example.com",
    role: "role-1", // Admin
    status: "active",
    lastSeen: "Just now",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-8",
    name: "Lisa Thomas",
    email: "lisa.thomas@example.com",
    role: "role-5", // Marketing
    status: "active",
    lastSeen: "2 days ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export const mockRoles: Role[] = [
  {
    id: "role-1",
    name: "Admin",
    description: "Full access to all resources",
    isSystem: true,
    permissions: {
      "users.view": true,
      "users.create": true,
      "users.edit": true,
      "users.delete": true,
      "roles.view": true,
      "roles.create": true,
      "roles.edit": true,
      "roles.delete": true,
      "content.view": true,
      "content.create": true,
      "content.edit": true,
      "content.publish": true,
      "content.delete": true,
      "settings.view": true,
      "settings.edit": true,
      "settings.security": true,
      "reports.view": true,
      "reports.export": true,
      "reports.create": true,
    },
  },
  {
    id: "role-2",
    name: "Editor",
    description: "Can edit and publish content",
    isSystem: true,
    permissions: {
      "users.view": true,
      "users.create": false,
      "users.edit": false,
      "users.delete": false,
      "roles.view": false,
      "roles.create": false,
      "roles.edit": false,
      "roles.delete": false,
      "content.view": true,
      "content.create": true,
      "content.edit": true,
      "content.publish": true,
      "content.delete": false,
      "settings.view": false,
      "settings.edit": false,
      "settings.security": false,
      "reports.view": true,
      "reports.export": true,
      "reports.create": false,
    },
  },
  {
    id: "role-3",
    name: "Viewer",
    description: "Read-only access to content",
    isSystem: true,
    permissions: {
      "users.view": false,
      "users.create": false,
      "users.edit": false,
      "users.delete": false,
      "roles.view": false,
      "roles.create": false,
      "roles.edit": false,
      "roles.delete": false,
      "content.view": true,
      "content.create": false,
      "content.edit": false,
      "content.publish": false,
      "content.delete": false,
      "settings.view": false,
      "settings.edit": false,
      "settings.security": false,
      "reports.view": true,
      "reports.export": false,
      "reports.create": false,
    },
  },
  {
    id: "role-4",
    name: "Content Manager",
    description: "Manages all content but no administrative access",
    isSystem: false,
    permissions: {
      "users.view": false,
      "users.create": false,
      "users.edit": false,
      "users.delete": false,
      "roles.view": false,
      "roles.create": false,
      "roles.edit": false,
      "roles.delete": false,
      "content.view": true,
      "content.create": true,
      "content.edit": true,
      "content.publish": true,
      "content.delete": true,
      "settings.view": false,
      "settings.edit": false,
      "settings.security": false,
      "reports.view": true,
      "reports.export": true,
      "reports.create": false,
    },
  },
  {
    id: "role-5",
    name: "Marketing",
    description: "Access to marketing tools and reports",
    isSystem: false,
    permissions: {
      "users.view": false,
      "users.create": false,
      "users.edit": false,
      "users.delete": false,
      "roles.view": false,
      "roles.create": false,
      "roles.edit": false,
      "roles.delete": false,
      "content.view": true,
      "content.create": true,
      "content.edit": true,
      "content.publish": false,
      "content.delete": false,
      "settings.view": false,
      "settings.edit": false,
      "settings.security": false,
      "reports.view": true,
      "reports.export": true,
      "reports.create": true,
    },
  },
]

export const mockActivityLogs: ActivityLog[] = [
  {
    id: "log-1",
    userId: "user-1",
    userName: "Alex Johnson",
    action: "User Created",
    timestamp: "2023-03-15T14:30:45Z",
    details: "Created new user Jessica Martinez",
    ipAddress: "192.168.1.1",
  },
  {
    id: "log-2",
    userId: "user-7",
    userName: "David Anderson",
    action: "Role Updated",
    timestamp: "2023-03-15T13:25:12Z",
    details: "Updated permissions for Marketing role",
    ipAddress: "192.168.1.45",
  },
  {
    id: "log-3",
    userId: "user-2",
    userName: "Sarah Williams",
    action: "Login Success",
    timestamp: "2023-03-15T12:15:32Z",
    details: "User logged in successfully",
    ipAddress: "192.168.1.87",
  },
  {
    id: "log-4",
    userId: "user-4",
    userName: "Emily Davis",
    action: "Login Failed",
    timestamp: "2023-03-15T11:45:22Z",
    details: "Failed login attempt - incorrect password",
    ipAddress: "192.168.1.92",
  },
  {
    id: "log-5",
    userId: "user-1",
    userName: "Alex Johnson",
    action: "User Updated",
    timestamp: "2023-03-15T10:30:18Z",
    details: "Updated user profile for Michael Brown",
    ipAddress: "192.168.1.1",
  },
  {
    id: "log-6",
    userId: "user-7",
    userName: "David Anderson",
    action: "User Deleted",
    timestamp: "2023-03-14T16:42:11Z",
    details: "Deleted user account for Robert Smith",
    ipAddress: "192.168.1.45",
  },
  {
    id: "log-7",
    userId: "system",
    userName: "System",
    action: "Role Created",
    timestamp: "2023-03-14T15:22:45Z",
    details: "Created new role: Marketing",
    ipAddress: "192.168.1.1",
  },
  {
    id: "log-8",
    userId: "user-1",
    userName: "Alex Johnson",
    action: "User Invited",
    timestamp: "2023-03-14T14:15:32Z",
    details: "Sent invitation to lisa.thomas@example.com",
    ipAddress: "192.168.1.1",
  },
  {
    id: "log-9",
    userId: "user-5",
    userName: "James Wilson",
    action: "Login Success",
    timestamp: "2023-03-14T13:10:28Z",
    details: "User logged in successfully",
    ipAddress: "192.168.1.112",
  },
  {
    id: "log-10",
    userId: "user-3",
    userName: "Michael Brown",
    action: "Login Failed",
    timestamp: "2023-03-14T11:05:14Z",
    details: "Failed login attempt - account locked",
    ipAddress: "192.168.1.65",
  },
  {
    id: "log-11",
    userId: "user-2",
    userName: "Sarah Williams",
    action: "User Updated",
    timestamp: "2023-03-14T10:45:33Z",
    details: "Changed role from Editor to Content Manager",
    ipAddress: "192.168.1.87",
  },
  {
    id: "log-12",
    userId: "system",
    userName: "System",
    action: "User Invited",
    timestamp: "2023-03-13T16:30:22Z",
    details: "Sent invitation to david.anderson@example.com",
    ipAddress: "192.168.1.1",
  },
]

