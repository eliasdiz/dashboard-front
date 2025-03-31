"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Activity,
  User,
  FileBarChart,
  FileText,
  Globe,
  Home,
  MapPin,
  Menu,
  PieChart,
  Search,
  Settings,
  Share2,
  Users,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BusinessesTable } from "@/components/businesses-table";
import { PostsTable } from "@/components/posts-table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { KeywordsManagement } from "@/components/keywords-management";
import { ServicesManagement } from "@/components/services-management";
import { SocialMediaManagement } from "@/components/social-media-management";
import { DashboardContent } from "@/components/dashboard-content";
import WordPressExamplePage from "@/components/wordpress-content";
import MarketingReviewsExample from "@/components/marketing-reviews-section";
import CitationsExample from "@/components/citations-section";
import HeatmapExample from "@/components/heatmap-section";
import ReportExample from "@/components/report-section";
import SettingsPage from "@/components/settings-section";
import { UserManagement } from "@/components/user-management/user-management";
import CartButton from "@/components/cart/cart-button";
import CartModal from "@/components/cart/cart-modal";
import { useUser } from "@/context/UserContext";

export function Dashboard() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "locations"
    | "users"
    | "posts"
    | "keywords"
    | "services"
    | "social-media"
    | "wordpress"
    | "reviews"
    | "citations"
    | "heatmaps"
    | "reports"
    | "settings"
  >("overview");
    const auth = useUser()
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-white">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex border-r">
          <SidebarHeader className="bg-primary">
            <div className="flex items-center gap-2 px-4 py-2">
              <Image
                src="/googlerank_editable.svg" // Asegúrate de colocar tu logo en la carpeta public/
                alt="Company Logo"
                width={300} // Ajusta el tamaño según sea necesario
                height={300}
                className="mb-2"
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "overview"}
                      onClick={() => setActiveTab("overview")}
                    >
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "locations"}
                      onClick={() => setActiveTab("locations")}
                    >
                      <Globe className="h-4 w-4" />
                      <span>Businesses</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "users"}
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </SidebarMenuButton>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Automations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "posts"}
                      onClick={() => setActiveTab("posts")}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Posts</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "keywords"}
                      onClick={() => setActiveTab("keywords")}
                    >
                      <Search className="h-4 w-4" />
                      <span>Keywords</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "services"}
                      onClick={() => setActiveTab("services")}
                    >
                      <Wrench className="h-4 w-4" />
                      <span>Services</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "social-media"}
                      onClick={() => setActiveTab("social-media")}
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Social Media</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "wordpress"}
                      onClick={() => setActiveTab("wordpress")}
                    >
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
                    <SidebarMenuButton
                      isActive={activeTab === "reviews"}
                      onClick={() => setActiveTab("reviews")}
                    >
                      <Globe className="h-4 w-4" />
                      <span>Reviews</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "citations"}
                      onClick={() => setActiveTab("citations")}
                    >
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
                    <SidebarMenuButton
                      isActive={activeTab === "heatmaps"}
                      onClick={() => setActiveTab("heatmaps")}
                    >
                      <Activity className="h-4 w-4" />
                      <span>Heatmaps</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeTab === "reports"}
                      onClick={() => setActiveTab("reports")}
                    >
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
                    <SidebarMenuButton
                      isActive={activeTab === "settings"}
                      onClick={() => setActiveTab("settings")}
                    >
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
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                <User className="mr-2 h-4 w-4" />
                Alejandro Uribe
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden fixed top-4 left-4 z-40"
            >
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
                  <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">
                    Main Menu
                  </h3>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeTab === "overview"
                          ? "bg-primary/10 text-primary"
                          : ""
                      } hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("overview");
                        setIsMobileOpen(false);
                      }}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeTab === "locations"
                          ? "bg-primary/10 text-primary"
                          : ""
                      } hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("locations");
                        setIsMobileOpen(false);
                      }}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Businesses
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeTab === "users"
                          ? "bg-primary/10 text-primary"
                          : ""
                      } hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("users");
                        setIsMobileOpen(false);
                      }}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Users
                    </Button>
                  </div>
                </div>

                <div className="px-3 py-2">
                  <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">
                    Automations
                  </h3>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeTab === "posts"
                          ? "bg-primary/10 text-primary"
                          : ""
                      } hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("posts");
                        setIsMobileOpen(false);
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Posts
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeTab === "keywords"
                          ? "bg-primary/10 text-primary"
                          : ""
                      } hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("keywords");
                        setIsMobileOpen(false);
                      }}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Keywords
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeTab === "services"
                          ? "bg-primary/10 text-primary"
                          : ""
                      } hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("services");
                        setIsMobileOpen(false);
                      }}
                    >
                      <Wrench className="mr-2 h-4 w-4" />
                      Services
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeTab === "social-media"
                          ? "bg-primary/10 text-primary"
                          : ""
                      } hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("social-media");
                        setIsMobileOpen(false);
                      }}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Social Media
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeTab === "wordpress"
                          ? "bg-primary/10 text-primary"
                          : ""
                      } hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("wordpress");
                        setIsMobileOpen(false);
                      }}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      WordPress
                    </Button>
                  </div>
                </div>

                <div className="px-3 py-2">
                  <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">
                    Engagement
                  </h3>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeTab === "reviews"
                          ? "bg-primary/10 text-primary"
                          : ""
                      } hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("reviews");
                        setIsMobileOpen(false);
                      }}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Reviews
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeTab === "citations"
                          ? "bg-primary/10 text-primary"
                          : ""
                      } hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("citations");
                        setIsMobileOpen(false);
                      }}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Citations
                    </Button>
                  </div>
                </div>

                <div className="px-3 py-2">
                  <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">
                    Analytics
                  </h3>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeTab === "heatmaps"
                          ? "bg-primary/10 text-primary"
                          : ""
                      } hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("heatmaps");
                        setIsMobileOpen(false);
                      }}
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Heatmaps
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeTab === "reports"
                          ? "bg-primary/10 text-primary"
                          : ""
                      } hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("reports");
                        setIsMobileOpen(false);
                      }}
                    >
                      <FileBarChart className="mr-2 h-4 w-4" />
                      Reports
                    </Button>
                  </div>
                </div>

                <div className="px-3 py-2">
                  <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">
                    General
                  </h3>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        activeTab === "settings"
                          ? "bg-primary/10 text-primary"
                          : ""
                      } hover:bg-primary/20 hover:text-primary`}
                      onClick={() => {
                        setActiveTab("settings");
                        setIsMobileOpen(false);
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
              <div className="border-t p-4">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  <User className="mr-2 h-4 w-4" />
                  Alejandro Uribe
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6">
            <div className="md:hidden w-8" />{" "}
            {/* Spacer for mobile menu button */}
            <SidebarTrigger className="hidden" />
            <div className="ml-auto flex items-center gap-4">
              <>
                <CartButton />
                <CartModal />
              </>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-primary/80 text-white"
                  >
                    AU
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => auth?.logout()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 overflow-auto p-6 w-full">
            {activeTab === "overview" ? (
              <DashboardContent />
            ) : activeTab === "locations" ? (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Business Locations</h1>
                <BusinessesTable />
              </div>
            ) : activeTab === "users" ? (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Users Management</h1>
                <UserManagement />
              </div>
            ) : activeTab === "posts" ? (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Posts Management</h1>
                <PostsTable />
              </div>
            ) : activeTab === "keywords" ? (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Keywords Management</h1>
                <KeywordsManagement />
              </div>
            ) : activeTab === "services" ? (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Services Management</h1>
                <ServicesManagement />
              </div>
            ) : activeTab === "social-media" ? (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Social Media Management</h1>
                <SocialMediaManagement />
              </div>
            ) : activeTab === "wordpress" ? (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Wordpress Management</h1>
                <WordPressExamplePage />
              </div>
            ) : activeTab === "reviews" ? (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Reviews Management</h1>
                <MarketingReviewsExample />
              </div>
            ) : activeTab === "citations" ? (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Citations Management</h1>
                <CitationsExample />
              </div>
            ) : activeTab === "heatmaps" ? (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Heatmaps Management</h1>
                <HeatmapExample />
              </div>
            ) : activeTab === "reports" ? (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Reports Management</h1>
                <ReportExample />
              </div>
            ) : activeTab === "settings" ? (
              <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Settings Management</h1>
                <SettingsPage />
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
