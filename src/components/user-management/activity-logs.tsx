"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Filter, Calendar, X, ChevronDown, Download, Eye } from "lucide-react"
import { format, parseISO, isAfter, isBefore, subDays } from "date-fns"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import type { ActivityLog, ActivityLogsProps } from "../../types/types.js"

export function ActivityLogs({ logs, users }: ActivityLogsProps) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [userFilter, setUserFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)

  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log)
    setIsDetailsOpen(true)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setActionFilter("all")
    setUserFilter("all")
    setDateFilter("all")
    setStartDate(null)
    setEndDate(null)
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case "User Created":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {action}
          </Badge>
        )
      case "User Updated":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {action}
          </Badge>
        )
      case "User Deleted":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {action}
          </Badge>
        )
      case "Login Success":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {action}
          </Badge>
        )
      case "Login Failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {action}
          </Badge>
        )
      case "Role Created":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {action}
          </Badge>
        )
      case "Role Updated":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {action}
          </Badge>
        )
      case "User Invited":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {action}
          </Badge>
        )
      default:
        return <Badge variant="outline">{action}</Badge>
    }
  }

  const filteredLogs = logs.filter((log) => {
    // Search filter
    const matchesSearch =
      log.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase())

    // Action filter
    const matchesAction = actionFilter === "all" || log.action === actionFilter

    // User filter
    const matchesUser = userFilter === "all" || log.userId === userFilter

    // Date filter
    let matchesDate = true
    const logDate = parseISO(log.timestamp)

    if (dateFilter === "today") {
      matchesDate = isAfter(logDate, subDays(new Date(), 1))
    } else if (dateFilter === "week") {
      matchesDate = isAfter(logDate, subDays(new Date(), 7))
    } else if (dateFilter === "month") {
      matchesDate = isAfter(logDate, subDays(new Date(), 30))
    } else if (dateFilter === "custom") {
      if (startDate && endDate) {
        matchesDate = isAfter(logDate, startDate) && isBefore(logDate, endDate)
      } else if (startDate) {
        matchesDate = isAfter(logDate, startDate)
      } else if (endDate) {
        matchesDate = isBefore(logDate, endDate)
      }
    }

    return matchesSearch && matchesAction && matchesUser && matchesDate
  })

  // Get unique actions for filter
  const uniqueActions = [...new Set(logs.map((log) => log.action))]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4 mr-1" />
                Filters
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="action-filter">Action Type</Label>
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger id="action-filter">
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {uniqueActions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-filter">User</Label>
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger id="user-filter">
                      <SelectValue placeholder="Filter by user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-filter">Time Period</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger id="date-filter">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {dateFilter === "custom" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent mode="single" selected={startDate ?? undefined} onSelect={(date) => setStartDate(date ?? null)} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent mode="single" selected={endDate ?? undefined} onSelect={(date) => setEndDate(date ?? null)} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}

                <Button variant="ghost" className="w-full mt-2" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No activity logs found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filters to find what you``re looking for.
          </p>
          {(searchQuery || actionFilter !== "all" || userFilter !== "all" || dateFilter !== "all") && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <ScrollArea className="h-[calc(100vh-350px)] min-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(parseISO(log.timestamp), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewDetails(log)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Activity Log Details</DialogTitle>
            <DialogDescription>Detailed information about this activity.</DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Timestamp</Label>
                  <div className="font-medium">{format(parseISO(selectedLog.timestamp), "PPpp")}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">User</Label>
                  <div className="font-medium">{selectedLog.userName}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Action</Label>
                  <div>{getActionBadge(selectedLog.action)}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">IP Address</Label>
                  <div className="font-medium">{selectedLog.ipAddress}</div>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Details</Label>
                <div className="p-3 bg-muted rounded-md mt-1">{selectedLog.details}</div>
              </div>

              {selectedLog.metadata && (
                <div>
                  <Label className="text-xs text-muted-foreground">Additional Data</Label>
                  <pre className="p-3 bg-muted rounded-md mt-1 text-xs overflow-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

