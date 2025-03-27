"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import WordPressSection from "@/components/wordpress-section"

export default function WordPressExamplePage() {
  const [apiUrl, setApiUrl] = useState("https://techcrunch.com")
  const [sectionType, setSectionType] = useState<"posts" | "pages" | "custom">("posts")
  const [layout, setLayout] = useState<"grid" | "list">("grid")
  const [limit, setLimit] = useState(6)
  const [showFilters, setShowFilters] = useState(true)
  const [customEndpoint, setCustomEndpoint] = useState("/wp-json/wp/v2/posts?_embed")
  const [refreshInterval, setRefreshInterval] = useState(0)
  const [title, setTitle] = useState("WordPress Content")
  const [description, setDescription] = useState("Latest content from WordPress")
  const [isConfiguring, setIsConfiguring] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsConfiguring(false)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">WordPress Content Integration</h1>

      {isConfiguring ? (
        <Card>
          <CardHeader>
            <CardTitle>Configure WordPress Section</CardTitle>
            <CardDescription>Set up how you want to display WordPress content in your application</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="api-url">WordPress Site URL</Label>
                      <Input
                        id="api-url"
                        placeholder="https://example.com"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter the base URL of the WordPress site (without trailing slash)
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="section-type">Content Type</Label>
                      <Select
                        value={sectionType}
                        onValueChange={(value) => setSectionType(value as "posts" | "pages" | "custom")}
                      >
                        <SelectTrigger id="section-type">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="posts">Posts</SelectItem>
                          <SelectItem value="pages">Pages</SelectItem>
                          <SelectItem value="custom">Custom Endpoint</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="layout">Layout Style</Label>
                      <Select value={layout} onValueChange={(value) => setLayout(value as "grid" | "list")}>
                        <SelectTrigger id="layout">
                          <SelectValue placeholder="Select layout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid</SelectItem>
                          <SelectItem value="list">List</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="limit">Items Per Page</Label>
                      <Input
                        id="limit"
                        type="number"
                        min="1"
                        max="100"
                        value={limit}
                        onChange={(e) => setLimit(Number.parseInt(e.target.value) || 6)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Section Title</Label>
                      <Input
                        id="title"
                        placeholder="WordPress Content"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Section Description</Label>
                      <Input
                        id="description"
                        placeholder="Latest content from WordPress"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="custom-endpoint">Custom Endpoint</Label>
                      <Input
                        id="custom-endpoint"
                        placeholder="/wp-json/wp/v2/custom-post-type"
                        value={customEndpoint}
                        onChange={(e) => setCustomEndpoint(e.target.value)}
                        disabled={sectionType !== "custom"}
                      />
                      <p className="text-sm text-muted-foreground">Only used when Content Type is set to Custom</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="refresh-interval">Auto-Refresh Interval (ms)</Label>
                      <Input
                        id="refresh-interval"
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="0 (disabled)"
                        value={refreshInterval}
                        onChange={(e) => setRefreshInterval(Number.parseInt(e.target.value) || 0)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Set to 0 to disable auto-refresh (recommended for production)
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="show-filters" checked={showFilters} onCheckedChange={setShowFilters} />
                      <Label htmlFor="show-filters">Show Filtering Options</Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end">
                <Button type="submit">Apply Configuration</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">WordPress Section Preview</h2>
            <Button variant="outline" onClick={() => setIsConfiguring(true)}>
              Edit Configuration
            </Button>
          </div>

          <WordPressSection
            apiUrl={apiUrl}
            defaultSectionType={sectionType}
            defaultLayout={layout}
            title={title}
            description={description}
            limit={limit}
            showFilters={showFilters}
            customEndpoint={customEndpoint}
            refreshInterval={refreshInterval}
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}

