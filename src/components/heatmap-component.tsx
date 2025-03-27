"use client"

import { useState, useEffect, useRef } from "react"
import {
  Calendar,
  Download,
  MousePointer,
  ArrowDownUp,
  Clock,
  Smartphone,
  Tablet,
  Monitor,
  Info,
  RefreshCw,
  Eye,
  EyeOff,
  Share2,
  Sparkles,
  FileText,
  ImageIcon,
} from "lucide-react"
import { format, subDays, isAfter, isBefore, parseISO } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
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
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types
interface HeatmapPoint {
  x: number
  y: number
  value: number
}

interface ScrollDepthData {
  depth: number
  percentage: number
}

interface EngagementZone {
  id: string
  selector: string
  timeSpent: number
  interactions: number
  name: string
}

interface HeatmapData {
  id: string
  date: string
  type: "click" | "scroll" | "engagement"
  device: "desktop" | "tablet" | "mobile"
  page: string
  points?: HeatmapPoint[]
  scrollData?: ScrollDepthData[]
  engagementZones?: EngagementZone[]
  totalVisitors: number
  totalInteractions: number
}

interface HeatmapComponentProps {
  className?: string
  initialData?: HeatmapData[]
  apiEndpoint?: string
  pageUrl?: string
  showControls?: boolean
  defaultType?: "click" | "scroll" | "engagement"
  defaultDevice?: "desktop" | "tablet" | "mobile"
  defaultDateRange?: { from: Date; to: Date }
}

// Mock data for demonstration
const generateMockData = (): HeatmapData[] => {
  const mockData: HeatmapData[] = []
  const devices: ("desktop" | "tablet" | "mobile")[] = ["desktop", "tablet", "mobile"]
  const types: ("click" | "scroll" | "engagement")[] = ["click", "scroll", "engagement"]

  // Generate data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd")

    // Generate data for each device type
    devices.forEach((device) => {
      // Generate data for each heatmap type
      types.forEach((type) => {
        const totalVisitors = Math.floor(Math.random() * 1000) + 100
        const totalInteractions = Math.floor(Math.random() * 5000) + 500

        const heatmapData: HeatmapData = {
          id: `${date}-${device}-${type}`,
          date,
          type,
          device,
          page: "/example-page",
          totalVisitors,
          totalInteractions,
        }

        // Add type-specific data
        if (type === "click") {
          const points: HeatmapPoint[] = []
          // Generate random click points
          for (let j = 0; j < 200; j++) {
            points.push({
              x: Math.random() * 100, // percentage across width
              y: Math.random() * 100, // percentage down height
              value: Math.random() * 100, // intensity value
            })
          }
          heatmapData.points = points
        } else if (type === "scroll") {
          const scrollData: ScrollDepthData[] = []
          // Generate scroll depth data
          let cumulativePercentage = 100
          for (let depth = 0; depth <= 100; depth += 10) {
            cumulativePercentage = cumulativePercentage * (0.85 + Math.random() * 0.15)
            scrollData.push({
              depth,
              percentage: cumulativePercentage,
            })
          }
          heatmapData.scrollData = scrollData
        } else if (type === "engagement") {
          const engagementZones: EngagementZone[] = [
            {
              id: "header",
              selector: "header",
              timeSpent: Math.floor(Math.random() * 30) + 5,
              interactions: Math.floor(Math.random() * 100) + 10,
              name: "Header",
            },
            {
              id: "hero",
              selector: ".hero-section",
              timeSpent: Math.floor(Math.random() * 60) + 20,
              interactions: Math.floor(Math.random() * 200) + 50,
              name: "Hero Section",
            },
            {
              id: "features",
              selector: ".features-section",
              timeSpent: Math.floor(Math.random() * 45) + 15,
              interactions: Math.floor(Math.random() * 150) + 30,
              name: "Features",
            },
            {
              id: "pricing",
              selector: ".pricing-section",
              timeSpent: Math.floor(Math.random() * 50) + 10,
              interactions: Math.floor(Math.random() * 120) + 20,
              name: "Pricing",
            },
            {
              id: "testimonials",
              selector: ".testimonials-section",
              timeSpent: Math.floor(Math.random() * 40) + 5,
              interactions: Math.floor(Math.random() * 80) + 10,
              name: "Testimonials",
            },
            {
              id: "cta",
              selector: ".cta-section",
              timeSpent: Math.floor(Math.random() * 25) + 5,
              interactions: Math.floor(Math.random() * 70) + 5,
              name: "Call to Action",
            },
            {
              id: "footer",
              selector: "footer",
              timeSpent: Math.floor(Math.random() * 15) + 2,
              interactions: Math.floor(Math.random() * 50) + 5,
              name: "Footer",
            },
          ]
          heatmapData.engagementZones = engagementZones
        }

        mockData.push(heatmapData)
      })
    })
  }

  return mockData
}

