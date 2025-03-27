"use client"

import { useState, useEffect, useMemo } from "react"
import { format, parse, startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns"
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  FileText,
  Filter,
  Search,
  SlidersHorizontal,
  X,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileDown,
  FileIcon as FilePdf,
  BarChart3,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Printer,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Types
export interface ReportData {
  id: string
  name: string
  date: string
  category: string
  status: "completed" | "pending" | "failed"
  amount: number
  tags: string[]
  details?: {
    description?: string
    assignee?: string
    priority?: "low" | "medium" | "high"
    createdBy?: string
    lastModified?: string
  }
}

interface ReportTableProps {
  title?: string
  description?: string
  apiEndpoint?: string
  initialData?: ReportData[]
  className?: string
  onRowClick?: (report: ReportData) => void
  showFilters?: boolean
  showExport?: boolean
  defaultPageSize?: number
}

// Mock data generator
const generateMockData = (): ReportData[] => {
  const categories = ["Marketing", "Sales", "Finance", "Operations", "Customer Support"]
  const statuses: ("completed" | "pending" | "failed")[] = ["completed", "pending", "failed"]
  const tags = [
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "Monthly",
    "Weekly",
    "Daily",
    "KPI",
    "Analytics",
    "Budget",
    "Campaign",
    "Social Media",
    "Email",
    "Website",
    "Conversion",
    "Lead Generation",
  ]

  const mockData: ReportData[] = []

  // Generate 100 mock reports
  for (let i = 1; i <= 100; i++) {
    // Generate a random date within the last 12 months
    const randomMonthOffset = Math.floor(Math.random() * 12)
    const date = subMonths(new Date(), randomMonthOffset)

    // Randomly select category, status, and tags
    const category = categories[Math.floor(Math.random() * categories.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    // Generate 1-3 random tags
    const numTags = Math.floor(Math.random() * 3) + 1
    const reportTags: string[] = []
    for (let j = 0; j < numTags; j++) {
      const tag = tags[Math.floor(Math.random() * tags.length)]
      if (!reportTags.includes(tag)) {
        reportTags.push(tag)
      }
    }

    // Generate random amount between 100 and 10000
    const amount = Math.floor(Math.random() * 9900) + 100

    mockData.push({
      id: `REP-${String(i).padStart(5, "0")}`,
      name: `${category} Report ${i}`,
      date: format(date, "yyyy-MM-dd"),
      category,
      status,
      amount,
      tags: reportTags,
      details: {
        description: `This is a ${category.toLowerCase()} report for ${format(date, "MMMM yyyy")}.`,
        assignee: ["John Doe", "Jane Smith", "Alex Johnson", "Sam Wilson"][Math.floor(Math.random() * 4)],
        priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
        createdBy: ["Admin", "System", "Manager", "Analyst"][Math.floor(Math.random() * 4)],
        lastModified: format(subMonths(new Date(), Math.floor(Math.random() * 3)), "yyyy-MM-dd HH:mm:ss"),
      },
    })
  }

  return mockData
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

// Helper function to export data as CSV
const exportAsCSV = (data: ReportData[], filename: string) => {
  // Define CSV headers
  const headers = ["ID", "Name", "Date", "Category", "Status", "Amount", "Tags"]

  // Convert data to CSV format
  const csvRows = [
    headers.join(","), // Add headers as first row
    ...data.map((row) =>
      [
        row.id,
        `"${row.name}"`, // Wrap in quotes to handle commas in names
        row.date,
        row.category,
        row.status,
        row.amount,
        `"${row.tags.join(", ")}"`, // Wrap in quotes to handle commas in tags
      ].join(","),
    ),
  ]

  // Create CSV content
  const csvContent = csvRows.join("\n")

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Create a download link
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.href = url
  link.setAttribute("download", `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Helper function to generate PDF (simplified for demo)
const exportAsPDF = (data: ReportData[], filename: string) => {
  // In a real implementation, you would use a library like jsPDF or pdfmake
  // For this demo, we'll just show an alert
  alert(`Exporting ${data.length} reports as PDF: ${filename}.pdf`)

  // In a real implementation, you would do something like:
  // const doc = new jsPDF()
  // doc.text("Reports", 10, 10)
  // ... add table data ...
  // doc.save(`${filename}.pdf`)
}

export function ReportTable({
  title = "Reports",
  description = "View and manage your reports",
  apiEndpoint,
  initialData,
  className,
  onRowClick,
  showFilters = true,
  showExport = true,
  defaultPageSize = 10,
}: ReportTableProps) {
  // State for report data
  const [data, setData] = useState<ReportData[]>(initialData || [])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // State for filters
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [tagFilter, setTagFilter] = useState<string>("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // State for sorting
  const [sortField, setSortField] = useState<keyof ReportData>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(defaultPageSize)

  // State for selected rows
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // State for detailed view
  const [detailedReport, setDetailedReport] = useState<ReportData | null>(null)

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        if (apiEndpoint) {
          // Fetch data from API
          const response = await fetch(apiEndpoint)
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`)
          }
          const result = await response.json()
          setData(result)
        } else if (!initialData) {
          // Generate mock data if no API endpoint or initial data provided
          const mockData = generateMockData()
          setData(mockData)
        }
      } catch (err) {
        console.error("Error fetching report data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [apiEndpoint, initialData])

  // Get unique categories and tags from data
  const { categories, tags } = useMemo(() => {
    const uniqueCategories = Array.from(new Set(data.map((item) => item.category)))

    // Collect all tags and count occurrences
    const tagCounts: Record<string, number> = {}
    data.forEach((item) => {
      item.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    // Sort tags by occurrence count (descending)
    const uniqueTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])

    return {
      categories: uniqueCategories,
      tags: uniqueTags,
    }
  }, [data])

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter by search term
      const matchesSearch =
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by month
      const itemDate = parse(item.date, "yyyy-MM-dd", new Date())
      const startDate = startOfMonth(selectedMonth)
      const endDate = endOfMonth(selectedMonth)
      const matchesMonth = itemDate >= startDate && itemDate <= endDate

      // Filter by category
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

      // Filter by status
      const matchesStatus = statusFilter === "all" || item.status === statusFilter

      // Filter by tags
      const matchesTags =
        tagFilter === "all" ||
        (tagFilter === "selected" && selectedTags.length === 0) ||
        (tagFilter === "selected" && selectedTags.some((tag) => item.tags.includes(tag)))

      return matchesSearch && matchesMonth && matchesCategory && matchesStatus && matchesTags
    })
  }, [data, searchTerm, selectedMonth, categoryFilter, statusFilter, tagFilter, selectedTags])

  // Sort filtered data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let valueA = a[sortField]
      let valueB = b[sortField]

      // Handle special case for date sorting
      if (sortField === "date") {
        valueA = new Date(valueA as string).getTime()
        valueB = new Date(valueB as string).getTime()
      }

      // Handle string comparison
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
      }

      // Handle number comparison
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA
      }

      return 0
    })
  }, [filteredData, sortField, sortDirection])

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Handle sort click
  const handleSort = (field: keyof ReportData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle row selection
  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Handle select all rows
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedData.map((row) => row.id))
    }
  }

  // Handle row click
  const handleRowClick = (report: ReportData) => {
    if (onRowClick) {
      onRowClick(report)
    } else {
      setDetailedReport(report)
    }
  }

  // Handle export
  const handleExport = (type: "csv" | "pdf") => {
    const dataToExport =
      selectedRows.length > 0 ? sortedData.filter((row) => selectedRows.includes(row.id)) : sortedData

    const filename = `reports-${format(selectedMonth, "yyyy-MM")}`

    if (type === "csv") {
      exportAsCSV(dataToExport, filename)
    } else {
      exportAsPDF(dataToExport, filename)
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedMonth(new Date())
    setCategoryFilter("all")
    setStatusFilter("all")
    setTagFilter("all")
    setSelectedTags([])
  }

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Render priority badge
  const renderPriorityBadge = (priority?: "low" | "medium" | "high") => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Low
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Medium
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            High
          </Badge>
        )
      default:
        return null
    }
  }

  // Render loading state
  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-[250px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render error state
  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Reports</CardTitle>
          <CardDescription>We encountered a problem loading the report data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 p-4 rounded-md text-destructive">
            <p>{error}</p>
          </div>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>

          {/* Month Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {format(selectedMonth, "MMMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="space-y-2 p-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedMonth(new Date())}>
                  Current Month
                </Button>
                <Separator className="my-2" />
                <CalendarComponent
                  mode="single"
                  selected={selectedMonth}
                  onSelect={(date) => date && setSelectedMonth(date)}
                  initialFocus
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          {showFilters && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[220px]">
                <DropdownMenuLabel>Filter Reports</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="p-2">
                  <Label htmlFor="category-filter" className="text-xs">
                    Category
                  </Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger id="category-filter" className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-2">
                  <Label htmlFor="status-filter" className="text-xs">
                    Status
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status-filter" className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-2">
                  <Label htmlFor="tag-filter" className="text-xs">
                    Tags
                  </Label>
                  <Select value={tagFilter} onValueChange={setTagFilter}>
                    <SelectTrigger id="tag-filter" className="mt-1">
                      <SelectValue placeholder="Filter by tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      <SelectItem value="selected">Selected Tags</SelectItem>
                    </SelectContent>
                  </Select>

                  {tagFilter === "selected" && (
                    <div className="mt-2 space-y-2">
                      <Label className="text-xs">Select Tags</Label>
                      <div className="max-h-[150px] overflow-y-auto space-y-2 mt-1">
                        {tags.map((tag) => (
                          <div key={tag} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tag-${tag}`}
                              checked={selectedTags.includes(tag)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTags([...selectedTags, tag])
                                } else {
                                  setSelectedTags(selectedTags.filter((t) => t !== tag))
                                }
                              }}
                            />
                            <Label htmlFor={`tag-${tag}`} className="text-xs cursor-pointer">
                              {tag}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export Options */}
          {showExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[130px]">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FilePdf className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Reports
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Display Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[130px]">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Display
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Display Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Label htmlFor="page-size" className="text-xs">
                  Items per page
                </Label>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value))
                    setCurrentPage(1) // Reset to first page when changing page size
                  }}
                >
                  <SelectTrigger id="page-size" className="mt-1">
                    <SelectValue placeholder="Select page size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 items</SelectItem>
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="20">20 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                    <SelectItem value="100">100 items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active Filters Summary */}
        {(searchTerm || categoryFilter !== "all" || statusFilter !== "all" || tagFilter !== "all") && (
          <div className="flex flex-wrap gap-2 items-center text-sm">
            <span className="text-muted-foreground">Active filters:</span>

            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchTerm}
                <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => setSearchTerm("")}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove search filter</span>
                </Button>
              </Badge>
            )}

            {categoryFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {categoryFilter}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setCategoryFilter("all")}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove category filter</span>
                </Button>
              </Badge>
            )}

            {statusFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {statusFilter}
                <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => setStatusFilter("all")}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove status filter</span>
                </Button>
              </Badge>
            )}

            {tagFilter !== "all" && selectedTags.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Tags: {selectedTags.join(", ")}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => {
                    setTagFilter("all")
                    setSelectedTags([])
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove tag filter</span>
                </Button>
              </Badge>
            )}

            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={resetFilters}>
              Clear all filters
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </TableHead>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center">
                    Name
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                  <div className="flex items-center">
                    Date
                    {sortField === "date" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                  <div className="flex items-center">
                    Category
                    {sortField === "category" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  <div className="flex items-center">
                    Status
                    {sortField === "status" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort("amount")}>
                  <div className="flex items-center justify-end">
                    Amount
                    {sortField === "amount" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((report) => (
                  <TableRow
                    key={report.id}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50",
                      selectedRows.includes(report.id) && "bg-muted/30",
                    )}
                    onClick={() => handleRowClick(report)}
                  >
                    <TableCell className="p-2" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRows.includes(report.id)}
                        onCheckedChange={() => handleRowSelect(report.id)}
                        aria-label={`Select row ${report.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{format(new Date(report.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{report.category}</TableCell>
                    <TableCell>{renderStatusBadge(report.status)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(report.amount)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {report.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleRowClick(report)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Download Report
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Analytics
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
              {filteredData.length} reports
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Calculate page numbers to show (centered around current page)
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={i}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8 mx-0.5"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Report Detail Dialog */}
      <Dialog open={!!detailedReport} onOpenChange={(open) => !open && setDetailedReport(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {detailedReport && (
            <>
              <DialogHeader>
                <DialogTitle>{detailedReport.name}</DialogTitle>
                <DialogDescription>
                  Report ID: {detailedReport.id} | Created on {format(new Date(detailedReport.date), "MMMM d, yyyy")}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <p className="font-medium">{detailedReport.category}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <div className="mt-1">{renderStatusBadge(detailedReport.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Amount</Label>
                    <p className="font-medium">{formatCurrency(detailedReport.amount)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Priority</Label>
                    <div className="mt-1">{renderPriorityBadge(detailedReport.details?.priority)}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {detailedReport.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="mt-1">{detailedReport.details?.description || "No description available."}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Assignee</Label>
                    <p className="font-medium">{detailedReport.details?.assignee || "Unassigned"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Created By</Label>
                    <p className="font-medium">{detailedReport.details?.createdBy || "System"}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Last Modified</Label>
                  <p className="font-medium">
                    {detailedReport.details?.lastModified
                      ? format(new Date(detailedReport.details.lastModified), "MMM d, yyyy 'at' h:mm a")
                      : "Unknown"}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailedReport(null)}>
                  Close
                </Button>
                <Button onClick={() => handleExport("pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

