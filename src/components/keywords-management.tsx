"use client";

import { Checkbox } from "@/components/ui/checkbox";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronUp,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  BarChart3,
  LineChart,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IKeyword {
  id: string;
  text: string;
  searchVolume: number;
  ctr: number;
  ranking: number;
  previousRanking: number;
  difficulty: number;
  category: string;
  status: string;
  trend: number[];
  rankingHistory: number[];
}

// Sample data for keywords
const sampleKeywords: IKeyword[] = [
  {
    id: "wk1",
    text: "local seo services",
    searchVolume: 2400,
    ctr: 3.2,
    ranking: 4,
    previousRanking: 7,
    difficulty: 65,
    category: "SEO",
    status: "active",
    trend: [1200, 1350, 1500, 1750, 2100, 2400],
    rankingHistory: [12, 10, 8, 7, 5, 4],
  },
  {
    id: "wk2",
    text: "digital marketing agency",
    searchVolume: 5600,
    ctr: 2.8,
    ranking: 6,
    previousRanking: 5,
    difficulty: 78,
    category: "Marketing",
    status: "active",
    trend: [4800, 5000, 5200, 5400, 5500, 5600],
    rankingHistory: [8, 7, 6, 6, 5, 6],
  },
  {
    id: "wk3",
    text: "best seo tools",
    searchVolume: 3800,
    ctr: 4.1,
    ranking: 2,
    previousRanking: 4,
    difficulty: 72,
    category: "Tools",
    status: "active",
    trend: [3200, 3300, 3500, 3600, 3700, 3800],
    rankingHistory: [6, 5, 4, 3, 3, 2],
  },
  {
    id: "wk4",
    text: "google business profile optimization",
    searchVolume: 1900,
    ctr: 3.5,
    ranking: 3,
    previousRanking: 8,
    difficulty: 58,
    category: "Local SEO",
    status: "active",
    trend: [1200, 1400, 1500, 1600, 1800, 1900],
    rankingHistory: [15, 12, 10, 8, 5, 3],
  },
  {
    id: "wk5",
    text: "social media management",
    searchVolume: 7200,
    ctr: 2.4,
    ranking: 9,
    previousRanking: 12,
    difficulty: 82,
    category: "Social Media",
    status: "active",
    trend: [6500, 6700, 6800, 7000, 7100, 7200],
    rankingHistory: [18, 16, 14, 12, 10, 9],
  },
  {
    id: "wk6",
    text: "content marketing strategy",
    searchVolume: 4100,
    ctr: 3.0,
    ranking: 7,
    previousRanking: 9,
    difficulty: 75,
    category: "Content",
    status: "active",
    trend: [3800, 3900, 3950, 4000, 4050, 4100],
    rankingHistory: [11, 10, 9, 8, 8, 7],
  },
  {
    id: "wk7",
    text: "website audit services",
    searchVolume: 2800,
    ctr: 3.7,
    ranking: 5,
    previousRanking: 6,
    difficulty: 68,
    category: "Technical SEO",
    status: "active",
    trend: [2400, 2500, 2600, 2650, 2750, 2800],
    rankingHistory: [9, 8, 7, 6, 6, 5],
  },
  {
    id: "wk8",
    text: "local business listings",
    searchVolume: 3200,
    ctr: 3.3,
    ranking: 8,
    previousRanking: 11,
    difficulty: 62,
    category: "Local SEO",
    status: "active",
    trend: [2800, 2900, 3000, 3100, 3150, 3200],
    rankingHistory: [14, 13, 12, 10, 9, 8],
  },
  {
    id: "wk9",
    text: "ppc management services",
    searchVolume: 3600,
    ctr: 2.9,
    ranking: 10,
    previousRanking: 8,
    difficulty: 70,
    category: "PPC",
    status: "paused",
    trend: [3400, 3450, 3500, 3550, 3580, 3600],
    rankingHistory: [7, 7, 8, 9, 9, 10],
  },
  {
    id: "wk10",
    text: "seo consultant near me",
    searchVolume: 1800,
    ctr: 4.5,
    ranking: 1,
    previousRanking: 2,
    difficulty: 60,
    category: "Local SEO",
    status: "active",
    trend: [1500, 1550, 1600, 1650, 1750, 1800],
    rankingHistory: [4, 3, 3, 2, 2, 1],
  },
  {
    id: "wk11",
    text: "email marketing platform",
    searchVolume: 4800,
    ctr: 2.6,
    ranking: 11,
    previousRanking: 14,
    difficulty: 73,
    category: "Email",
    status: "active",
    trend: [4200, 4300, 4400, 4500, 4700, 4800],
    rankingHistory: [18, 17, 15, 14, 12, 11],
  },
  {
    id: "wk12",
    text: "voice search optimization",
    searchVolume: 1500,
    ctr: 2.2,
    ranking: 15,
    previousRanking: 20,
    difficulty: 85,
    category: "Technical SEO",
    status: "paused",
    trend: [1100, 1200, 1250, 1300, 1400, 1500],
    rankingHistory: [25, 23, 22, 20, 18, 15],
  },
];

