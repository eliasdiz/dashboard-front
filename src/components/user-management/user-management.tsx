"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserList } from "./user-list"
import { RoleManagement } from "./role-management"
import { ActivityLogs } from "./activity-logs"
import { UserInvite } from "./user-invite"
import { SecuritySettings } from "./security-settings"
import { Badge } from "@/components/ui/badge"
import { Bell, Shield, Users, Clock, Settings } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"
import { mockUsers, mockRoles, mockActivityLogs } from "./mock-data"
import type { User, Role, ActivityLog, UserManagementProps } from "../../types/types"

export function UserManagement({
  initialUsers = mockUsers,
  initialRoles = mockRoles,
  initialLogs = mockActivityLogs,
}: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialLogs)
  const [activeTab, setActiveTab] = useState<string>("users")
  const [securityAlerts, setSecurityAlerts] = useState<number>(3)
//   const { toast } = useToast()

  // Simulate fetching data
  useEffect(() => {
    // In a real app, you would fetch data from an API here
    const timer = setTimeout(() => {
      setSecurityAlerts(Math.floor(Math.random() * 5))
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const handleUserUpdate = (updatedUser: User) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))

    // Add to activity logs
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: updatedUser.id,
      userName: updatedUser.name,
      action: "User Updated",
      timestamp: new Date().toISOString(),
      details: `User ${updatedUser.name} was updated`,
      ipAddress: "192.168.1.1",
    }

    setActivityLogs([newLog, ...activityLogs])

    // toast({
    //   title: "User Updated",
    //   description: `${updatedUser.name} has been successfully updated.`,
    // })
  }

  const handleUserDelete = (userId: string) => {
    const userToDelete = users.find((user) => user.id === userId)
    setUsers(users.filter((user) => user.id !== userId))

    // Add to activity logs
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: userId,
      userName: userToDelete?.name || "Unknown",
      action: "User Deleted",
      timestamp: new Date().toISOString(),
      details: `User ${userToDelete?.name || "Unknown"} was deleted`,
      ipAddress: "192.168.1.1",
    }

    setActivityLogs([newLog, ...activityLogs])

    // toast({
    //   title: "User Deleted",
    //   description: `${userToDelete?.name || "User"} has been removed from the system.`,
    //   variant: "destructive",
    // })
  }

  const handleUserCreate = (newUser: Omit<User, "id" | "lastSeen" | "status">) => {
    const userWithId: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      lastSeen: "Never",
      status: "pending",
    }

    setUsers([userWithId, ...users])

    // Add to activity logs
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: userWithId.id,
      userName: userWithId.name,
      action: "User Created",
      timestamp: new Date().toISOString(),
      details: `New user ${userWithId.name} was created`,
      ipAddress: "192.168.1.1",
    }

    setActivityLogs([newLog, ...activityLogs])

    // toast({
    //   title: "User Created",
    //   description: `${userWithId.name} has been added to the system.`,
    // })
  }

  const handleRoleUpdate = (updatedRole: Role) => {
    setRoles(roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)))

    // Add to activity logs
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: "system",
      userName: "System",
      action: "Role Updated",
      timestamp: new Date().toISOString(),
      details: `Role ${updatedRole.name} was updated`,
      ipAddress: "192.168.1.1",
    }

    setActivityLogs([newLog, ...activityLogs])

    // toast({
    //   title: "Role Updated",
    //   description: `${updatedRole.name} role has been updated.`,
    // })
  }

  const handleRoleCreate = (newRole: Omit<Role, "id">) => {
    const roleWithId: Role = {
      ...newRole,
      id: `role-${Date.now()}`,
    }

    setRoles([...roles, roleWithId])

    // Add to activity logs
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: "system",
      userName: "System",
      action: "Role Created",
      timestamp: new Date().toISOString(),
      details: `New role ${roleWithId.name} was created`,
      ipAddress: "192.168.1.1",
    }

    setActivityLogs([newLog, ...activityLogs])

    // toast({
    //   title: "Role Created",
    //   description: `${roleWithId.name} role has been created.`,
    // })
  }

  const handleUserInvite = (inviteDetails: { email: string; role: string }) => {
    // In a real app, you would send an API request to invite the user

    // Add to activity logs
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: "system",
      userName: "System",
      action: "User Invited",
      timestamp: new Date().toISOString(),
      details: `User ${inviteDetails.email} was invited with role ${inviteDetails.role}`,
      ipAddress: "192.168.1.1",
    }

    setActivityLogs([newLog, ...activityLogs])

    // toast({
    //   title: "Invitation Sent",
    //   description: `An invitation has been sent to ${inviteDetails.email}.`,
    // })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users, roles, permissions, and monitor activity</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border-blue-200">
            <Users className="w-3.5 h-3.5 mr-1" />
            {users.length} Users
          </Badge>

          <Badge variant="outline" className="px-3 py-1 text-sm bg-amber-50 text-amber-700 border-amber-200">
            <Shield className="w-3.5 h-3.5 mr-1" />
            {roles.length} Roles
          </Badge>

          {securityAlerts > 0 && (
            <Badge variant="outline" className="px-3 py-1 text-sm bg-red-50 text-red-700 border-red-200">
              <Bell className="w-3.5 h-3.5 mr-1" />
              {securityAlerts} Alerts
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="users" className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Roles & Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span className="hidden md:inline">Activity Logs</span>
          </TabsTrigger>
          <TabsTrigger value="invite" className="flex items-center gap-1.5">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Invite Users</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1.5">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Security Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View, add, edit, and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <UserList
                users={users}
                roles={roles}
                onUserUpdate={handleUserUpdate}
                onUserDelete={handleUserDelete}
                onUserCreate={handleUserCreate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control</CardTitle>
              <CardDescription>Manage roles and their associated permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <RoleManagement roles={roles} onRoleUpdate={handleRoleUpdate} onRoleCreate={handleRoleCreate} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>Monitor user activity and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityLogs logs={activityLogs} users={users} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invite" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invite Users</CardTitle>
              <CardDescription>Send invitations to new users</CardDescription>
            </CardHeader>
            <CardContent>
              <UserInvite roles={roles} onUserInvite={handleUserInvite} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security policies and authentication settings</CardDescription>
            </CardHeader>
            <CardContent>
              <SecuritySettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

