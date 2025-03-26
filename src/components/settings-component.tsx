"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import {
  Copy,
  Globe,
  Info,
  Key,
  Lock,
  Mail,
  RefreshCw,
  Save,
  Shield,
  Users,
  Building,
  BarChart,
  Clock,
  Fingerprint,
  Megaphone,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Environment types
type Environment = "development" | "production" | "staging"

// Define schemas for each settings section
const apiIntegrationsSchema = z.object({
  wordpressUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  wordpressApiKey: z.string().optional(),
  googleAnalyticsId: z
    .string()
    .regex(/^UA-\d{4,10}-\d{1,4}$|^G-[A-Z0-9]{10}$/, {
      message: "Invalid Google Analytics ID format (e.g., UA-XXXXX-Y or G-XXXXXXXXXX)",
    })
    .optional()
    .or(z.literal("")),
  crmApiKey: z.string().min(10, { message: "API key should be at least 10 characters" }).optional().or(z.literal("")),
  crmEndpoint: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  mailchimpApiKey: z.string().optional(),
  mailchimpListId: z.string().optional(),
})

const authSettingsSchema = z.object({
  enableTwoFactor: z.boolean().default(false),
  defaultRole: z.string(),
  jwtExpiration: z.number().int().min(1).max(30),
  passwordPolicy: z.object({
    minLength: z.number().int().min(8).max(32),
    requireUppercase: z.boolean().default(true),
    requireNumbers: z.boolean().default(true),
    requireSpecialChars: z.boolean().default(true),
  }),
  maxLoginAttempts: z.number().int().min(1).max(10),
  sessionTimeout: z.number().int().min(5).max(1440),
})

const businessInfoSchema = z.object({
  businessName: z.string().min(2, { message: "Business name must be at least 2 characters" }),
  contactEmail: z.string().email({ message: "Please enter a valid email address" }),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  timezone: z.string(),
  defaultLocale: z.string(),
  businessHours: z.object({
    mondayToFriday: z.string(),
    saturday: z.string().optional(),
    sunday: z.string().optional(),
  }),
  logoUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
})

const marketingPreferencesSchema = z.object({
  enableTracking: z.boolean().default(true),
  trackingCookieExpiration: z.number().int().min(1).max(365),
  defaultEmailTemplate: z.string(),
  emailFooterText: z.string().optional(),
  socialMediaLinks: z.object({
    facebook: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
    twitter: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
    linkedin: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
    instagram: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  }),
  automationRules: z.object({
    sendWelcomeEmail: z.boolean().default(true),
    leadFollowUpDays: z.number().int().min(0).max(30),
    enableAbandonedCartEmails: z.boolean().default(true),
  }),
})

// Combined schema for all settings
const settingsSchema = z.object({
  apiIntegrations: apiIntegrationsSchema,
  authSettings: authSettingsSchema,
  businessInfo: businessInfoSchema,
  marketingPreferences: marketingPreferencesSchema,
})

type SettingsValues = z.infer<typeof settingsSchema>

// Default values for the form
const defaultValues: SettingsValues = {
  apiIntegrations: {
    wordpressUrl: "",
    wordpressApiKey: "",
    googleAnalyticsId: "",
    crmApiKey: "",
    crmEndpoint: "",
    mailchimpApiKey: "",
    mailchimpListId: "",
  },
  authSettings: {
    enableTwoFactor: false,
    defaultRole: "user",
    jwtExpiration: 7,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    maxLoginAttempts: 5,
    sessionTimeout: 60,
  },
  businessInfo: {
    businessName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    website: "",
    timezone: "UTC",
    defaultLocale: "en-US",
    businessHours: {
      mondayToFriday: "9:00 AM - 5:00 PM",
      saturday: "",
      sunday: "",
    },
    logoUrl: "",
  },
  marketingPreferences: {
    enableTracking: true,
    trackingCookieExpiration: 30,
    defaultEmailTemplate: "default",
    emailFooterText: "",
    socialMediaLinks: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
    },
    automationRules: {
      sendWelcomeEmail: true,
      leadFollowUpDays: 3,
      enableAbandonedCartEmails: true,
    },
  },
}

interface SettingsComponentProps {
  initialValues?: Partial<SettingsValues>
  environment?: Environment
  onSave?: (values: SettingsValues) => Promise<void>
  className?: string
}

