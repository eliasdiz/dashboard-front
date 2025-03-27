"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ArrowUpDown,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  RefreshCw,
  Edit,
  Sparkles,
  Globe,
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  Clock,
  Plus,
  MoreVertical,
  Phone,
  Tag,
  LayoutGrid,
  Table2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"

// Types
interface Citation {
  id: string
  businessName: string
  source: string
  sourceIcon: string
  url: string
  dateAdded: string
  lastUpdated: string
  status: "verified" | "needsUpdate" | "missing"
  details?: {
    address?: string
    phone?: string
    website?: string
    hours?: string
    categories?: string[]
  }
  issues?: string[]
}

interface CitationsComponentProps {
  businessName?: string
  citations?: Citation[]
  className?: string
  showInsights?: boolean
  showFilters?: boolean
  defaultView?: "grid" | "table"
}

// Mock data for citations
const mockCitations: Citation[] = [
  {
    id: "1",
    businessName: "Acme Marketing Agency",
    source: "Google Business Profile",
    sourceIcon: "/placeholder.svg?height=40&width=40&text=G",
    url: "https://business.google.com/acme-marketing",
    dateAdded: "2023-01-15",
    lastUpdated: "2023-11-20",
    status: "verified",
    details: {
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      website: "https://acmemarketing.com",
      hours: "Mon-Fri: 9am-5pm",
      categories: ["Marketing Agency", "Digital Marketing", "SEO Services"]
    }
  },
  {
    id: "2",
    businessName: "Acme Marketing Agency",
    source: "Yelp",
    sourceIcon: "/placeholder.svg?height=40&width=40&text=Y",
    url: "https://yelp.com/biz/acme-marketing",
    dateAdded: "2023-02-10",
    lastUpdated: "2023-10-05",
    status: "needsUpdate",
    details: {
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      website: "https://acmemarketing.com",
      hours: "Mon-Fri: 9am-5pm",
      categories: ["Marketing Agency", "Advertising Agency"]
    },
    issues: ["Phone number needs to be updated", "Business hours are incorrect"]
  },
  {
    id: "3",
    businessName: "Acme Marketing Agency",
    source: "Facebook",
    sourceIcon: "/placeholder.svg?height=40&width=40&text=F",
    url: "https://facebook.com/acme-marketing",
    dateAdded: "2023-03-05",
    lastUpdated: "2023-11-15",
    status: "verified",
    details: {
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      website: "https://acmemarketing.com",
      hours: "Mon-Fri: 9am-5pm",
      categories: ["Marketing Agency", "Digital Marketing"]
    }
  },
  {
    id: "4",
    businessName: "Acme Marketing Agency",
    source: "Apple Maps",
    sourceIcon: "/placeholder.svg?height=40&width=40&text=A",
    url: "https://maps.apple.com/?q=acme-marketing",
    dateAdded: "2023-04-20",
    lastUpdated: "2023-09-10",
    status: "needsUpdate",
    details: {
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      website: "https://acmemarketing.com",
      hours: "Mon-Fri: 9am-5pm",
      categories: ["Marketing Agency"]
    },
    issues: ["Address is outdated", "Missing business categories"]
  },
  {
    id: "5",
    businessName: "Acme Marketing Agency",
    source: "Bing Places",
    sourceIcon: "/placeholder.svg?height=40&width=40&text=B",
    url: "https://bingplaces.com/acme-marketing",
    dateAdded: "2023-05-15",
    lastUpdated: "2023-11-01",
    status: "verified",
    details: {
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      website: "https://acmemarketing.com",
      hours: "Mon-Fri: 9am-5pm",
      categories: ["Marketing Agency", "Digital Marketing", "SEO Services"]
    }
  },
  {
    id: "6",
    businessName: "Acme Marketing Agency",
    source: "Yellow Pages",
    sourceIcon: "/placeholder.svg?height=40&width=40&text=YP",
    url: "https://yellowpages.com/acme-marketing",
    dateAdded: "2023-06-10",
    lastUpdated: "2023-08-15",
    status: "needsUpdate",
    details: {
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      website: "https://acmemarketing.com",
      categories: ["Marketing Agency"]
    },
    issues: ["Missing business hours", "Incomplete business description"]
  },
  {
    id: "7",
    businessName: "Acme Marketing Agency",
    source: "TripAdvisor",
    sourceIcon: "/placeholder.svg?height=40&width=40&text=TA",
    url: "https://tripadvisor.com/acme-marketing",
    dateAdded: "2023-07-05",
    lastUpdated: "",
    status: "missing",
    issues: ["Citation not created yet"]
  },
  {
    id: "8",
    businessName: "Acme Marketing Agency",
    source: "Better Business Bureau",
    sourceIcon: "/placeholder.svg?height=40&width=40&text=BBB",
    url: "https://bbb.org/acme-marketing",
    dateAdded: "2023-08-20",
    lastUpdated: "2023-11-10",
    status: "verified",
    details: {
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      website: "https://acmemarketing.com",
      categories: ["Marketing Agency", "Digital Marketing"]
    }
  },
  {
    id: "9",
    businessName: "Acme Marketing Agency",
    source: "Foursquare",
    sourceIcon: "/placeholder.svg?height=40&width=40&text=FS",
    url: "https://foursquare.com/acme-marketing",
    dateAdded: "2023-09-15",
    lastUpdated: "",
    status: "missing",
    issues: ["Citation not created yet"]
  },
  {
    id: "10",
    businessName: "Acme Marketing Agency",
    source: "Manta",
    sourceIcon: "/placeholder.svg?height=40&width=40&text=M",
    url: "https://manta.com/acme-marketing",
    dateAdded: "2023-10-10",
    lastUpdated: "2023-10-10",
    status: "verified",
    details: {
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      website: "https://acmemarketing.com",
      categories: ["Marketing Agency", "Digital Marketing"]
    }
  }
]

