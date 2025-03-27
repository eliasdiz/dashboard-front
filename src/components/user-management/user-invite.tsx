"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Link, Copy, Check, Send, Users, UserPlus, FileText } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { useToast } from "@/components/ui/use-toast"
import type { UserInviteProps } from "../../types/types"

const singleInviteSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string().min(1, { message: "Please select a role." }),
  message: z.string().optional(),
  sendCopy: z.boolean().default(false),
})

const bulkInviteSchema = z.object({
  emails: z.string().min(1, { message: "Please enter at least one email address." }),
  role: z.string().min(1, { message: "Please select a role." }),
  message: z.string().optional(),
})

type SingleInviteFormValues = z.infer<typeof singleInviteSchema>
type BulkInviteFormValues = z.infer<typeof bulkInviteSchema>

export function UserInvite({ roles, onUserInvite }: UserInviteProps) {
  const [inviteMethod, setInviteMethod] = useState<"email" | "link">("email")
  const [inviteType, setInviteType] = useState<"single" | "bulk">("single")
  const [copied, setCopied] = useState<boolean>(false)
//   const { toast } = useToast()

  const singleForm = useForm<SingleInviteFormValues>({
    resolver: zodResolver(singleInviteSchema),
    defaultValues: {
      email: "",
      role: "",
      message: "",
      sendCopy: false,
    },
  })

  const bulkForm = useForm<BulkInviteFormValues>({
    resolver: zodResolver(bulkInviteSchema),
    defaultValues: {
      emails: "",
      role: "",
      message: "",
    },
  })

  const handleSingleInvite = (data: SingleInviteFormValues) => {
    onUserInvite(data)
    singleForm.reset()

    // toast({
    //   title: "Invitation Sent",
    //   description: `An invitation has been sent to ${data.email}.`,
    // })
  }

  const handleBulkInvite = (data: BulkInviteFormValues) => {
    const emailList = data.emails
      .split(/[\n,]/)
      .map((email) => email.trim())
      .filter(Boolean)

    emailList.forEach((email) => {
      onUserInvite({
        email,
        role: data.role,
        message: data.message,
      })
    })

    bulkForm.reset()

    // toast({
    //   title: "Invitations Sent",
    //   description: `${emailList.length} invitations have been sent.`,
    // })
  }

  const generateInviteLink = () => {
    const token = Math.random().toString(36).substring(2, 15)
    return `https://yourdomain.com/invite/${token}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateInviteLink())
    setCopied(true)

    // toast({
    //   title: "Link Copied",
    //   description: "Invitation link has been copied to clipboard.",
    // })

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Tabs
        value={inviteType}
        onValueChange={(value: string) => setInviteType(value as "single" | "bulk")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single" className="flex items-center gap-1.5">
            <UserPlus className="h-4 w-4" />
            <span>Single User</span>
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>Bulk Invite</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4 pt-4">
          <div className="flex space-x-2">
            <Button
              variant={inviteMethod === "email" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setInviteMethod("email")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Invitation
            </Button>
            <Button
              variant={inviteMethod === "link" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setInviteMethod("link")}
            >
              <Link className="h-4 w-4 mr-2" />
              Invitation Link
            </Button>
          </div>

          {inviteMethod === "email" ? (
            <Form {...singleForm}>
              <form onSubmit={singleForm.handleSubmit(handleSingleInvite)} className="space-y-4">
                <FormField
                  control={singleForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={singleForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={singleForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a personal message to the invitation email"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={singleForm.control}
                  name="sendCopy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Send me a copy</FormLabel>
                        <FormDescription>Receive a copy of the invitation email</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </form>
            </Form>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Generate Invitation Link</CardTitle>
                <CardDescription>Create a unique invitation link that can be shared with a user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Expiration</Label>
                  <Select defaultValue="7days">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24hours">24 Hours</SelectItem>
                      <SelectItem value="7days">7 Days</SelectItem>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="never">Never Expires</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <div className="flex items-center">
                    <Input value={generateInviteLink()} readOnly className="pr-20" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-12 hover:bg-transparent"
                      onClick={copyToClipboard}
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      <span className="sr-only">Copy</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={copyToClipboard}>
                  {copied ? "Copied!" : "Copy Invitation Link"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4 pt-4">
          <Form {...bulkForm}>
            <form onSubmit={bulkForm.handleSubmit(handleBulkInvite)} className="space-y-4">
              <FormField
                control={bulkForm.control}
                name="emails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Addresses</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter email addresses (one per line or comma-separated)"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter multiple email addresses, one per line or separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={bulkForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={bulkForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a personal message to the invitation emails"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Bulk Invitations
              </Button>
            </form>
          </Form>

          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Bulk Import</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  You can also import users from a CSV file with columns for email, name, and role.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Import from CSV
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

