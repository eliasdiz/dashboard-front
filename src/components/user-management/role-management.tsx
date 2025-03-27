"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Shield, Plus, Check, X, Edit, HelpCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { PermissionCategory, RoleManagementProps } from "../../types/types.js"

const roleFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
  permissions: z.record(z.boolean()).optional(),
})

type RoleFormValues = z.infer<typeof roleFormSchema>

// Permission categories and their items
const permissionCategories: PermissionCategory[] = [
  {
    id: "users",
    name: "User Management",
    permissions: [
      { id: "users.view", name: "View Users", description: "Can view user list and profiles" },
      { id: "users.create", name: "Create Users", description: "Can create new user accounts" },
      { id: "users.edit", name: "Edit Users", description: "Can modify user information" },
      { id: "users.delete", name: "Delete Users", description: "Can delete user accounts" },
    ],
  },
  {
    id: "roles",
    name: "Role Management",
    permissions: [
      { id: "roles.view", name: "View Roles", description: "Can view roles and permissions" },
      { id: "roles.create", name: "Create Roles", description: "Can create new roles" },
      { id: "roles.edit", name: "Edit Roles", description: "Can modify role permissions" },
      { id: "roles.delete", name: "Delete Roles", description: "Can delete roles" },
    ],
  },
  {
    id: "content",
    name: "Content Management",
    permissions: [
      { id: "content.view", name: "View Content", description: "Can view all content" },
      { id: "content.create", name: "Create Content", description: "Can create new content" },
      { id: "content.edit", name: "Edit Content", description: "Can modify existing content" },
      { id: "content.publish", name: "Publish Content", description: "Can publish content live" },
      { id: "content.delete", name: "Delete Content", description: "Can delete content" },
    ],
  },
  {
    id: "settings",
    name: "System Settings",
    permissions: [
      { id: "settings.view", name: "View Settings", description: "Can view system settings" },
      { id: "settings.edit", name: "Edit Settings", description: "Can modify system settings" },
      { id: "settings.security", name: "Security Settings", description: "Can modify security settings" },
    ],
  },
  {
    id: "reports",
    name: "Reports & Analytics",
    permissions: [
      { id: "reports.view", name: "View Reports", description: "Can view reports and analytics" },
      { id: "reports.export", name: "Export Reports", description: "Can export reports" },
      { id: "reports.create", name: "Create Reports", description: "Can create custom reports" },
    ],
  },
]