// Generate AI insights based on citation data
const generateAIInsights = (citations: Citation[]) => {
  const totalCitations = citations.length
  const verifiedCount = citations.filter((c) => c.status === "verified").length
  const needsUpdateCount = citations.filter((c) => c.status === "needsUpdate").length
  const missingCount = citations.filter((c) => c.status === "missing").length

  const verifiedPercentage = Math.round((verifiedCount / totalCitations) * 100)

  // Get most recent update date
  const lastUpdatedDates = citations.filter((c) => c.lastUpdated).map((c) => new Date(c.lastUpdated).getTime())

  const mostRecentUpdate = lastUpdatedDates.length > 0 ? new Date(Math.max(...lastUpdatedDates)) : null

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Generate insights
  let primaryInsight = ""
  const secondaryInsights = []

  if (verifiedPercentage >= 80) {
    primaryInsight = `Your business has strong citation coverage with ${verifiedPercentage}% of listings verified and accurate.`
  } else if (verifiedPercentage >= 50) {
    primaryInsight = `Your business has moderate citation coverage with ${verifiedPercentage}% of listings verified, but ${needsUpdateCount} need attention.`
  } else {
    primaryInsight = `Your citation coverage needs improvement with only ${verifiedPercentage}% of listings verified and ${needsUpdateCount + missingCount} requiring attention.`
  }

  // Add secondary insights
  if (needsUpdateCount > 0) {
    secondaryInsights.push(
      `${needsUpdateCount} citation${needsUpdateCount > 1 ? "s" : ""} need${needsUpdateCount === 1 ? "s" : ""} updates to maintain accurate business information.`,
    )
  }

  if (missingCount > 0) {
    secondaryInsights.push(
      `${missingCount} important citation${missingCount > 1 ? "s are" : " is"} missing and should be created to improve local visibility.`,
    )
  }

  if (mostRecentUpdate) {
    secondaryInsights.push(`Your most recent citation update was on ${formatDate(mostRecentUpdate)}.`)
  }

  return {
    primaryInsight,
    secondaryInsights,
    stats: {
      total: totalCitations,
      verified: verifiedCount,
      needsUpdate: needsUpdateCount,
      missing: missingCount,
      verifiedPercentage,
    },
  }
}

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A"

  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

