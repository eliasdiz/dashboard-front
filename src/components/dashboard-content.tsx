"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Globe,
  ImageIcon,
  MapPin,
  MessageSquare,
  Phone,
  PieChart,
  Plus,
  Send,
  Star,
  ThumbsUp,
  TrendingUp,
  User,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for business metrics
const businessMetrics = {
  overview: {
    totalViews: 12458,
    viewsChange: 12.5,
    totalActions: 843,
    actionsChange: 8.2,
    conversionRate: 6.8,
    conversionChange: -2.1,
  },
  calls: {
    total: 187,
    change: 15.3,
    weeklyData: [12, 18, 22, 15, 25, 30, 28],
  },
  websiteClicks: {
    total: 456,
    change: 9.7,
    weeklyData: [45, 52, 38, 65, 48, 58, 62],
  },
  reviewsAverage: {
    current: 4.7,
    total: 128,
    change: 0.2,
    monthlyData: [4.2, 4.3, 4.5, 4.6, 4.7, 4.7],
  },
  posts: {
    total: 24,
    engagement: 1245,
    engagementChange: 18.5,
  },
  citations: {
    total: 42,
    complete: 38,
    incomplete: 4,
    sources: [
      { name: "Google", status: "complete" },
      { name: "Yelp", status: "complete" },
      { name: "Facebook", status: "complete" },
      { name: "Bing", status: "incomplete" },
      { name: "Apple Maps", status: "complete" },
      { name: "Yellow Pages", status: "incomplete" },
    ],
  },
  trafficSources: {
    mobile: 65,
    desktop: 25,
    maps: 10,
  },
};

// Mock data for reviews
const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    date: "2023-11-15",
    text: "Absolutely amazing service! The team was professional, responsive, and delivered exactly what I needed. Would highly recommend to anyone looking for quality work.",
    reply:
      "Thank you so much for your kind words, Sarah! We're thrilled that you had a great experience with our team. We look forward to working with you again in the future!",
  },
  {
    id: 2,
    name: "Michael Brown",
    rating: 4,
    date: "2023-11-10",
    text: "Good experience overall. The work was completed on time and the quality was good. The only reason I'm not giving 5 stars is because communication could have been a bit better during the process.",
    reply:
      "Hi Michael, thank you for your feedback! We appreciate your comments about our timeliness and quality. We're always looking to improve, and we'll definitely work on enhancing our communication. Please don't hesitate to reach out if you have any other suggestions!",
  },
  {
    id: 3,
    name: "Emily Davis",
    rating: 5,
    date: "2023-11-05",
    text: "I've used many similar services before, but this one stands out. The attention to detail and customer service are exceptional. I'll definitely be a repeat customer!",
    reply:
      "Emily, we're so happy to hear that our service stood out to you! Our team takes great pride in our attention to detail and customer service, so your recognition means a lot. We can't wait to work with you again!",
  },
  {
    id: 4,
    name: "David Wilson",
    rating: 3,
    date: "2023-10-28",
    text: "The service was okay. It met my basic requirements, but I was expecting a bit more based on the reviews. The team was friendly though, and they did address my concerns when I raised them.",
    reply:
      "David, thank you for taking the time to share your experience. We're sorry we didn't fully meet your expectations. We value your feedback and will use it to improve our services. If you'd like to discuss your concerns further, please don't hesitate to contact us directly.",
  },
];

// Categories for filtering
const business = [
  "Google",
  "Meta",
  "Amazon",
  "Apple",
  "Microsoft",
  "Tesla",
  "Netflix",
  "Adobe",
  "Shopify",
  "Salesforce",
];

