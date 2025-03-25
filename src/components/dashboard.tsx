"use client"

import { useState } from "react"
import {
  Activity,
  BarChart3,
  Calendar,
  CreditCard,
  FileBarChart,
  FileText,
  Globe,
  Home,
  MapPin,
  Menu,
  MessageSquare,
  Package,
  PieChart,
  Search,
  Settings,
  Share2,
  ShoppingCart,
  Star,
  Users,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BusinessesTable } from "@/components/businesses-table"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function Dashboard() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "locations">("overview")

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-white">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex border-r">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <PieChart className="h-4 w-4 text-white" />
              </div>
              <div className="font-semibold text-lg">Dashboard</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === "locations"} onClick={() => setActiveTab("locations")}>
                      <Globe className="h-4 w-4" />
                      <span>Businesses</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Automations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileText className="h-4 w-4" />
                      <span>Posts</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Search className="h-4 w-4" />
                      <span>Keywords</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Wrench className="h-4 w-4" />
                      <span>Services</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Share2 className="h-4 w-4" />
                      <span>Social Media</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Globe className="h-4 w-4" />
                      <span>WordPress</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Engagement</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <MessageSquare className="h-4 w-4" />
                      <span>Messages</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Star className="h-4 w-4" />
                      <span>Reviews</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <MapPin className="h-4 w-4" />
                      <span>Citations</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Analytics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Activity className="h-4 w-4" />
                      <span>Heatmaps</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileBarChart className="h-4 w-4" />
                      <span>Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>General</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Calendar className="h-4 w-4" />
                      <span>Calendar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <Button className="w-full bg-destructive hover:bg-destructive/90 text-white">
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[240px]">
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 px-4 py-4 border-b">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <PieChart className="h-4 w-4 text-white" />
                </div>
                <div className="font-semibold text-lg">Dashboard</div>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <div className="px-3 py-2">
                  <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Main Menu</h3>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${activeTab === "overview" ? "bg-primary/10 text-primary" : ""} hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("overview")
                        setIsMobileOpen(false)
                      }}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${activeTab === "locations" ? "bg-primary/10 text-primary" : ""} hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("locations")
                        setIsMobileOpen(false)
                      }}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Locations
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Orders
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Package className="mr-2 h-4 w-4" />
                      Products
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Customers
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                  </div>
                </div>

                <div className="px-3 py-2">
                  <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Automations</h3>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Posts
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Search className="mr-2 h-4 w-4" />
                      Keywords
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Wrench className="mr-2 h-4 w-4" />
                      Services
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Share2 className="mr-2 h-4 w-4" />
                      Social Media
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Globe className="mr-2 h-4 w-4" />
                      WordPress
                    </Button>
                  </div>
                </div>

                <div className="px-3 py-2">
                  <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Engagement</h3>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Star className="mr-2 h-4 w-4" />
                      Reviews
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <MapPin className="mr-2 h-4 w-4" />
                      Citations
                    </Button>
                  </div>
                </div>

                <div className="px-3 py-2">
                  <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Analytics</h3>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <Activity className="mr-2 h-4 w-4" />
                      Heatmaps
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <FileBarChart className="mr-2 h-4 w-4" />
                      Reports
                    </Button>
                  </div>
                </div>

                <div className="px-3 py-2">
                  <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">General</h3>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Calendar
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
              <div className="border-t p-4">
                <Button className="w-full bg-destructive hover:bg-destructive/90 text-white">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6">
            <div className="md:hidden w-8" /> {/* Spacer for mobile menu button */}
            <SidebarTrigger className="hidden md:flex" />
            <div className="ml-auto flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="text-primary border-primary hover:bg-primary/10 hover:text-primary"
              >
                View Website
              </Button>
              <div className="h-8 w-8 rounded-full bg-muted" />
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 overflow-auto p-6 w-full">
            {activeTab === "overview" ? (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>

                {/* Stats Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <CreditCard className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$45,231.89</div>
                      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                      <Users className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+2,350</div>
                      <p className="text-xs text-muted-foreground">+10.1% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+12,234</div>
                      <p className="text-xs text-muted-foreground">+19% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                      <Package className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+573</div>
                      <p className="text-xs text-muted-foreground">+201 since last month</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>You have 265 orders this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="h-9 w-9 rounded-md bg-muted/20 flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">Order #{1000 + i}</p>
                              <p className="text-xs text-muted-foreground">New order from Customer #{2000 + i}</p>
                            </div>
                            <div className="text-sm text-muted-foreground">${Math.floor(Math.random() * 1000)}.00</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full text-primary border-primary hover:bg-primary/10"
                      >
                        View All Orders
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your recent actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="h-9 w-9 rounded-full bg-secondary/20 flex items-center justify-center">
                              <Users className="h-4 w-4 text-secondary" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {
                                  ["Added new product", "Updated inventory", "Processed refund", "Contacted customer", "AI Integration"][
                                    i - 1
                                  ]
                                }
                              </p>
                              <p className="text-xs text-muted-foreground">{i * 10} minutes ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full text-destructive border-destructive hover:bg-destructive/10"
                      >
                        View All Activity
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Business Locations</h1>
                <BusinessesTable />
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}