// Calculate days since update
const daysSinceUpdate = (dateString: string) => {
  if (!dateString) return null

  const updateDate = new Date(dateString)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - updateDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

export function CitationsComponent({
  citations = mockCitations,
  className = "",
  showInsights = true,
  showFilters = true,
  defaultView = "grid",
}: CitationsComponentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("lastUpdated")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filteredCitations, setFilteredCitations] = useState<Citation[]>(citations)
  const [viewMode, setViewMode] = useState<"grid" | "table">(defaultView)
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null)

  // AI insights
  const insights = generateAIInsights(citations)

  // Apply filters and sorting
  useEffect(() => {
    let result = [...citations]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (citation) =>
          citation.businessName.toLowerCase().includes(term) || citation.source.toLowerCase().includes(term),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((citation) => citation.status === statusFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB

      switch (sortBy) {
        case "source":
          valueA = a.source.toLowerCase()
          valueB = b.source.toLowerCase()
          break
        case "dateAdded":
          valueA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0
          valueB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0
          break
        case "lastUpdated":
          valueA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0
          valueB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0
          break
        case "status":
          // Order: verified, needsUpdate, missing
          const statusOrder = { verified: 0, needsUpdate: 1, missing: 2 }
          valueA = statusOrder[a.status]
          valueB = statusOrder[b.status]
          break
        default:
          valueA = a.source.toLowerCase()
          valueB = b.source.toLowerCase()
      }

      // Handle string comparison
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
      }

      // Handle number comparison
      return sortOrder === "asc" ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA)
    })

    setFilteredCitations(result)
  }, [citations, searchTerm, statusFilter, sortBy, sortOrder])

  // Toggle citation expansion
  const toggleCitationExpansion = (id: string) => {
    setExpandedCitationId(expandedCitationId === id ? null : id)
  }

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "needsUpdate":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            Needs Update
          </Badge>
        )
      case "missing":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Missing
          </Badge>
        )
      default:
        return null
    }
  }

  // Render grid view
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCitations.length > 0 ? (
          filteredCitations.map((citation) => (
            <Collapsible
              key={citation.id}
              open={expandedCitationId === citation.id}
              onOpenChange={() => toggleCitationExpansion(citation.id)}
            >
              <Card
                className={cn(
                  "transition-all duration-200",
                  expandedCitationId === citation.id ? "shadow-md" : "hover:shadow-sm",
                  citation.status === "verified"
                    ? "border-green-200"
                    : citation.status === "needsUpdate"
                      ? "border-yellow-200"
                      : "border-red-200",
                )}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md overflow-hidden mr-3 border border-border flex items-center justify-center bg-muted">
                        <Image
                          src={citation.sourceIcon || "/placeholder.svg"}
                          alt={citation.source}
                          className="h-full w-full object-cover"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base">{citation.source}</CardTitle>
                        <div className="flex items-center mt-1">{renderStatusBadge(citation.status)}</div>
                      </div>
                    </div>

                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {expandedCitationId === citation.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Added:</span>
                      <span className="font-medium">{formatDate(citation.dateAdded)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">
                        {citation.lastUpdated ? formatDate(citation.lastUpdated) : "N/A"}
                      </span>
                    </div>

                    {citation.lastUpdated && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Age:</span>
                        <span
                          className={cn(
                            "font-medium",
                            daysSinceUpdate(citation.lastUpdated)! > 180
                              ? "text-red-500"
                              : daysSinceUpdate(citation.lastUpdated)! > 90
                                ? "text-yellow-500"
                                : "text-green-500",
                          )}
                        >
                          {daysSinceUpdate(citation.lastUpdated)} days
                        </span>
                      </div>
                    )}
                  </div>

                  <CollapsibleContent className="pt-4 space-y-4">
                    <Separator />

                    {citation.status !== "missing" && citation.details && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Citation Details</h4>

                        <div className="space-y-2 text-sm">
                          {citation.details.address && (
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                              <span>{citation.details.address}</span>
                            </div>
                          )}

                          {citation.details.phone && (
                            <div className="flex items-start">
                              <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                              <span>{citation.details.phone}</span>
                            </div>
                          )}

                          {citation.details.website && (
                            <div className="flex items-start">
                              <Globe className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                              <span className="text-primary">{citation.details.website}</span>
                            </div>
                          )}

                          {citation.details.hours && (
                            <div className="flex items-start">
                              <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                              <span>{citation.details.hours}</span>
                            </div>
                          )}

                          {citation.details.categories && citation.details.categories.length > 0 && (
                            <div className="flex items-start">
                              <Tag className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                              <div className="flex flex-wrap gap-1">
                                {citation.details.categories.map((category, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {citation.issues && citation.issues.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Issues to Resolve
                        </h4>

                        <ul className="space-y-1 text-sm">
                          {citation.issues.map((issue, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-yellow-600 dark:text-yellow-400 mr-2">•</span>
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CollapsibleContent>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <a href={citation.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      View
                    </a>
                  </Button>

                  {citation.status !== "missing" ? (
                    <Button variant="outline" size="sm">
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Update
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Create
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </Collapsible>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground">No citations match your filters</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Render table view
  const renderTableView = () => {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date Added</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="hidden md:table-cell">Age</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCitations.length > 0 ? (
              filteredCitations.map((citation) => (
                <TableRow key={citation.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md overflow-hidden mr-2 border border-border flex items-center justify-center bg-muted">
                        <Image
                          src={citation.sourceIcon || "/placeholder.svg"}
                          alt={citation.source}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{citation.source}</span>
                    </div>
                  </TableCell>
                  <TableCell>{renderStatusBadge(citation.status)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(citation.dateAdded)}</TableCell>
                  <TableCell>{citation.lastUpdated ? formatDate(citation.lastUpdated) : "N/A"}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {citation.lastUpdated ? (
                      <span
                        className={cn(
                          "font-medium",
                          daysSinceUpdate(citation.lastUpdated)! > 180
                            ? "text-red-500"
                            : daysSinceUpdate(citation.lastUpdated)! > 90
                              ? "text-yellow-500"
                              : "text-green-500",
                        )}
                      >
                        {daysSinceUpdate(citation.lastUpdated)} days
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={citation.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          View
                        </a>
                      </Button>

                      {citation.status !== "missing" ? (
                        <Button variant="outline" size="sm">
                          <Edit className="h-3.5 w-3.5 mr-1.5" />
                          Update
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Plus className="h-3.5 w-3.5 mr-1.5" />
                          Create
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Check for Updates</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Verified</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Globe className="h-8 w-8 text-muted-foreground mb-4 opacity-20" />
                    <p className="text-muted-foreground">No citations match your filters</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchTerm("")
                        setStatusFilter("all")
                      }}
                      className="mt-2"
                    >
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Business Citations</h2>
            <p className="text-muted-foreground">Track and manage your business listings across the web</p>
          </div>

          {/* View Mode Selector */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-l-none"
            >
              <Table2 className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
        </div>

        {/* AI-generated Insights */}
        {showInsights && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 opacity-10">
              <Sparkles className="h-full w-full text-primary" />
            </div>
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium flex items-center">
                  AI-Generated Insight
                  <Badge variant="outline" className="ml-2 text-xs">
                    <RefreshCw className="h-2.5 w-2.5 mr-1" />
                    Updated today
                  </Badge>
                </h3>
                <p className="text-sm mt-1">{insights.primaryInsight}</p>

                {insights.secondaryInsights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {insights.secondaryInsights.map((insight, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start">
                        <Info className="h-3 w-3 mr-1 mt-0.5 text-primary" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Citation Stats */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold">{insights.stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Citations</div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{insights.stats.verified}</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {insights.stats.needsUpdate}
              </div>
              <div className="text-sm text-muted-foreground">Needs Update</div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{insights.stats.missing}</div>
              <div className="text-sm text-muted-foreground">Missing</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Citation Health</span>
              <span className="text-sm font-medium">{insights.stats.verifiedPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  insights.stats.verifiedPercentage >= 80
                    ? "bg-green-500"
                    : insights.stats.verifiedPercentage >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500",
                )}
                style={{ width: `${insights.stats.verifiedPercentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search citations..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="needsUpdate">Needs Update</SelectItem>
                  <SelectItem value="missing">Missing</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[140px] justify-between">
                    <div className="flex items-center">
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      Sort By
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className={cn(sortBy === "source" && "font-medium")}
                    onClick={() => {
                      setSortBy("source")
                      setSortOrder(sortBy === "source" && sortOrder === "asc" ? "desc" : "asc")
                    }}
                  >
                    Source {sortBy === "source" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(sortBy === "dateAdded" && "font-medium")}
                    onClick={() => {
                      setSortBy("dateAdded")
                      setSortOrder(sortBy === "dateAdded" && sortOrder === "asc" ? "desc" : "asc")
                    }}
                  >
                    Date Added {sortBy === "dateAdded" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(sortBy === "lastUpdated" && "font-medium")}
                    onClick={() => {
                      setSortBy("lastUpdated")
                      setSortOrder(sortBy === "lastUpdated" && sortOrder === "asc" ? "desc" : "asc")
                    }}
                  >
                    Last Updated {sortBy === "lastUpdated" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(sortBy === "status" && "font-medium")}
                    onClick={() => {
                      setSortBy("status")
                      setSortOrder(sortBy === "status" && sortOrder === "asc" ? "desc" : "asc")
                    }}
                  >
                    Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Active Filters Summary */}
          {(searchTerm || statusFilter !== "all") && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span>
                Showing {filteredCitations.length} of {citations.length} citations
              </span>
              <Button
                variant="link"
                size="sm"
                className="h-6 ml-2 text-xs"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}

          <Separator />
        </div>
      )}

      {/* Citations Display */}
      <div className="mb-6">
        {viewMode === "grid" && renderGridView()}
        {viewMode === "table" && renderTableView()}
      </div>
    </div>
  )
}

