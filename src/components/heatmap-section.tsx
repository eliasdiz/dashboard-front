"use client"

import { useState } from "react"
import { HeatmapComponent } from "@/components/heatmap-component"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HeatmapExample() {
  const [showControls, setShowControls] = useState(true)
  const [heatmapType, setHeatmapType] = useState<"click" | "scroll" | "engagement">("click")
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">("desktop")

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Interactive Heatmap Analysis</h1>
      <p className="text-muted-foreground mb-6">
        Visualize user behavior and interactions on your website with advanced heatmap analytics
      </p>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Component Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="show-controls" checked={showControls} onCheckedChange={setShowControls} />
              <Label htmlFor="show-controls">Show Controls</Label>
            </div>

            <div>
              <Label htmlFor="heatmap-type" className="mb-2 block">
                Heatmap Type
              </Label>
              <Tabs
                value={heatmapType}
                onValueChange={(value) => setHeatmapType(value as "click" | "scroll" | "engagement")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="click">Click</TabsTrigger>
                  <TabsTrigger value="scroll">Scroll</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div>
              <Label htmlFor="device-type" className="mb-2 block">
                Device Type
              </Label>
              <Tabs
                value={deviceType}
                onValueChange={(value) => setDeviceType(value as "desktop" | "tablet" | "mobile")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="desktop">Desktop</TabsTrigger>
                  <TabsTrigger value="tablet">Tablet</TabsTrigger>
                  <TabsTrigger value="mobile">Mobile</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <HeatmapComponent showControls={showControls} defaultType={heatmapType} defaultDevice={deviceType} />
    </div>
  )
}

