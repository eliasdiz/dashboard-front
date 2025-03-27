"use client"

import { useState } from "react"
import { MarketingReviews } from "@/components/marketing-reviews"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function MarketingReviewsExample() {
  const [showFilters, setShowFilters] = useState(true)
  const [showSummary, setShowSummary] = useState(true)
  const [showStats, setShowStats] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Marketing Reviews Component</h1>
      <p className="text-muted-foreground mb-6">
        An interactive component to showcase marketing-related reviews with AI-powered insights
      </p>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Component Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="show-filters" checked={showFilters} onCheckedChange={setShowFilters} />
              <Label htmlFor="show-filters">Show Filters</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="show-summary" checked={showSummary} onCheckedChange={setShowSummary} />
              <Label htmlFor="show-summary">Show AI Summary</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="show-stats" checked={showStats} onCheckedChange={setShowStats} />
              <Label htmlFor="show-stats">Show Statistics</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <MarketingReviews
        title="Marketing Service Reviews"
        subtitle="See what our clients say about our marketing services"
        showFilters={showFilters}
        showSummary={showSummary}
        showStats={showStats}
        darkMode={darkMode}
      />
    </div>
  )
}