export function SettingsComponent({
  initialValues,
  environment = "development",
  onSave,
  className,
}: SettingsComponentProps) {
  const [activeTab, setActiveTab] = useState("api-integrations")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})

  // Merge default values with initial values
  const mergedValues = {
    ...defaultValues,
    ...initialValues,
    apiIntegrations: {
      ...defaultValues.apiIntegrations,
      ...initialValues?.apiIntegrations,
    },
    authSettings: {
      ...defaultValues.authSettings,
      ...initialValues?.authSettings,
      passwordPolicy: {
        ...defaultValues.authSettings.passwordPolicy,
        ...initialValues?.authSettings?.passwordPolicy,
      },
    },
    businessInfo: {
      ...defaultValues.businessInfo,
      ...initialValues?.businessInfo,
      businessHours: {
        ...defaultValues.businessInfo.businessHours,
        ...initialValues?.businessInfo?.businessHours,
      },
    },
    marketingPreferences: {
      ...defaultValues.marketingPreferences,
      ...initialValues?.marketingPreferences,
      socialMediaLinks: {
        ...defaultValues.marketingPreferences.socialMediaLinks,
        ...initialValues?.marketingPreferences?.socialMediaLinks,
      },
      automationRules: {
        ...defaultValues.marketingPreferences.automationRules,
        ...initialValues?.marketingPreferences?.automationRules,
      },
    },
  }

  // Initialize form with react-hook-form and zod validation
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: mergedValues,
    mode: "onChange",
  })

  // Handle form submission
  const onSubmit = async (values: SettingsValues) => {
    console.log(values)
    setShowConfirmDialog(true)
  }

  // Handle save confirmation
  const handleConfirmSave = async () => {
    setIsSubmitting(true)
    setShowConfirmDialog(false)

    try {
      if (onSave) {
        await onSave(form.getValues())
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

    //   toast({
    //     title: "Settings saved successfully",
    //     description: "Your changes have been applied.",
    //     duration: 5000,
    //   })
    } catch (error) {
      console.error("Error saving settings:", error)
    //   toast({
    //     title: "Error saving settings",
    //     description: "An error occurred while saving your settings. Please try again.",
    //     variant: "destructive",
    //     duration: 5000,
    //   })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form reset
  const handleReset = () => {
    form.reset(mergedValues)
    // toast({
    //   title: "Settings reset",
    //   description: "All changes have been discarded.",
    //   duration: 3000,
    // })
  }

  // Toggle API key visibility
  const toggleApiKeyVisibility = (key: string) => {
    setShowApiKey((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Copy to clipboard function
  const copyToClipboard = (text: string, label: string) => {
    console.log(label)
    navigator.clipboard.writeText(text)
    // toast({
    //   title: "Copied to clipboard",
    //   description: `${label} has been copied to your clipboard.`,
    //   duration: 3000,
    // })
  }

  // Render environment badge
  const renderEnvironmentBadge = () => {
    switch (environment) {
      case "development":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            🔵 Development
          </Badge>
        )
      case "production":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            🟢 Production
          </Badge>
        )
      case "staging":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            🟡 Staging
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Settings</CardTitle>
              <CardDescription>Configure your application settings and preferences</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {renderEnvironmentBadge()}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current environment: {environment}</p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {format(new Date(), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="api-integrations" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
                  <TabsTrigger value="api-integrations" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    <span className="hidden sm:inline">API & Integrations</span>
                    <span className="sm:hidden">API</span>
                  </TabsTrigger>
                  <TabsTrigger value="auth-settings" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Authentication</span>
                    <span className="sm:hidden">Auth</span>
                  </TabsTrigger>
                  <TabsTrigger value="business-info" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span className="hidden sm:inline">Business Info</span>
                    <span className="sm:hidden">Business</span>
                  </TabsTrigger>
                  <TabsTrigger value="marketing-preferences" className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    <span className="hidden sm:inline">Marketing</span>
                    <span className="sm:hidden">Marketing</span>
                  </TabsTrigger>
                </TabsList>

                {/* API Integrations Tab */}
                <TabsContent value="api-integrations" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">API Keys & Integrations</h3>
                      <Badge variant="outline" className="text-xs">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Last synced: {format(new Date(), "MMM d, yyyy")}
                      </Badge>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {/* WordPress Integration */}
                      <AccordionItem value="wordpress">
                        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span>WordPress Integration</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4 space-y-4">
                          <FormField
                            control={form.control}
                            name="apiIntegrations.wordpressUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>WordPress Site URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://your-wordpress-site.com" {...field} />
                                </FormControl>
                                <FormDescription>Enter the URL of your WordPress site</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="apiIntegrations.wordpressApiKey"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>API Key</FormLabel>
                                <div className="flex">
                                  <FormControl>
                                    <div className="flex-1 flex items-center">
                                      <Input
                                        type={showApiKey.wordpress ? "text" : "password"}
                                        placeholder="Enter your WordPress API key"
                                        {...field}
                                        className="rounded-r-none"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="rounded-l-none border-l-0"
                                        onClick={() => toggleApiKeyVisibility("wordpress")}
                                      >
                                        {showApiKey.wordpress ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="ml-2"
                                    onClick={() => copyToClipboard(field.value || "", "WordPress API Key")}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <FormDescription>Your WordPress REST API authentication key</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </AccordionContent>
                      </AccordionItem>

                      {/* Google Analytics Integration */}
                      <AccordionItem value="google-analytics">
                        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                          <div className="flex items-center gap-2">
                            <BarChart className="h-4 w-4" />
                            <span>Google Analytics</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4">
                          <FormField
                            control={form.control}
                            name="apiIntegrations.googleAnalyticsId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Google Analytics ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="UA-XXXXX-Y or G-XXXXXXXXXX" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Your Google Analytics tracking ID (UA-XXXXX-Y or G-XXXXXXXXXX format)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </AccordionContent>
                      </AccordionItem>

                      {/* CRM Integration */}
                      <AccordionItem value="crm">
                        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>CRM Integration</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4 space-y-4">
                          <FormField
                            control={form.control}
                            name="apiIntegrations.crmEndpoint"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CRM API Endpoint</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://your-crm-api.com/api/v1" {...field} />
                                </FormControl>
                                <FormDescription>The endpoint URL for your CRM API</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="apiIntegrations.crmApiKey"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CRM API Key</FormLabel>
                                <div className="flex">
                                  <FormControl>
                                    <div className="flex-1 flex items-center">
                                      <Input
                                        type={showApiKey.crm ? "text" : "password"}
                                        placeholder="Enter your CRM API key"
                                        {...field}
                                        className="rounded-r-none"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="rounded-l-none border-l-0"
                                        onClick={() => toggleApiKeyVisibility("crm")}
                                      >
                                        {showApiKey.crm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="ml-2"
                                    onClick={() => copyToClipboard(field.value || "", "CRM API Key")}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <FormDescription>Your CRM API authentication key</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </AccordionContent>
                      </AccordionItem>

                      {/* Mailchimp Integration */}
                      <AccordionItem value="mailchimp">
                        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>Mailchimp Integration</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4 space-y-4">
                          <FormField
                            control={form.control}
                            name="apiIntegrations.mailchimpApiKey"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mailchimp API Key</FormLabel>
                                <div className="flex">
                                  <FormControl>
                                    <div className="flex-1 flex items-center">
                                      <Input
                                        type={showApiKey.mailchimp ? "text" : "password"}
                                        placeholder="Enter your Mailchimp API key"
                                        {...field}
                                        className="rounded-r-none"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="rounded-l-none border-l-0"
                                        onClick={() => toggleApiKeyVisibility("mailchimp")}
                                      >
                                        {showApiKey.mailchimp ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="ml-2"
                                    onClick={() => copyToClipboard(field.value || "", "Mailchimp API Key")}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <FormDescription>Your Mailchimp API authentication key</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="apiIntegrations.mailchimpListId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mailchimp List ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your Mailchimp List ID" {...field} />
                                </FormControl>
                                <FormDescription>The ID of your Mailchimp audience/list</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </TabsContent>

                {/* Authentication Settings Tab */}
                <TabsContent value="auth-settings" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Authentication Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="authSettings.enableTwoFactor"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                                <FormDescription>Require two-factor authentication for all users</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="authSettings.defaultRole"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Default User Role</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a default role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="admin">Administrator</SelectItem>
                                  <SelectItem value="editor">Editor</SelectItem>
                                  <SelectItem value="author">Author</SelectItem>
                                  <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>The default role assigned to new users</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="authSettings.jwtExpiration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>JWT Token Expiration (days)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>Number of days before JWT tokens expire</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="authSettings.maxLoginAttempts"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Login Attempts</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>Number of failed login attempts before account lockout</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="authSettings.sessionTimeout"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Session Timeout (minutes)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Number of minutes of inactivity before a user is logged out
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                          <h4 className="font-medium mb-3 flex items-center">
                            <Lock className="h-4 w-4 mr-2" />
                            Password Policy
                          </h4>

                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="authSettings.passwordPolicy.minLength"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Minimum Password Length</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="authSettings.passwordPolicy.requireUppercase"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                  <FormLabel>Require Uppercase Letters</FormLabel>
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="authSettings.passwordPolicy.requireNumbers"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                  <FormLabel>Require Numbers</FormLabel>
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="authSettings.passwordPolicy.requireSpecialChars"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                  <FormLabel>Require Special Characters</FormLabel>
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <h4 className="font-medium mb-3 flex items-center">
                            <Fingerprint className="h-4 w-4 mr-2" />
                            Security Features
                          </h4>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">CAPTCHA Protection</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Enabled
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm">IP Blocking</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Enabled
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm">Brute Force Protection</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Enabled
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Business Information Tab */}
                <TabsContent value="business-info" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Business Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="businessInfo.businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your Business Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessInfo.contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Email</FormLabel>
                              <FormControl>
                                <Input placeholder="contact@yourbusiness.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessInfo.contactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessInfo.address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Address</FormLabel>
                              <FormControl>
                                <Textarea placeholder="123 Business St, City, State, ZIP" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessInfo.website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://www.yourbusiness.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="businessInfo.timezone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Timezone</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a timezone" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="UTC">UTC</SelectItem>
                                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>Your business`s primary timezone</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessInfo.defaultLocale"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Default Locale</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a locale" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="en-US">English (US)</SelectItem>
                                  <SelectItem value="en-GB">English (UK)</SelectItem>
                                  <SelectItem value="es-ES">Spanish</SelectItem>
                                  <SelectItem value="fr-FR">French</SelectItem>
                                  <SelectItem value="de-DE">German</SelectItem>
                                  <SelectItem value="ja-JP">Japanese</SelectItem>
                                  <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>Default language and region format</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="rounded-lg border p-4">
                          <h4 className="font-medium mb-3 flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Business Hours
                          </h4>

                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="businessInfo.businessHours.mondayToFriday"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Monday to Friday</FormLabel>
                                  <FormControl>
                                    <Input placeholder="9:00 AM - 5:00 PM" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="businessInfo.businessHours.saturday"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Saturday</FormLabel>
                                  <FormControl>
                                    <Input placeholder="10:00 AM - 3:00 PM (leave empty if closed)" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="businessInfo.businessHours.sunday"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sunday</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Closed (leave empty if closed)" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="businessInfo.logoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Logo URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://yourbusiness.com/logo.png" {...field} />
                              </FormControl>
                              <FormDescription>URL to your business logo image</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Marketing Preferences Tab */}
                <TabsContent value="marketing-preferences" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Marketing Preferences</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="marketingPreferences.enableTracking"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Enable User Tracking</FormLabel>
                                <FormDescription>
                                  Track user behavior for analytics and marketing purposes
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="marketingPreferences.trackingCookieExpiration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tracking Cookie Expiration (days)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>Number of days before tracking cookies expire</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="marketingPreferences.defaultEmailTemplate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Default Email Template</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a template" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="default">Default Template</SelectItem>
                                  <SelectItem value="minimal">Minimal</SelectItem>
                                  <SelectItem value="corporate">Corporate</SelectItem>
                                  <SelectItem value="promotional">Promotional</SelectItem>
                                  <SelectItem value="newsletter">Newsletter</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>Default template for marketing emails</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="marketingPreferences.emailFooterText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Footer Text</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter your email footer text, including any legal disclaimers"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>Text to appear in the footer of all marketing emails</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                          <h4 className="font-medium mb-3 flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            Social Media Links
                          </h4>

                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="marketingPreferences.socialMediaLinks.facebook"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Facebook</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://facebook.com/yourbusiness" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="marketingPreferences.socialMediaLinks.twitter"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Twitter</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://twitter.com/yourbusiness" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="marketingPreferences.socialMediaLinks.linkedin"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>LinkedIn</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://linkedin.com/company/yourbusiness" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="marketingPreferences.socialMediaLinks.instagram"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Instagram</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://instagram.com/yourbusiness" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <h4 className="font-medium mb-3 flex items-center">
                            <Megaphone className="h-4 w-4 mr-2" />
                            Automation Rules
                          </h4>

                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="marketingPreferences.automationRules.sendWelcomeEmail"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                  <FormLabel>Send Welcome Email</FormLabel>
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="marketingPreferences.automationRules.leadFollowUpDays"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Lead Follow-Up (days)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormDescription>Days to wait before following up with new leads</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="marketingPreferences.automationRules.enableAbandonedCartEmails"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                  <FormLabel>Abandoned Cart Emails</FormLabel>
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator />

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset Changes
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these changes? This will update your application settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave}>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

