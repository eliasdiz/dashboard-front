"use client"

import { useState } from "react"
import { SettingsComponent } from "@/components/settings-component"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Info, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const [environment, setEnvironment] = useState<"development" | "production" | "staging">("development")

  // Example initial values
  const initialValues = {
    apiIntegrations: {
      wordpressUrl: "https://example-blog.com",
      wordpressApiKey: "wp_api_12345",
      googleAnalyticsId: "UA-12345-6",
      crmApiKey: "crm_secret_key_67890",
      crmEndpoint: "https://example-crm.com/api",
    },
    businessInfo: {
      businessName: "Acme Corporation",
      contactEmail: "contact@acmecorp.com",
      contactPhone: "+1 (555) 123-4567",
      address: "123 Business Ave, Suite 100\nTech City, CA 94043",
      website: "https://acmecorp.com",
    },
  }

  // Mock save function
  const handleSave = async (values: any) => {
    console.log("Saving settings:", values)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return Promise.resolve()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your application environment and preferences</p>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={environment} onValueChange={(value: any) => setEnvironment(value)}>
            <TabsList>
              <TabsTrigger value="development">Development</TabsTrigger>
              <TabsTrigger value="staging">Staging</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Environment Information</CardTitle>
          <CardDescription>Current system configuration and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Environment</span>
              <div className="flex items-center">
                <Badge
                  variant="outline"
                  className={
                    environment === "development"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : environment === "production"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }
                >
                  {environment === "development"
                    ? "🔵 Development"
                    : environment === "production"
                      ? "🟢 Production"
                      : "🟡 Staging"}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">API Status</span>
              <div className="flex items-center">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Operational
                </Badge>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <div className="flex items-center">
                <span className="text-sm">Today at 10:30 AM</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="h-4 w-4 mr-2" />
            <span>Changes made in this environment will not affect other environments.</span>
          </div>
        </CardContent>
      </Card>

      <SettingsComponent initialValues={initialValues} environment={environment} onSave={handleSave} />
    </div>
  )
}