export function RoleManagement({ roles, onRoleUpdate, onRoleCreate }: RoleManagementProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(roles[0]?.id || null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const createForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: {},
    },
  })

  const editForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: {},
    },
  })

  const handleCreateSubmit = (data: RoleFormValues) => {
    onRoleCreate({
      name: data.name,
      description: data.description,
      permissions: data.permissions || {},
    })
    createForm.reset()
    setIsCreateDialogOpen(false)
  }

  const handleEditSubmit = (data: RoleFormValues) => {
    const currentRole = roles.find((r) => r.id === selectedRole)
    if (currentRole) {
      onRoleUpdate({
        ...currentRole,
        name: data.name,
        description: data.description,
        permissions: data.permissions || {},
      })
      setIsEditMode(false)
    }
  }

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    setIsEditMode(false)

    const role = roles.find((r) => r.id === roleId)
    if (role) {
      editForm.reset({
        name: role.name,
        description: role.description || "",
        permissions: role.permissions || {},
      })
    }
  }

  const handleEditClick = () => {
    const role = roles.find((r) => r.id === selectedRole)
    if (role) {
      editForm.reset({
        name: role.name,
        description: role.description || "",
        permissions: role.permissions || {},
      })
      setIsEditMode(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
  }

  const currentRole = roles.find((r) => r.id === selectedRole)

  // Initialize all permissions for a new role
//   const initializePermissions = () => {
//     const permissions: Record<string, boolean> = {}
//     permissionCategories.forEach((category) => {
//       category.permissions.forEach((permission) => {
//         permissions[permission.id] = false
//       })
//     })
//     return permissions
//   }

  // Helper to check if a permission is granted
  const hasPermission = (permissionId: string): boolean => {
    if (!currentRole || !currentRole.permissions) return false
    return !!currentRole.permissions[permissionId]
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Roles</h3>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8">
                  <Plus className="h-4 w-4 mr-1" />
                  New Role
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>Define a new role with specific permissions.</DialogDescription>
                </DialogHeader>

                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4 py-2">
                    <FormField
                      control={createForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Content Manager" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the purpose of this role"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label>Default Permissions</Label>
                      <div className="text-sm text-muted-foreground mb-2">
                        You can configure detailed permissions after creating the role.
                      </div>

                      {permissionCategories.slice(0, 2).map((category) => (
                        <div key={category.id} className="space-y-2">
                          <h4 className="text-sm font-medium">{category.name}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {category.permissions.map((permission) => (
                              <FormField
                                key={permission.id}
                                control={createForm.control}
                                name={`permissions.${permission.id}`}
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">{permission.name}</FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <DialogFooter>
                      <Button type="submit">Create Role</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-md">
            <div className="divide-y">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`p-3 cursor-pointer hover:bg-muted transition-colors ${selectedRole === role.id ? "bg-muted" : ""}`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                      {role.name}
                    </div>
                    {role.isSystem && (
                      <Badge variant="outline" className="text-xs">
                        System
                      </Badge>
                    )}
                  </div>
                  {role.description && <p className="text-sm text-muted-foreground mt-1">{role.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-2/3">
          {currentRole ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      {currentRole.name}
                      {currentRole.isSystem && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          System
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{currentRole.description}</CardDescription>
                  </div>

                  {!isEditMode && !currentRole.isSystem && (
                    <Button variant="outline" size="sm" onClick={handleEditClick}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Role
                    </Button>
                  )}

                  {isEditMode && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={editForm.handleSubmit(handleEditSubmit)}>
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {isEditMode ? (
                  <Form {...editForm}>
                    <form className="space-y-4">
                      <FormField
                        control={editForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={editForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <Label>Permissions</Label>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-6">
                            {permissionCategories.map((category) => (
                              <div key={category.id} className="space-y-3">
                                <h4 className="font-medium">{category.name}</h4>
                                <div className="space-y-2">
                                  {category.permissions.map((permission) => (
                                    <FormField
                                      key={permission.id}
                                      control={editForm.control}
                                      name={`permissions.${permission.id}`}
                                      render={({ field }) => (
                                        <FormItem className="flex items-start space-x-3 space-y-0">
                                          <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                          </FormControl>
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="text-sm font-medium">{permission.name}</FormLabel>
                                            <FormDescription className="text-xs">
                                              {permission.description}
                                            </FormDescription>
                                          </div>
                                        </FormItem>
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Permissions Matrix</h3>
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[250px]">Permission</TableHead>
                              <TableHead>Access</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {permissionCategories.map((category) => (
                              <>
                                <TableRow key={category.id} className="bg-muted/50">
                                  <TableCell colSpan={2} className="font-medium">
                                    {category.name}
                                  </TableCell>
                                </TableRow>
                                {category.permissions.map((permission) => (
                                  <TableRow key={permission.id}>
                                    <TableCell className="flex items-center">
                                      {permission.name}
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="ghost" className="h-6 w-6 p-0 ml-1">
                                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                              <span className="sr-only">Info</span>
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="max-w-xs">{permission.description}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </TableCell>
                                    <TableCell>
                                      {hasPermission(permission.id) ? (
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                          <Check className="h-3.5 w-3.5 mr-1" />
                                          Allowed
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className="bg-red-50 text-red-800 hover:bg-red-50 border-red-200"
                                        >
                                          <X className="h-3.5 w-3.5 mr-1" />
                                          Denied
                                        </Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full border rounded-lg p-8">
              <div className="text-center">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Role Selected</h3>
                <p className="text-muted-foreground mt-1">
                  Select a role from the list to view and manage its permissions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

