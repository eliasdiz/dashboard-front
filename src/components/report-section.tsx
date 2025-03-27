"use client"

import { useState } from "react"
import { ReportTable } from "@/components/report-table"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportExample() {
  const [showFilters, setShowFilters] = useState(true)
  const [showExport, setShowExport] = useState(true)
  const [pageSize, setPageSize] = useState("10")

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Report Table Component</h1>
      <p className="text-muted-foreground mb-6">
        Generate and analyze reports with advanced filtering, sorting, and export capabilities
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
              <Switch id="show-export" checked={showExport} onCheckedChange={setShowExport} />
              <Label htmlFor="show-export">Show Export</Label>
            </div>

            <div>
              <Label htmlFor="page-size" className="mb-2 block">
                Items Per Page
              </Label>
              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger id="page-size">
                  <SelectValue placeholder="Select page size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 items</SelectItem>
                  <SelectItem value="10">10 items</SelectItem>
                  <SelectItem value="20">20 items</SelectItem>
                  <SelectItem value="50">50 items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <ReportTable
        title="Monthly Reports"
        description="View and analyze your monthly business reports"
        showFilters={showFilters}
        showExport={showExport}
        defaultPageSize={Number.parseInt(pageSize)}
      />
    </div>
  )
}