// Helper function to get color based on intensity value
const getIntensityColor = (value: number): string => {
  // Value should be between 0 and 100
  if (value < 33) {
    return `rgba(0, 0, 255, ${value / 100})` // Blue for low intensity
  } else if (value < 66) {
    return `rgba(255, 255, 0, ${value / 100})` // Yellow for medium intensity
  } else {
    return `rgba(255, 0, 0, ${value / 100})` // Red for high intensity
  }
}

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  } else {
    return num.toString()
  }
}

export function HeatmapComponent({
  className,
  initialData,
  apiEndpoint,
  pageUrl = "/example-page",
  showControls = true,
  defaultType = "click",
  defaultDevice = "desktop",
  defaultDateRange,
}: HeatmapComponentProps) {
  // State for heatmap data and filters
  const [data, setData] = useState<HeatmapData[]>(initialData || [])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [heatmapType, setHeatmapType] = useState<"click" | "scroll" | "engagement">(defaultType)
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">(defaultDevice)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(
    defaultDateRange || {
      from: subDays(new Date(), 7),
      to: new Date(),
    },
  )
  const [intensityThreshold, setIntensityThreshold] = useState<number>(0)
  const [showOverlay, setShowOverlay] = useState<boolean>(true)

  // Refs for the heatmap container and canvas
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // If apiEndpoint is provided, fetch data from API
        if (apiEndpoint) {
          const response = await fetch(apiEndpoint)
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`)
          }
          const fetchedData = await response.json()
          setData(fetchedData)
        } else {
          // Otherwise use mock data
          const mockData = generateMockData()
          setData(mockData)
        }
      } catch (err) {
        console.error("Error fetching heatmap data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [apiEndpoint])

  // Filter data based on selected filters
  const filteredData = data.filter((item) => {
    const dateMatches = isAfter(parseISO(item.date), dateRange.from) && isBefore(parseISO(item.date), dateRange.to)
    const typeMatches = item.type === heatmapType
    const deviceMatches = item.device === deviceType
    const pageMatches = item.page === pageUrl

    return dateMatches && typeMatches && deviceMatches && pageMatches
  })

  // Aggregate data for the selected filters
  const aggregatedData = filteredData.reduce(
    (acc, item) => {
      if (item.type === "click" && item.points) {
        // Aggregate click points
        if (!acc.points) {
          acc.points = [...item.points]
        } else {
          item.points.forEach((point) => {
            const existingPoint = acc.points!.find((p) => Math.abs(p.x - point.x) < 1 && Math.abs(p.y - point.y) < 1)

            if (existingPoint) {
              existingPoint.value += point.value
            } else {
              acc.points!.push(point)
            }
          })
        }
      } else if (item.type === "scroll" && item.scrollData) {
        // Aggregate scroll data
        if (!acc.scrollData) {
          acc.scrollData = [...item.scrollData]
        } else {
          item.scrollData.forEach((scrollItem, index) => {
            if (acc.scrollData![index]) {
              acc.scrollData![index].percentage = (acc.scrollData![index].percentage + scrollItem.percentage) / 2
            }
          })
        }
      } else if (item.type === "engagement" && item.engagementZones) {
        // Aggregate engagement zones
        if (!acc.engagementZones) {
          acc.engagementZones = [...item.engagementZones]
        } else {
          item.engagementZones.forEach((zone) => {
            const existingZone = acc.engagementZones!.find((z) => z.id === zone.id)

            if (existingZone) {
              existingZone.timeSpent = (existingZone.timeSpent + zone.timeSpent) / 2
              existingZone.interactions = (existingZone.interactions + zone.interactions) / 2
            } else {
              acc.engagementZones!.push(zone)
            }
          })
        }
      }

      // Aggregate totals
      acc.totalVisitors += item.totalVisitors
      acc.totalInteractions += item.totalInteractions

      return acc
    },
    {
      totalVisitors: 0,
      totalInteractions: 0,
      points: [] as HeatmapPoint[],
      scrollData: [] as ScrollDepthData[],
      engagementZones: [] as EngagementZone[],
    },
  )

  // Normalize data for visualization
  const normalizeData = () => {
    if (heatmapType === "click" && aggregatedData.points) {
      // Find the maximum value for normalization
      const maxValue = Math.max(...aggregatedData.points.map((p) => p.value))

      // Normalize values to be between 0 and 100
      return aggregatedData.points
        .map((point) => ({
          ...point,
          value: (point.value / maxValue) * 100,
        }))
        .filter((point) => point.value >= intensityThreshold)
    }

    return []
  }


  // Render heatmap on canvas
  
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !showOverlay) return

    const canvas = canvasRef.current
    const container = containerRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Set canvas dimensions to match container
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (heatmapType === "click") {
      // Render click heatmap
      const normalizedPoints = normalizeData()

      normalizedPoints.forEach((point) => {
        const x = (point.x / 100) * canvas.width
        const y = (point.y / 100) * canvas.height
        const radius = Math.max(20, point.value / 10 + 10)

        // Create radial gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, getIntensityColor(point.value))
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        // Draw circle
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 2 * Math.PI)
        ctx.fillStyle = gradient
        ctx.fill()
      })
    } else if (heatmapType === "scroll" && aggregatedData.scrollData) {
      // Render scroll depth heatmap
      const scrollData = aggregatedData.scrollData

      // Draw scroll depth bars
      const barWidth = canvas.width
      const segmentHeight = canvas.height / (scrollData.length - 1)

      scrollData.forEach((item, index) => {
        if (index === 0) return // Skip the first item (0% depth)

        const y = index * segmentHeight
        const height = segmentHeight
        const value = item.percentage

        // Create gradient
        const gradient = ctx.createLinearGradient(0, y, barWidth, y)
        gradient.addColorStop(0, getIntensityColor(value))
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)")

        // Draw rectangle
        ctx.fillStyle = gradient
        ctx.fillRect(0, y - height, barWidth * (value / 100), height)

        // Add percentage text
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.font = "12px Arial"
        ctx.fillText(`${Math.round(value)}%`, 10, y - 5)
      })
    }
  }, [heatmapType, aggregatedData, intensityThreshold, showOverlay]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth
        canvasRef.current.height = containerRef.current.clientHeight
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Export heatmap as image
  const exportAsImage = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const image = canvas.toDataURL("image/png")

    // Create a download link
    const link = document.createElement("a")
    link.href = image
    link.download = `heatmap-${heatmapType}-${deviceType}-${format(new Date(), "yyyy-MM-dd")}.png`
    link.click()
  }

  // Export data as CSV
  const exportAsCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,"

    if (heatmapType === "click" && aggregatedData.points) {
      // Headers
      csvContent += "x,y,value\n"

      // Data rows
      aggregatedData.points.forEach((point) => {
        csvContent += `${point.x},${point.y},${point.value}\n`
      })
    } else if (heatmapType === "scroll" && aggregatedData.scrollData) {
      // Headers
      csvContent += "depth,percentage\n"

      // Data rows
      aggregatedData.scrollData.forEach((item) => {
        csvContent += `${item.depth},${item.percentage}\n`
      })
    } else if (heatmapType === "engagement" && aggregatedData.engagementZones) {
      // Headers
      csvContent += "id,name,timeSpent,interactions\n"

      // Data rows
      aggregatedData.engagementZones.forEach((zone) => {
        csvContent += `${zone.id},${zone.name},${zone.timeSpent},${zone.interactions}\n`
      })
    }

    // Create a download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.href = encodedUri
    link.download = `heatmap-data-${heatmapType}-${deviceType}-${format(new Date(), "yyyy-MM-dd")}.csv`
    link.click()
  }

  // Render loading state
  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Heatmap Analysis</CardTitle>
          <CardDescription>Loading heatmap data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  // Render error state
  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Heatmap</CardTitle>
          <CardDescription>We encountered a problem loading the heatmap data.</CardDescription>
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
            <CardTitle>Heatmap Analysis</CardTitle>
            <CardDescription>Visualizing user interactions on {pageUrl}</CardDescription>
          </div>

          {/* Date Range Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="space-y-2 p-2">
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date()
                        setDateRange({
                          from: subDays(today, 7),
                          to: today,
                        })
                      }}
                    >
                      Last 7 days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date()
                        setDateRange({
                          from: subDays(today, 30),
                          to: today,
                        })
                      }}
                    >
                      Last 30 days
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date()
                        setDateRange({
                          from: subDays(today, 60),
                          to: today,
                        })
                      }}
                    >
                      Last 60 days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date()
                        setDateRange({
                          from: subDays(today, 90),
                          to: today,
                        })
                      }}
                    >
                      Last 90 days
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="p-2">
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({
                          from: range.from,
                          to: range.to,
                        })
                      }
                    }}
                    numberOfMonths={2}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls */}
        {showControls && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Heatmap Type Selector */}
              <Tabs
                value={heatmapType}
                onValueChange={(value) => setHeatmapType(value as "click" | "scroll" | "engagement")}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="click" className="flex items-center">
                    <MousePointer className="h-4 w-4 mr-2" />
                    Clicks
                  </TabsTrigger>
                  <TabsTrigger value="scroll" className="flex items-center">
                    <ArrowDownUp className="h-4 w-4 mr-2" />
                    Scroll
                  </TabsTrigger>
                  <TabsTrigger value="engagement" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Engagement
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Device Type Selector */}
              <Tabs
                value={deviceType}
                onValueChange={(value) => setDeviceType(value as "desktop" | "tablet" | "mobile")}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="desktop" className="flex items-center">
                    <Monitor className="h-4 w-4 mr-2" />
                    Desktop
                  </TabsTrigger>
                  <TabsTrigger value="tablet" className="flex items-center">
                    <Tablet className="h-4 w-4 mr-2" />
                    Tablet
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Intensity Threshold Slider */}
                {heatmapType === "click" && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Label htmlFor="intensity-threshold" className="min-w-[80px]">
                      Intensity:
                    </Label>
                    <Slider
                      id="intensity-threshold"
                      min={0}
                      max={100}
                      step={1}
                      value={[intensityThreshold]}
                      onValueChange={(value) => setIntensityThreshold(value[0])}
                      className="w-[200px]"
                    />
                    <span className="text-sm text-muted-foreground min-w-[40px] text-right">{intensityThreshold}%</span>
                  </div>
                )}

                {/* Toggle Overlay */}
                <div className="flex items-center space-x-2">
                  <Switch id="show-overlay" checked={showOverlay} onCheckedChange={setShowOverlay} />
                  <Label htmlFor="show-overlay">
                    {showOverlay ? (
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        Show Overlay
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <EyeOff className="h-4 w-4 mr-1" />
                        Hide Overlay
                      </span>
                    )}
                  </Label>
                </div>
              </div>

              {/* Export Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exportAsImage}>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Export as Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsCSV}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Separator />
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">Total Visitors</p>
              <h3 className="text-2xl font-bold">{formatNumber(aggregatedData.totalVisitors)}</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">Total Interactions</p>
              <h3 className="text-2xl font-bold">{formatNumber(aggregatedData.totalInteractions)}</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">Interaction Rate</p>
              <h3 className="text-2xl font-bold">
                {aggregatedData.totalVisitors > 0
                  ? `${((aggregatedData.totalInteractions / aggregatedData.totalVisitors) * 100).toFixed(1)}%`
                  : "0%"}
              </h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">Date Range</p>
              <h3 className="text-sm font-medium">
                {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium flex items-center">
                  AI-Generated Insights
                  <Badge variant="outline" className="ml-2 text-xs">
                    <RefreshCw className="h-2.5 w-2.5 mr-1" />
                    Updated today
                  </Badge>
                </h3>

                {heatmapType === "click" && (
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      Users are most frequently clicking in the{" "}
                      {aggregatedData.points && aggregatedData.points.length > 0
                        ? Math.max(...aggregatedData.points.map((p) => p.value)) > 70
                          ? "top-right corner of the page, suggesting strong interest in your call-to-action buttons."
                          : "center of the page, indicating engagement with your main content."
                        : "page, but with limited data to analyze patterns."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Consider A/B testing different button placements to optimize conversion rates.
                    </p>
                  </div>
                )}

                {heatmapType === "scroll" && aggregatedData.scrollData && (
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      {aggregatedData.scrollData.find((item) => item.depth === 50)?.percentage ?? 0 > 70
                        ? "Strong scroll engagement with over 70% of users reaching the middle of your page."
                        : "Limited scroll depth with less than 70% of users reaching the middle of your page."}
                      {aggregatedData.scrollData.find((item) => item.depth === 90)?.percentage ?? 0 > 30
                        ? " Impressive bottom-of-page visibility with over 30% reaching the end."
                        : " Consider optimizing content as few users are reaching the bottom of the page."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {aggregatedData.scrollData.find((item) => item.depth === 50)?.percentage ?? 0 < 60
                        ? "Try adding engaging elements above the fold to encourage deeper scrolling."
                        : "Your content structure is working well to maintain user interest."}
                    </p>
                  </div>
                )}

                {heatmapType === "engagement" && aggregatedData.engagementZones && (
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      {aggregatedData.engagementZones.length > 0 &&
                        `Users spend the most time (${Math.max(...aggregatedData.engagementZones.map((z) => z.timeSpent))} seconds on average) in the ${
                          aggregatedData.engagementZones.reduce((prev, current) =>
                            prev.timeSpent > current.timeSpent ? prev : current,
                          ).name
                        } section.`}
                      {aggregatedData.engagementZones.find((z) => z.id === "cta")?.interactions ?? 0 > 50
                        ? " Your call-to-action area is receiving good engagement."
                        : " Your call-to-action area could use optimization to increase engagement."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Focus on improving sections with low engagement to create a more balanced user experience.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heatmap Visualization */}
        <div
          ref={containerRef}
          className={cn(
            "relative w-full rounded-lg overflow-hidden border",
            deviceType === "desktop"
              ? "h-[600px] aspect-video"
              : deviceType === "tablet"
                ? "h-[600px] aspect-[3/4]"
                : "h-[600px] aspect-[9/16]",
          )}
        >
          {/* Page mockup background */}
          <div className="absolute inset-0 bg-white">
            {/* Header mockup */}
            <div className="h-16 border-b bg-gray-50 flex items-center px-4">
              <div className="w-32 h-8 bg-gray-200 rounded-md"></div>
              <div className="ml-auto flex space-x-4">
                <div className="w-16 h-6 bg-gray-200 rounded-md"></div>
                <div className="w-16 h-6 bg-gray-200 rounded-md"></div>
                <div className="w-16 h-6 bg-gray-200 rounded-md"></div>
              </div>
            </div>

            {/* Hero section mockup */}
            <div className="h-80 bg-gray-100 flex flex-col items-center justify-center p-4">
              <div className="w-3/4 h-12 bg-gray-200 rounded-md mb-4"></div>
              <div className="w-2/3 h-8 bg-gray-200 rounded-md mb-6"></div>
              <div className="w-40 h-10 bg-primary/20 rounded-md"></div>
            </div>

            {/* Features section mockup */}
            <div className="py-8 px-4">
              <div className="w-48 h-8 bg-gray-200 rounded-md mx-auto mb-8"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                  <div className="w-full h-6 bg-gray-200 rounded-md mb-2"></div>
                  <div className="w-full h-16 bg-gray-100 rounded-md"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                  <div className="w-full h-6 bg-gray-200 rounded-md mb-2"></div>
                  <div className="w-full h-16 bg-gray-100 rounded-md"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                  <div className="w-full h-6 bg-gray-200 rounded-md mb-2"></div>
                  <div className="w-full h-16 bg-gray-100 rounded-md"></div>
                </div>
              </div>
            </div>

            {/* CTA section mockup */}
            <div className="h-40 bg-gray-100 flex flex-col items-center justify-center p-4">
              <div className="w-2/3 h-8 bg-gray-200 rounded-md mb-4"></div>
              <div className="w-40 h-10 bg-primary/20 rounded-md"></div>
            </div>

            {/* Footer mockup */}
            <div className="h-20 border-t bg-gray-50 flex items-center justify-between px-4">
              <div className="w-32 h-8 bg-gray-200 rounded-md"></div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Heatmap overlay */}
          {showOverlay && <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />}

          {/* Engagement zones overlay */}
          {heatmapType === "engagement" && aggregatedData.engagementZones && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Header zone */}
              <div
                className="absolute top-0 left-0 right-0 h-16 border-2 border-blue-500/50 bg-blue-500/10 flex items-center justify-center"
                style={{
                  opacity: aggregatedData.engagementZones.find((z) => z.id === "header")?.timeSpent ?? 0 / 30,
                }}
              >
                <span className="text-xs font-medium bg-white/80 text-blue-700 px-2 py-1 rounded">
                  {aggregatedData.engagementZones.find((z) => z.id === "header")?.timeSpent.toFixed(1) || 0}s avg. time
                </span>
              </div>

              {/* Hero zone */}
              <div
                className="absolute top-16 left-0 right-0 h-80 border-2 border-red-500/50 bg-red-500/10 flex items-center justify-center"
                style={{
                  opacity: aggregatedData.engagementZones.find((z) => z.id === "hero")?.timeSpent ?? 0 / 60,
                }}
              >
                <span className="text-xs font-medium bg-white/80 text-red-700 px-2 py-1 rounded">
                  {aggregatedData.engagementZones.find((z) => z.id === "hero")?.timeSpent.toFixed(1) || 0}s avg. time
                </span>
              </div>

              {/* Features zone */}
              <div
                className="absolute top-96 left-0 right-0 h-64 border-2 border-green-500/50 bg-green-500/10 flex items-center justify-center"
                style={{
                  opacity: aggregatedData.engagementZones.find((z) => z.id === "features")?.timeSpent ?? 0 / 45,
                }}
              >
                <span className="text-xs font-medium bg-white/80 text-green-700 px-2 py-1 rounded">
                  {aggregatedData.engagementZones.find((z) => z.id === "features")?.timeSpent.toFixed(1) || 0}s avg.
                  time
                </span>
              </div>

              {/* CTA zone */}
              <div
                className="absolute bottom-20 left-0 right-0 h-40 border-2 border-purple-500/50 bg-purple-500/10 flex items-center justify-center"
                style={{
                  opacity: aggregatedData.engagementZones.find((z) => z.id === "cta")?.timeSpent ?? 0 / 25,
                }}
              >
                <span className="text-xs font-medium bg-white/80 text-purple-700 px-2 py-1 rounded">
                  {aggregatedData.engagementZones.find((z) => z.id === "cta")?.timeSpent.toFixed(1) || 0}s avg. time
                </span>
              </div>

              {/* Footer zone */}
              <div
                className="absolute bottom-0 left-0 right-0 h-20 border-2 border-yellow-500/50 bg-yellow-500/10 flex items-center justify-center"
                style={{
                  opacity: aggregatedData.engagementZones.find((z) => z.id === "footer")?.timeSpent ?? 0 / 15,
                }}
              >
                <span className="text-xs font-medium bg-white/80 text-yellow-700 px-2 py-1 rounded">
                  {aggregatedData.engagementZones.find((z) => z.id === "footer")?.timeSpent.toFixed(1) || 0}s avg. time
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm">Low Activity</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm">Medium Activity</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm">High Activity</span>
          </div>
        </div>

        {/* Detailed Data Table for Scroll and Engagement */}
        {heatmapType === "scroll" && aggregatedData.scrollData && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Scroll Depth Analysis</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2 text-left">Depth (%)</th>
                    <th className="px-4 py-2 text-left">Users Reaching (%)</th>
                    <th className="px-4 py-2 text-left">Visualization</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregatedData.scrollData.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{item.depth}%</td>
                      <td className="px-4 py-2">{item.percentage.toFixed(1)}%</td>
                      <td className="px-4 py-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              item.percentage > 66
                                ? "bg-green-500"
                                : item.percentage > 33
                                  ? "bg-yellow-500"
                                  : "bg-red-500",
                            )}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {heatmapType === "engagement" && aggregatedData.engagementZones && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Engagement Zone Analysis</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2 text-left">Zone</th>
                    <th className="px-4 py-2 text-left">Avg. Time Spent (s)</th>
                    <th className="px-4 py-2 text-left">Interactions</th>
                    <th className="px-4 py-2 text-left">Engagement Score</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregatedData.engagementZones
                    .sort((a, b) => b.timeSpent - a.timeSpent)
                    .map((zone, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2 font-medium">{zone.name}</td>
                        <td className="px-4 py-2">{zone.timeSpent.toFixed(1)}s</td>
                        <td className="px-4 py-2">{Math.round(zone.interactions)}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center">
                            <div className="w-full bg-muted rounded-full h-2 mr-2">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  zone.timeSpent > 30
                                    ? "bg-green-500"
                                    : zone.timeSpent > 15
                                      ? "bg-yellow-500"
                                      : "bg-red-500",
                                )}
                                style={{ width: `${(zone.timeSpent / 60) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{Math.round((zone.timeSpent / 60) * 100)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" className="text-xs">
          <Share2 className="h-3.5 w-3.5 mr-1.5" />
          Share Report
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs">
                <Info className="h-3.5 w-3.5 mr-1.5" />
                About Heatmaps
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Heatmaps visualize user behavior on your website. Red areas indicate high activity, yellow shows medium
                activity, and blue represents low activity.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  )
}