// Categories for filtering
const categories = [
  "All",
  "SEO",
  "Marketing",
  "Tools",
  "Local SEO",
  "Social Media",
  "Content",
  "Technical SEO",
  "PPC",
  "Email",
];

export function KeywordsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("ranking");
  const [selectedKeyword, setSelectedKeyword] = useState<IKeyword | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredKeywords, setFilteredKeywords] = useState(sampleKeywords);

  // Filter and sort keywords
  useEffect(() => {
    let result = [...sampleKeywords];

    // Apply search filter
    if (searchTerm) {
      result = result.filter((wordkey) =>
        wordkey.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (wordkey) => wordkey.category === selectedCategory
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "ranking") {
        return a.ranking - b.ranking;
      } else if (sortBy === "volume") {
        return b.searchVolume - a.searchVolume;
      } else if (sortBy === "ctr") {
        return b.ctr - a.ctr;
      } else {
        return a.text.localeCompare(b.text);
      }
    });

    setFilteredKeywords(result);
  }, [searchTerm, selectedCategory, sortBy]);

  // Handle wordkey selection
  const handleKeywordClick = (wordkey: IKeyword) => {
    setSelectedKeyword(wordkey);
    setIsSheetOpen(true);
  };

  // Get ranking change indicator
  const getRankingChange = (current: number, previous: number) => {
    const diff = previous - current;
    if (diff > 0) {
      return {
        icon: <ArrowUpRight className="h-4 w-4 text-success" />,
        text: `+${diff}`,
        color: "text-success",
      };
    } else if (diff < 0) {
      return {
        icon: <ArrowDownRight className="h-4 w-4 text-destructive" />,
        text: `${diff}`,
        color: "text-destructive",
      };
    } else {
      return {
        icon: <ChevronUp className="h-4 w-4 text-muted-foreground" />,
        text: "0",
        color: "text-muted-foreground",
      };
    }
  };

  // Get difficulty color
  const getDifficultyColor = () => {
    return "bg-secondary";
  };

  return (
    <div className="container mx-auto py-6">
      <div className="w-full space-y-6">
        {/* Filters and Controls */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search keywords..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ranking">Ranking</SelectItem>
                <SelectItem value="volume">Search Volume</SelectItem>
                <SelectItem value="ctr">CTR</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <LineChart className="h-4 w-4" />
              </Button>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add Keyword
            </Button>
          </div>
        </div>

        {/* Keywords Display */}
        <div
          className={`grid gap-4 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          <AnimatePresence>
            {filteredKeywords.map((wordkey) => (
              <motion.div
                key={wordkey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <Card
                  className={`overflow-hidden hover:shadow-md transition-all cursor-pointer ${
                    viewMode === "list" ? "flex flex-row items-center" : ""
                  }`}
                  onClick={() => handleKeywordClick(wordkey)}
                >
                  <CardContent
                    className={`p-0 ${
                      viewMode === "list"
                        ? "flex flex-row items-center w-full"
                        : ""
                    }`}
                  >
                    <div
                      className={`p-4 ${
                        viewMode === "list" ? "flex-1 flex items-center" : ""
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between ${
                          viewMode === "list" ? "w-full" : "mb-2"
                        }`}
                      >
                        <div
                          className={`flex items-center ${
                            viewMode === "list" ? "w-1/3" : ""
                          }`}
                        >
                          <Badge
                            variant={
                              wordkey.status === "active"
                                ? "default"
                                : "outline"
                            }
                            className="mr-2"
                          >
                            {wordkey.status === "active" ? "Active" : "Paused"}
                          </Badge>
                          <span className="font-medium truncate">
                            {wordkey.text}
                          </span>
                        </div>

                        {viewMode === "list" && (
                          <>
                            <div className="flex items-center space-x-8">
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">
                                  Interactions
                                </span>
                                <span className="font-medium">
                                  {wordkey.searchVolume.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">
                                  Score
                                </span>
                                <span className="font-medium">
                                  {wordkey.ctr}%
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">
                                  Ranking
                                </span>
                                <div className="flex items-center">
                                  <span className="font-medium mr-1">
                                    #{wordkey.ranking}
                                  </span>
                                  <span
                                    className={`text-xs ${
                                      getRankingChange(
                                        wordkey.ranking,
                                        wordkey.previousRanking
                                      ).color
                                    }`}
                                  >
                                    {
                                      getRankingChange(
                                        wordkey.ranking,
                                        wordkey.previousRanking
                                      ).text
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline">
                                {wordkey.category}
                              </Badge>
                            </div>
                          </>
                        )}
                      </div>

                      {viewMode === "grid" && (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">
                                Interactions
                              </span>
                              <span className="font-medium">
                                {wordkey.searchVolume.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-muted-foreground">
                                Score
                              </span>
                              <span className="font-medium">
                                {wordkey.ctr}%
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-1">
                                Rank #{wordkey.ranking}
                              </span>
                              <div className="flex items-center">
                                {
                                  getRankingChange(
                                    wordkey.ranking,
                                    wordkey.previousRanking
                                  ).icon
                                }
                                <span
                                  className={`text-xs ${
                                    getRankingChange(
                                      wordkey.ranking,
                                      wordkey.previousRanking
                                    ).color
                                  }`}
                                >
                                  {
                                    getRankingChange(
                                      wordkey.ranking,
                                      wordkey.previousRanking
                                    ).text
                                  }
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline">{wordkey.category}</Badge>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">
                                Difficulty
                              </span>
                              <span className="text-xs">
                                {wordkey.difficulty}%
                              </span>
                            </div>
                            <div className="w-full bg-destructive rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${getDifficultyColor()}`}
                                style={{ width: `${wordkey.difficulty}%` }}
                              ></div>
                            </div>
                              <div className="flex justify-center gap-[1rem] my-[1rem]">
                                <Button>Reports</Button>
                                <Button>Gen. Heatmap</Button>
                              </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredKeywords.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No keywords found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filters to find what you`re looking
              for.
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Keyword Detail Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-md overflow-y-auto p-[2rem]">
            {selectedKeyword && (
              <>
                <SheetHeader>
                  <SheetTitle>Keyword Details</SheetTitle>
                  <SheetDescription>
                    View and edit details for this wordkey.
                  </SheetDescription>
                </SheetHeader>

                <div className="py-6">
                  <Tabs defaultValue="overview">
                    <TabsList className="w-full">
                      <TabsTrigger value="overview" className="flex-1">
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="performance" className="flex-1">
                        Performance
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="flex-1">
                        Settings
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4 mt-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">
                          {selectedKeyword.text}
                        </h3>
                        <Badge variant="outline">
                          {selectedKeyword.category}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground">
                              Interactions
                            </div>
                            <div className="text-2xl font-bold">
                              {selectedKeyword.searchVolume.toLocaleString()}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground">
                              Score
                            </div>
                            <div className="text-2xl font-bold">
                              {selectedKeyword.ctr}%
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground">
                              Current Ranking
                            </div>
                            <div className="flex items-center">
                              <div className="text-2xl font-bold mr-2">
                                #{selectedKeyword.ranking}
                              </div>
                              <div
                                className={`flex items-center ${
                                  getRankingChange(
                                    selectedKeyword.ranking,
                                    selectedKeyword.previousRanking
                                  ).color
                                }`}
                              >
                                {
                                  getRankingChange(
                                    selectedKeyword.ranking,
                                    selectedKeyword.previousRanking
                                  ).icon
                                }
                                <span className="text-sm">
                                  {
                                    getRankingChange(
                                      selectedKeyword.ranking,
                                      selectedKeyword.previousRanking
                                    ).text
                                  }
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground">
                              Difficulty
                            </div>
                            <div className="text-2xl font-bold">
                              {selectedKeyword.difficulty}%
                            </div>
                            <div className="w-full bg-destructive rounded-full h-2 mt-2">
                              <div
                                className={`h-2 rounded-full ${getDifficultyColor()}`}
                                style={{
                                  width: `${selectedKeyword.difficulty}%`,
                                }}
                              ></div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium mb-3">
                            Ranking History
                          </h4>
                          <div className="h-40 flex items-end space-x-2">
                            {selectedKeyword.rankingHistory.map(
                              (rank: number, index: number) => (
                                <TooltipProvider key={index}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className="bg-primary/80 hover:bg-primary rounded-t-md w-8 transition-all"
                                        style={{
                                          height: `${(1 - rank / 30) * 100}%`,
                                          minHeight: "10%",
                                        }}
                                      ></div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Rank #{rank}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(
                                          Date.now() -
                                            (5 - index) *
                                              30 *
                                              24 *
                                              60 *
                                              60 *
                                              1000
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            )}
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>6 months ago</span>
                            <span>Now</span>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-4 mt-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium mb-3">
                            Search Volume Trend
                          </h4>
                          <div className="h-40 flex items-end space-x-2">
                            {selectedKeyword.trend.map(
                              (volume: number, index: number) => (
                                <TooltipProvider key={index}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className="bg-secondary/80 hover:bg-secondary rounded-t-md w-8 transition-all"
                                        style={{
                                          height: `${
                                            (volume /
                                              Math.max(
                                                ...selectedKeyword.trend
                                              )) *
                                            100
                                          }%`,
                                          minHeight: "10%",
                                        }}
                                      ></div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{volume.toLocaleString()} searches</p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(
                                          Date.now() -
                                            (5 - index) *
                                              30 *
                                              24 *
                                              60 *
                                              60 *
                                              1000
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            )}
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>6 months ago</span>
                            <span>Now</span>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="text-sm font-medium mb-2">
                              Click Potential
                            </h4>
                            <div className="text-2xl font-bold">
                              {Math.round(
                                selectedKeyword.searchVolume *
                                  (selectedKeyword.ctr / 100)
                              ).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Estimated monthly clicks
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="text-sm font-medium mb-2">
                              Ranking Opportunity
                            </h4>
                            <div className="flex items-center">
                              <div className="text-2xl font-bold mr-2">
                                {selectedKeyword.ranking <= 3
                                  ? "High"
                                  : selectedKeyword.ranking <= 10
                                  ? "Medium"
                                  : "Low"}
                              </div>
                              {selectedKeyword.ranking <= 3 ? (
                                <TrendingUp className="h-5 w-5 text-success" />
                              ) : null}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Based on current position
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium mb-3">
                            Competitive Analysis
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Content Quality</span>
                                <span className="font-medium">Good</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-success h-2 rounded-full"
                                  style={{ width: "70%" }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Backlink Profile</span>
                                <span className="font-medium">Average</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-accent h-2 rounded-full"
                                  style={{ width: "50%" }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Technical SEO</span>
                                <span className="font-medium">Excellent</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-success h-2 rounded-full"
                                  style={{ width: "85%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4 mt-4">
                      <Card>
                        <CardContent className="p-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="wordkey-text">Keyword Text</Label>
                            <Input
                              id="wordkey-text"
                              defaultValue={selectedKeyword.text}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="wordkey-category">Category</Label>
                            <Select defaultValue={selectedKeyword.category}>
                              <SelectTrigger id="wordkey-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.slice(1).map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="wordkey-status">
                                Active Status
                              </Label>
                              <Switch
                                id="wordkey-status"
                                checked={selectedKeyword.status === "active"}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Toggle to activate or pause tracking for this
                              wordkey.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label>Tracking Priority</Label>
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Low</span>
                              <Slider
                                defaultValue={[
                                  selectedKeyword.ranking <= 3
                                    ? 80
                                    : selectedKeyword.ranking <= 10
                                    ? 50
                                    : 30,
                                ]}
                                max={100}
                                step={10}
                                className="w-[70%]"
                              />
                              <span className="text-xs">High</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Notification Settings</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="notify-ranking" defaultChecked />
                                <label
                                  htmlFor="notify-ranking"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Ranking changes
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="notify-volume" defaultChecked />
                                <label
                                  htmlFor="notify-volume"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Search volume changes
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="notify-competitors" />
                                <label
                                  htmlFor="notify-competitors"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Competitor movements
                                </label>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Keyword
                        </Button>
                        <Button>
                          <Check className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <SheetFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    Close
                  </Button>
                </SheetFooter>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
