"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Tag,
  Globe,
  Target,
  Save,
  DollarSign,
  Briefcase,
  Key,
  Locate,
  ImageDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
// import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import ReportSheet from "./report-sheet"

// Define the Zod schema for validation
const phoneSchema = z.object({
  number: z.string().min(10, "Phone number must be at least 10 characters"),
})

const serviceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
})

const keywordSchema = z.object({
  text: z.string().min(2, "Keyword must be at least 2 characters"),
})

const locationSchema = z.object({
  name: z.string().min(2, "Location name must be at least 2 characters"),
})

const tagSchema = z.object({
  name: z.string().min(2, "Tag must be at least 2 characters"),
})

const coordinatesSchema = z.object({
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

const businessFormSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  locationId: z.string().min(1, "Location ID is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  phones: z.array(phoneSchema).optional(),
  services: z.array(serviceSchema).optional(),
  keywords: z.array(keywordSchema).optional(),
  targetLocations: z.array(locationSchema).optional(),
  tags: z.array(tagSchema).optional(),
  website: z.string().url("Please enter a valid URL"),
  coordinates: coordinatesSchema.optional(),
  cid: z.string().optional(),
  imagePrompt: z.string().optional(),
  status: z.enum(["active", "paused", "draft"]).default("active"),
})

// Define the type from the schema
export type BusinessFormData = z.infer<typeof businessFormSchema>

// Sample data for filtering and display
interface KeywordsManagementProps {
  initialData: BusinessFormData[]
  onSave?: (data: BusinessFormData) => void
  onDelete?: (id: string) => void
  onUpdate?: (id: string, data: BusinessFormData) => void
}

export function KeywordsManagement({ initialData, onSave, onDelete, onUpdate }: KeywordsManagementProps) {
  // State for the component
  const [searchTerm, setSearchTerm] = useState("")
  const [categories] = useState(["All", "Local SEO", "Marketing", "Social Media", "Content", "Technical SEO"])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const [selectedKeyword, setSelectedKeyword] = useState<BusinessFormData | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [viewMode] = useState<"grid" | "list">("grid")
  const [keywords, setKeywords] = useState<BusinessFormData[]>(initialData)
  const [filteredKeywords, setFilteredKeywords] = useState<BusinessFormData[]>(initialData)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Setup form with react-hook-form and zod validation
  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: "",
      location: "",
      locationId: "",
      price: 0,
      phones: [],
      services: [],
      keywords: [],
      targetLocations: [],
      tags: [],
      website: "",
      coordinates: {
        latitude: "",
        longitude: "",
      },
      cid: "",
      imagePrompt: "",
      status: "active",
    },
  })

  // Setup field arrays for dynamic lists
  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control: form.control,
    name: "phones",
  })

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control: form.control,
    name: "services",
  })

  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    control: form.control,
    name: "keywords",
  })

  const {
    fields: targetLocationFields,
    append: appendTargetLocation,
    remove: removeTargetLocation,
  } = useFieldArray({
    control: form.control,
    name: "targetLocations",
  })

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: "tags",
  })

  // Filter and sort keywords
  useEffect(() => {
    let result = [...keywords]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (keyword) =>
          keyword.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          keyword.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter((keyword) => {
        const tags = keyword.tags?.map((tag) => tag.name) || []
        return tags.includes(selectedCategory)
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "location") {
        return a.location.localeCompare(b.location)
      } else if (sortBy === "price") {
        return a.price - b.price
      }
      return 0
    })

    setFilteredKeywords(result)
  }, [searchTerm, selectedCategory, sortBy, keywords])

  // Handle keyword selection
  const handleKeywordClick = (keyword: BusinessFormData) => {
    setSelectedKeyword(keyword)
    setIsAddingNew(false)
    form.reset(keyword)
    setIsSheetOpen(true)
  }

  // Handle adding a new keyword
  const handleAddNew = () => {
    setSelectedKeyword(null)
    setIsAddingNew(true)
    form.reset({
      name: "",
      location: "",
      locationId: "",
      price: 0,
      phones: [],
      services: [],
      keywords: [],
      targetLocations: [],
      tags: [],
      website: "",
      coordinates: {
        latitude: "",
        longitude: "",
      },
      cid: "",
      imagePrompt: "",
      status: "active",
    })
    setIsSheetOpen(true)
  }

  // Handle form submission
  const onSubmit = (data: BusinessFormData) => {
    if (isAddingNew) {
      // Generate a unique ID for the new keyword
      const newKeyword = {
        ...data,
        id: `wk${Date.now()}`,
      }
      setKeywords([...keywords, newKeyword])
      if (onSave) onSave(newKeyword)
      // toast({
      //   title: "Keyword Added",
      //   description: `${data.name} has been added successfully.`,
      // })
    } else if (selectedKeyword) {
      // Update existing keyword
      const updatedKeywords = keywords.map((wk) =>
        wk.locationId === selectedKeyword.locationId ? { ...data, id: selectedKeyword.locationId } : wk,
      )
      setKeywords(updatedKeywords)
      if (onUpdate) onUpdate(selectedKeyword.locationId, { ...data, locationId: selectedKeyword.locationId })
      // toast({
      //   title: "Keyword Updated",
      //   description: `${data.name} has been updated successfully.`,
      // })
    }
    setIsSheetOpen(false)
  }

  // Handle keyword deletion
  const handleDelete = () => {
    if (selectedKeyword) {
      const updatedKeywords = keywords.filter((wk) => wk.locationId !== selectedKeyword.locationId)
      setKeywords(updatedKeywords)
      if (onDelete) onDelete(selectedKeyword.locationId)
      // toast({
      //   title: "Keyword Deleted",
      //   description: `${selectedKeyword.name} has been deleted.`,
      // })
      setIsSheetOpen(false)
    }
  }

  // Render the component
  return (
    <div className="w-full space-y-6">

      <ReportSheet isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

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
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Keyword
          </Button>
        </div>
      </div>

      {/* Keywords Display */}
      <div
        className={`grid gap-4 ${
          viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        }`}
      >
        <AnimatePresence>
          {filteredKeywords.map((keyword) => (
            <motion.div
              key={keyword.locationId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <Card
                className="overflow-hidden hover:shadow-md transition-all cursor-pointer"
              >
                <CardContent className="p-4" onClick={() => handleKeywordClick(keyword)}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Badge variant={keyword.status === "active" ? "default" : "outline"} className="mr-2">
                        {keyword.status === "active" ? "Active" : keyword.status === "paused" ? "Paused" : "Draft"}
                      </Badge>
                      <span className="font-medium truncate">{keyword.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-muted-foreground text-sm mb-3">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{keyword.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Price</span>
                      <span className="font-medium">${keyword.price.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground">Services</span>
                      <span className="font-medium">{keyword.services?.length || 0}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {keyword.tags?.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                    {(keyword.tags?.length || 0) > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(keyword.tags?.length || 0) - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
                  <div className="flex justify-center gap-2">
                    <Button onClick={() => setIsModalOpen(true)}>Report</Button>
                    <Button>Heatmap</Button>
                  </div>
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
            Try adjusting your search or filters to find what you`re looking for.
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("All")
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Keyword Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto p-[1rem]">
          <SheetHeader>
            <SheetTitle>{isAddingNew ? "Add New Keyword" : "Edit Keyword"}</SheetTitle>
            <SheetDescription>
              {isAddingNew ? "Add a new keyword to your collection." : "Make changes to your keyword here."}
            </SheetDescription>
          </SheetHeader>

          <div className="py-6">
            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">
                  Details
                </TabsTrigger>
                <TabsTrigger value="services" className="flex-1">
                  Services
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex-1">
                  Advanced
                </TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <TabsContent value="details" className="space-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter business name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="City, State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="locationId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Location identifier" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="number" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="https://example.com" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Active Status</FormLabel>
                            <FormDescription>
                              Set whether this keyword is active, paused, or in draft mode.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div>
                      <Label className="mb-2 block">Tags</Label>
                      <div className="space-y-2">
                        {tagFields.map((field, index) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name={`tags.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <div className="relative">
                                      <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                      <Input placeholder="Tag name" className="pl-8" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeTag(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendTag({ name: "" })}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Tag
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="services" className="space-y-4 mt-4">
                    <div>
                      <Label className="mb-2 block">Phone Numbers</Label>
                      <div className="space-y-2">
                        {phoneFields.map((field, index) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name={`phones.${index}.number`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <div className="relative">
                                      <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                      <Input placeholder="Phone number" className="pl-8" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendPhone({ number: "" })}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Phone
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Services</Label>
                      <div className="space-y-2">
                        {serviceFields.map((field, index) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name={`services.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <div className="relative">
                                      <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                      <Input placeholder="Service name" className="pl-8" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeService(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendService({ name: "" })}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Service
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Keywords</Label>
                      <div className="space-y-2">
                        {keywordFields.map((field, index) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name={`keywords.${index}.text`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <div className="relative">
                                      <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                      <Input placeholder="Keyword text" className="pl-8" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeKeyword(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendKeyword({ text: "" })}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Keyword
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Target Locations</Label>
                      <div className="space-y-2">
                        {targetLocationFields.map((field, index) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name={`targetLocations.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <div className="relative">
                                      <Target className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                      <Input placeholder="Target location" className="pl-8" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTargetLocation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendTargetLocation({ name: "" })}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Target Location
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="cid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CID</FormLabel>
                          <FormControl>
                            <Input placeholder="Customer ID" {...field} />
                          </FormControl>
                          <FormDescription>Google My Business Customer ID</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label>Coordinates</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="coordinates.latitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Latitude</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Locate className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="Latitude" className="pl-8" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="coordinates.longitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Longitude</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Locate className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="Longitude" className="pl-8" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="imagePrompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image Prompt</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Textarea
                                placeholder="Describe the image you want to generate..."
                                className="min-h-[100px]"
                                {...field}
                              />
                              {field.value && (
                                <div className="p-4 border rounded-md bg-muted/50">
                                  <div className="flex items-center justify-between mb-2">
                                    <Label>Preview</Label>
                                    <Badge variant="outline">AI Generated</Badge>
                                  </div>
                                  <div className="flex items-center justify-center h-40 bg-background rounded-md border border-dashed">
                                    <div className="flex flex-col items-center text-muted-foreground">
                                      <ImageDown className="h-8 w-8 mb-2" />
                                      <span className="text-sm">Image will be generated on save</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>Provide a detailed description for AI image generation</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <div className="flex justify-between mt-6">
                    {!isAddingNew && (
                      <Button
                        type="button"
                        variant="outline"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleDelete}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Keyword
                      </Button>
                    )}
                    <Button type="submit" className={cn(isAddingNew && "ml-auto")}>
                      <Save className="h-4 w-4 mr-2" />
                      {isAddingNew ? "Create Keyword" : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </Tabs>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancel
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

