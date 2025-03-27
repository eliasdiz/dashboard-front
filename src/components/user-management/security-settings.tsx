"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Shield, Key, Lock, Clock, Save, RefreshCw, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"
// import type { SecuritySettingsProps } from "./types"

export function SecuritySettings() {
  const [passwordLength, setPasswordLength] = useState<number>(12)
  const [passwordRequireUppercase, setPasswordRequireUppercase] = useState<boolean>(true)
  const [passwordRequireLowercase, setPasswordRequireLowercase] = useState<boolean>(true)
  const [passwordRequireNumbers, setPasswordRequireNumbers] = useState<boolean>(true)
  const [passwordRequireSymbols, setPasswordRequireSymbols] = useState<boolean>(true)
  const [passwordExpiryDays, setPasswordExpiryDays] = useState<number>(90)
  const [twoFactorRequired, setTwoFactorRequired] = useState<boolean>(false)
  const [sessionTimeout, setSessionTimeout] = useState<number>(30)
  const [maxLoginAttempts, setMaxLoginAttempts] = useState<number>(5)
  const [lockoutDuration, setLockoutDuration] = useState<number>(15)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState<boolean>(false)
  // const { toast } = useToast()

  const handleSaveSettings = () => {
    // In a real app, you would save these settings to your backend
    // toast({
    //   title: "Settings Saved",
    //   description: "Security settings have been updated successfully.",
    // })
  }

  const handleResetToDefaults = () => {
    setPasswordLength(12)
    setPasswordRequireUppercase(true)
    setPasswordRequireLowercase(true)
    setPasswordRequireNumbers(true)
    setPasswordRequireSymbols(true)
    setPasswordExpiryDays(90)
    setTwoFactorRequired(false)
    setSessionTimeout(30)
    setMaxLoginAttempts(5)
    setLockoutDuration(15)

    setIsResetDialogOpen(false)

    // toast({
    //   title: "Settings Reset",
    //   description: "Security settings have been reset to defaults.",
    // })
  }

  const calculatePasswordStrength = () => {
    let strength = 0

    // Base points for length
    if (passwordLength >= 8) strength += 1
    if (passwordLength >= 12) strength += 1
    if (passwordLength >= 16) strength += 1

    // Points for complexity
    if (passwordRequireUppercase) strength += 1
    if (passwordRequireLowercase) strength += 1
    if (passwordRequireNumbers) strength += 1
    if (passwordRequireSymbols) strength += 1

    // Return rating based on total points
    if (strength <= 2) return { label: "Weak", color: "bg-red-500" }
    if (strength <= 4) return { label: "Moderate", color: "bg-yellow-500" }
    if (strength <= 6) return { label: "Strong", color: "bg-green-500" }
    return { label: "Very Strong", color: "bg-green-700" }
  }

  const passwordStrength = calculatePasswordStrength()

  return (
    <div className="space-y-6">
      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="password" className="flex items-center gap-1.5">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Password Policy</span>
          </TabsTrigger>
          <TabsTrigger value="authentication" className="flex items-center gap-1.5">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Authentication</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Sessions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>Configure password requirements and expiration settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="password-length">Minimum Password Length: {passwordLength} characters</Label>
                    <span className="text-sm font-medium">
                      <Badge className={`${passwordStrength.color} hover:${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </Badge>
                    </span>
                  </div>
                  <Slider
                    id="password-length"
                    min={8}
                    max={24}
                    step={1}
                    value={[passwordLength]}
                    onValueChange={(value) => setPasswordLength(value[0])}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Password Requirements</Label>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="uppercase"
                        checked={passwordRequireUppercase}
                        onCheckedChange={setPasswordRequireUppercase}
                      />
                      <Label htmlFor="uppercase" className="font-normal">
                        Require uppercase letters
                      </Label>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        passwordRequireUppercase
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {passwordRequireUppercase ? (
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                      )}
                      {passwordRequireUppercase ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="lowercase"
                        checked={passwordRequireLowercase}
                        onCheckedChange={setPasswordRequireLowercase}
                      />
                      <Label htmlFor="lowercase" className="font-normal">
                        Require lowercase letters
                      </Label>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        passwordRequireLowercase
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {passwordRequireLowercase ? (
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                      )}
                      {passwordRequireLowercase ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="numbers"
                        checked={passwordRequireNumbers}
                        onCheckedChange={setPasswordRequireNumbers}
                      />
                      <Label htmlFor="numbers" className="font-normal">
                        Require numbers
                      </Label>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        passwordRequireNumbers
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {passwordRequireNumbers ? (
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                      )}
                      {passwordRequireNumbers ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="symbols"
                        checked={passwordRequireSymbols}
                        onCheckedChange={setPasswordRequireSymbols}
                      />
                      <Label htmlFor="symbols" className="font-normal">
                        Require special characters
                      </Label>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        passwordRequireSymbols
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {passwordRequireSymbols ? (
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                      )}
                      {passwordRequireSymbols ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-expiry">Password Expiration</Label>
                  <Select
                    value={passwordExpiryDays.toString()}
                    onValueChange={(value) => setPasswordExpiryDays(Number.parseInt(value))}
                  >
                    <SelectTrigger id="password-expiry">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">365 days</SelectItem>
                      <SelectItem value="0">Never</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Users will be prompted to change their password after this period
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Settings</CardTitle>
              <CardDescription>Configure two-factor authentication and login security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor" className="text-base">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Require all users to set up 2FA for their accounts
                    </p>
                  </div>
                  <Switch id="two-factor" checked={twoFactorRequired} onCheckedChange={setTwoFactorRequired} />
                </div>

                {twoFactorRequired && (
                  <div className="rounded-md bg-amber-50 border border-amber-200 p-3 mt-2">
                    <div className="flex gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800">Important Notice</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Enabling this setting will require all users to set up 2FA the next time they log in. Users
                          who don`t set up 2FA won`t be able to access their accounts.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="max-attempts">Maximum Login Attempts</Label>
                <Select
                  value={maxLoginAttempts.toString()}
                  onValueChange={(value) => setMaxLoginAttempts(Number.parseInt(value))}
                >
                  <SelectTrigger id="max-attempts">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 attempts</SelectItem>
                    <SelectItem value="5">5 attempts</SelectItem>
                    <SelectItem value="10">10 attempts</SelectItem>
                    <SelectItem value="0">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Number of failed login attempts before account is temporarily locked
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lockout-duration">Account Lockout Duration</Label>
                <Select
                  value={lockoutDuration.toString()}
                  onValueChange={(value) => setLockoutDuration(Number.parseInt(value))}
                >
                  <SelectTrigger id="lockout-duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="1440">24 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  How long accounts remain locked after too many failed attempts
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Label>Authentication Methods</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <h4 className="text-sm font-medium">Email & Password</h4>
                      <p className="text-sm text-muted-foreground">Traditional email and password authentication</p>
                    </div>
                    <Badge>Default</Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <h4 className="text-sm font-medium">Social Login</h4>
                      <p className="text-sm text-muted-foreground">Google, Facebook, and other OAuth providers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <h4 className="text-sm font-medium">Magic Link</h4>
                      <p className="text-sm text-muted-foreground">Passwordless login via email links</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Configure session timeouts and token settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="session-timeout"
                    type="number"
                    min="5"
                    max="1440"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(Number.parseInt(e.target.value))}
                  />
                  <Select defaultValue="minutes">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                  Users will be automatically logged out after this period of inactivity
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="jwt-expiry">JWT Token Expiration</Label>
                <Select defaultValue="1h">
                  <SelectTrigger id="jwt-expiry">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15m">15 minutes</SelectItem>
                    <SelectItem value="30m">30 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="4h">4 hours</SelectItem>
                    <SelectItem value="12h">12 hours</SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  How long JWT tokens remain valid before requiring refresh
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Label>Session Settings</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="remember-me" defaultChecked />
                      <Label htmlFor="remember-me" className="font-normal">
                        Allow `Remember Me` functionality
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="concurrent-sessions" defaultChecked />
                      <Label htmlFor="concurrent-sessions" className="font-normal">
                        Allow concurrent sessions
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="force-logout" />
                      <Label htmlFor="force-logout" className="font-normal">
                        Force logout on password change
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-muted p-4 mt-2">
                <div className="flex gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">Active Sessions</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      View and manage all active user sessions from the User Management dashboard.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Manage Sessions
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Security Settings?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all security settings to their default values. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetToDefaults}>Reset Settings</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}