export function DashboardContent() {
  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState("Google");
  const [postText, setPostText] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const toggleReviewExpansion = (reviewId: number) => {
    setExpandedReviewId(expandedReviewId === reviewId ? null : reviewId);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Generate star rating display
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-muted fill-muted" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Render change indicator with arrow
  const renderChangeIndicator = (change: number) => {
    return (
      <div
        className={`flex items-center text-xs font-medium ${
          change >= 0 ? "text-secondary" : "text-red-500"
        }`}
      >
        {change >= 0 ? (
          <ArrowUp className="mr-1 h-3 w-3" />
        ) : (
          <ArrowDown className="mr-1 h-3 w-3" />
        )}
        {Math.abs(change)}%
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {business.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Business Metrics Overview - Stacked Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Overview Section */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Overview
            </h3>
            <Badge variant="outline">Last 30 days</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">
                    {businessMetrics.overview.totalViews.toLocaleString()}
                  </p>
                  <div className="ml-2">
                    {renderChangeIndicator(
                      businessMetrics.overview.viewsChange
                    )}
                  </div>
                </div>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Actions</p>
                <div className="flex items-center">
                  <p className="text-lg font-semibold">
                    {businessMetrics.overview.totalActions}
                  </p>
                  <div className="ml-2">
                    {renderChangeIndicator(
                      businessMetrics.overview.actionsChange
                    )}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversion</p>
                <div className="flex items-center">
                  <p className="text-lg font-semibold">
                    {businessMetrics.overview.conversionRate}%
                  </p>
                  <div className="ml-2">
                    {renderChangeIndicator(
                      businessMetrics.overview.conversionChange
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Calls Section */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <Phone className="mr-2 h-5 w-5 text-primary" />
              Calls
            </h3>
            <Badge variant="outline">Last 7 days</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Calls</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">
                    {businessMetrics.calls.total}
                  </p>
                  <div className="ml-2">
                    {renderChangeIndicator(businessMetrics.calls.change)}
                  </div>
                </div>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="h-12 flex items-end space-x-1">
              {businessMetrics.calls.weeklyData.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-primary rounded-t-sm"
                  style={{
                    height: `${
                      (value / Math.max(...businessMetrics.calls.weeklyData)) *
                      100
                    }%`,
                    opacity:
                      0.6 +
                      (index / businessMetrics.calls.weeklyData.length) * 0.4,
                  }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </Card>

        {/* Website Clicks Section */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <Globe className="mr-2 h-5 w-5 text-primary" />
              Website Clicks
            </h3>
            <Badge variant="outline">Last 7 days</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">
                    {businessMetrics.websiteClicks.total}
                  </p>
                  <div className="ml-2">
                    {renderChangeIndicator(
                      businessMetrics.websiteClicks.change
                    )}
                  </div>
                </div>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="h-12 flex items-end space-x-1">
              {businessMetrics.websiteClicks.weeklyData.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-secondary rounded-t-sm"
                  style={{
                    height: `${
                      (value /
                        Math.max(...businessMetrics.websiteClicks.weeklyData)) *
                      100
                    }%`,
                    opacity:
                      0.6 +
                      (index /
                        businessMetrics.websiteClicks.weeklyData.length) *
                        0.4,
                  }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </Card>

        {/* Reviews Average Section */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <Star className="mr-2 h-5 w-5 text-primary" />
              Reviews Average
            </h3>
            <Badge variant="outline">Last 6 months</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">
                    {businessMetrics.reviewsAverage.current}
                  </p>
                  <div className="ml-2">
                    {renderChangeIndicator(
                      businessMetrics.reviewsAverage.change
                    )}
                  </div>
                </div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(businessMetrics.reviewsAverage.current)
                        ? "text-muted fill-muted"
                        : i < businessMetrics.reviewsAverage.current
                        ? "text-muted fill-muted opacity-50"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-sm font-medium">Total Reviews:</p>
              <p className="text-sm">{businessMetrics.reviewsAverage.total}</p>
            </div>
            <div className="h-12 flex items-end space-x-1">
              {businessMetrics.reviewsAverage.monthlyData.map(
                (value, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-muted rounded-t-sm"
                    style={{
                      height: `${(value / 5) * 100}%`,
                    }}
                  ></div>
                )
              )}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
            </div>
          </div>
        </Card>

        {/* Posts Section */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" />
              Posts
            </h3>
            <Badge variant="outline">All Time</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">
                  {businessMetrics.posts.total}
                </p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-muted-foreground">Engagement</p>
                <div className="flex items-center text-xs font-medium">
                  <p>{businessMetrics.posts.engagement}</p>
                  <div className="ml-2">
                    {renderChangeIndicator(
                      businessMetrics.posts.engagementChange
                    )}
                  </div>
                </div>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <ThumbsUp className="h-4 w-4 text-blue-500" />
                <p className="text-sm">854</p>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-secondary" />
                <p className="text-sm">391</p>
              </div>
              <div className="flex items-center space-x-2">
                <Share className="h-4 w-4 text-purple-500" />
                <p className="text-sm">124</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Citations Section */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-primary" />
              Citations
            </h3>
            <Badge variant="outline">Last Updated: Today</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Citations</p>
                <p className="text-2xl font-bold">
                  {businessMetrics.citations.total}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-secondary mr-1"></div>
                  <p className="text-xs">
                    {businessMetrics.citations.complete}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                  <p className="text-xs">
                    {businessMetrics.citations.incomplete}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {businessMetrics.citations.sources.map((source, index) => (
                <div
                  key={index}
                  className={`text-xs px-2 py-1 rounded-md flex items-center justify-between ${
                    source.status === "complete"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  <span>{source.name}</span>
                  {source.status === "complete" ? (
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-sm font-medium">
                {Math.round(
                  (businessMetrics.citations.complete /
                    businessMetrics.citations.total) *
                    100
                )}
                %
              </p>
            </div>
            <Progress
              value={
                (businessMetrics.citations.complete /
                  businessMetrics.citations.total) *
                100
              }
              className="h-2"
            />
          </div>
        </Card>
      </div>

      {/* Post Publisher & Pie Chart (Side-by-Side Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Post Publisher */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <h3 className="font-semibold flex items-center mb-4">
            <MessageSquare className="mr-2 h-5 w-5 text-primary" />
            Post Publisher
          </h3>
          <div className="space-y-4">
            <Tabs defaultValue="post" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-destructive">
                <TabsTrigger value="post">Post</TabsTrigger>
                <TabsTrigger value="photo">Photo</TabsTrigger>
                <TabsTrigger value="offer">Offer</TabsTrigger>
              </TabsList>
              <TabsContent value="post" className="space-y-4 mt-4">
                <Textarea
                  placeholder="What's new with your business?"
                  className="min-h-[100px]"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Schedule</Button>
                    <Button className="bg-destructive hover:bg-destructive/90">
                      <Send className="mr-2 h-4 w-4" />
                      Publish
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="photo" className="space-y-4 mt-4">
                <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your photos here
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">or</p>
                  <Button className="bg-destructive hover:bg-destructive/90">Browse Files</Button>
                </div>
                <div className="flex items-center justify-between">
                  <Input
                    placeholder="Add a caption..."
                    className="flex-1 mr-2"
                  />
                  <Button className="bg-destructive hover:bg-destructive/90">
                    <Send className="mr-2 h-4 w-4" />
                    Publish
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="offer" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Offer Title</label>
                    <Input placeholder="e.g., 20% Off First Visit" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Offer Details</label>
                    <Textarea
                      placeholder="Describe your offer..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <div className="flex">
                        <Input type="date" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <div className="flex">
                        <Input type="date" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-destructive hover:bg-destructive/90">
                    Create Offer
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        {/* Pie Chart (Traffic Sources) */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <h3 className="font-semibold flex items-center mb-4">
            <PieChart className="mr-2 h-5 w-5 text-primary" />
            Traffic Sources
          </h3>
          <div className="flex flex-col items-center justify-center h-[250px]">
            {/* Pie Chart Visualization */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Mobile Slice (65%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#4285F4"
                  strokeWidth="20"
                  strokeDasharray={`${65 * 2.51} ${100 * 2.51}`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                {/* Desktop Slice (25%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#34A853"
                  strokeWidth="20"
                  strokeDasharray={`${25 * 2.51} ${100 * 2.51}`}
                  strokeDashoffset={`${-65 * 2.51}`}
                  transform="rotate(-90 50 50)"
                />
                {/* Maps Slice (10%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#FBBC05"
                  strokeWidth="20"
                  strokeDasharray={`${10 * 2.51} ${100 * 2.51}`}
                  strokeDashoffset={`${-(65 + 25) * 2.51}`}
                  transform="rotate(-90 50 50)"
                />
                {/* Inner Circle (white) */}
                <circle cx="50" cy="50" r="30" fill="white" />
                {/* Percentage Text */}
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-bold"
                  fill="#333"
                >
                  100%
                </text>
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 w-full">
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                  <span className="text-sm font-medium">Mobile</span>
                </div>
                <span className="text-lg font-bold">
                  {businessMetrics.trafficSources.mobile}%
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                  <span className="text-sm font-medium">Desktop</span>
                </div>
                <span className="text-lg font-bold">
                  {businessMetrics.trafficSources.desktop}%
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-muted mr-2"></div>
                  <span className="text-sm font-medium">Maps</span>
                </div>
                <span className="text-lg font-bold">
                  {businessMetrics.trafficSources.maps}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Review Replies & AI Summary (Side-by-Side Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Replies */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <Star className="mr-2 h-5 w-5 text-primary" />
              Review Replies
            </h3>
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-auto"
            >
              <TabsList className="grid w-[200px] grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="replied">Replied</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border rounded-lg p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <User className="h-4 w-4" />
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{review.name}</p>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatDate(review.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleReviewExpansion(review.id)}
                  >
                    {expandedReviewId === review.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm mb-2">{review.text}</p>
                <AnimatePresence>
                  {expandedReviewId === review.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-start mb-2">
                          <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-medium">Your Reply</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(
                                new Date().toISOString().split("T")[0]
                              )}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm">{review.reply}</p>
                        <div className="flex justify-end mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                          >
                            Edit Reply
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Summary */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              AI Business Insights
            </h3>
            <Badge variant="outline" className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              Updated 2 hours ago
            </Badge>
          </div>
          <div className="space-y-4">
            <div className="bg-primary/5 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-primary">
                Performance Summary
              </h4>
              <p className="text-sm">
                Your business is showing strong growth with a{" "}
                <span className="font-medium">12.5% increase</span> in total
                views and <span className="font-medium">8.2% increase</span> in
                customer actions over the past 30 days. Call volume has
                increased significantly by{" "}
                <span className="font-medium">
                  15.3% compared to last month
                </span>
                , indicating growing customer interest.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Key Strengths</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">
                      Strong review performance
                    </span>{" "}
                    with a 4.7/5 average rating across 128 reviews.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">High mobile traffic</span> at
                    65%, indicating strong performance on mobile search.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">
                      Excellent citation completion
                    </span>{" "}
                    with 38 out of 42 citations complete (90%).
                  </p>
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Areas for Improvement</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center mr-2 mt-0.5">
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">
                      Conversion rate has decreased
                    </span>{" "}
                    by 2.1%. Consider optimizing your call-to-action elements.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center mr-2 mt-0.5">
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">
                      Complete missing citations
                    </span>{" "}
                    on Bing and Yellow Pages to improve local search visibility.
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-2">Recommended Actions</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>
                  Respond to the 2 pending customer reviews to maintain
                  engagement.
                </li>
                <li>
                  Create a special offer post to improve conversion rates.
                </li>
                <li>
                  Complete the missing citations on Bing and Yellow Pages.
                </li>
                <li>
                  Consider increasing desktop optimization efforts (only 25% of
                  traffic).
                </li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Share icon component for the Posts section
function Share({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4", className)}
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
