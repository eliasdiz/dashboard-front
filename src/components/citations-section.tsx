"use client"

import { useState } from "react"
import { CitationsComponent } from "@/components/citations-component"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CitationsExample() {
  const [showFilters, setShowFilters] = useState(true)
  const [showInsights, setShowInsights] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Business Citations Component</h1>
      <p className="text-muted-foreground mb-6">
        Track and manage your business listings across multiple platforms with AI-powered insights
      </p>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Component Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="show-filters" checked={showFilters} onCheckedChange={setShowFilters} />
              <Label htmlFor="show-filters">Show Filters</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="show-insights" checked={showInsights} onCheckedChange={setShowInsights} />
              <Label htmlFor="show-insights">Show AI Insights</Label>
            </div>

            <div>
              <Label htmlFor="view-mode" className="mb-2 block">
                Default View
              </Label>
              <Tabs
                value={viewMode}
                onValueChange={(value) => setViewMode(value as "grid" | "table")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <CitationsComponent
        businessName="Acme Marketing Agency"
        showFilters={showFilters}
        showInsights={showInsights}
        defaultView={viewMode}
      />
    </div>
  )
}

