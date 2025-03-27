"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Check,
  X,
  Tag,
  DollarSign,
  Clock,
  Star,
  Filter,
  Save,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface IService {
    id: string;
    name: string;
    status: string;
    price: number;
    category: string;
    description: string;
    popularity: string;
    timeEstimate: string;
}

// Sample data for services
const initialServices: IService[] = [
  {
    id: "service-1",
    name: "Website Design",
    status: "active",
    price: 1499,
    category: "design",
    description: "Custom website design with responsive layouts and modern aesthetics.",
    popularity: "high",
    timeEstimate: "2-3 weeks",
  },
  {
    id: "service-2",
    name: "SEO Optimization",
    status: "active",
    price: 799,
    category: "marketing",
    description: "Comprehensive SEO service to improve search engine rankings and visibility.",
    popularity: "high",
    timeEstimate: "1-2 months",
  },
  {
    id: "service-3",
    name: "Content Writing",
    status: "active",
    price: 299,
    category: "content",
    description: "Professional content writing for websites, blogs, and marketing materials.",
    popularity: "medium",
    timeEstimate: "1-2 weeks",
  },
  {
    id: "service-4",
    name: "Logo Design",
    status: "inactive",
    price: 599,
    category: "design",
    description: "Custom logo design with multiple revisions and file formats.",
    popularity: "medium",
    timeEstimate: "1 week",
  },
  {
    id: "service-5",
    name: "Social Media Management",
    status: "active",
    price: 899,
    category: "marketing",
    description: "Complete social media management including content creation and engagement.",
    popularity: "high",
    timeEstimate: "Monthly",
  },
  {
    id: "service-6",
    name: "Email Marketing",
    status: "active",
    price: 499,
    category: "marketing",
    description: "Email campaign design, setup, and management for better customer engagement.",
    popularity: "medium",
    timeEstimate: "2 weeks setup + monthly",
  },
  {
    id: "service-7",
    name: "E-commerce Setup",
    status: "inactive",
    price: 1999,
    category: "development",
    description: "Complete e-commerce website setup with payment processing and inventory management.",
    popularity: "medium",
    timeEstimate: "1-2 months",
  },
  {
    id: "service-8",
    name: "PPC Advertising",
    status: "active",
    price: 699,
    category: "marketing",
    description: "Pay-per-click advertising campaign setup and management.",
    popularity: "high",
    timeEstimate: "Monthly",
  },
]

// Categories for filtering
const categories = [
  { value: "all", label: "All Categories" },
  { value: "design", label: "Design" },
  { value: "development", label: "Development" },
  { value: "marketing", label: "Marketing" },
  { value: "content", label: "Content" },
]

export function ServicesManagement() {
  const [services, setServices] = useState(initialServices)
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddingService, setIsAddingService] = useState(false)
  const [newService, setNewService] = useState({
    id: "",
    name: "",
    status: "active",
    price: 0,
    category: "",
    description: "",
    popularity: "medium",
    timeEstimate: "",
  })
  const [editingService, setEditingService] = useState<IService | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)

  const newServiceInputRef = useRef<HTMLInputElement>(null)
  const expandedServiceRef = useRef<HTMLDivElement>(null)

  // Filter services based on search term, category, and status
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter
    const matchesStatus = statusFilter === "all" || service.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Handle service expansion
  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServiceId(expandedServiceId === serviceId ? null : serviceId)
  }

  // Handle adding a new service
  const handleAddService = () => {
    setIsAddingService(true)
    setTimeout(() => {
      newServiceInputRef.current?.focus()
    }, 100)
  }

  // Handle saving a new service
  const handleSaveNewService = () => {
    if (newService.name.trim() === "") return

    const serviceId = `service-${Date.now()}`
    const serviceToAdd = {
      ...newService,
      id: serviceId,
    }

    setServices([serviceToAdd, ...services])
    setNewService({
      id: "",
      name: "",
      status: "active",
      price: 0,
      category: "",
      description: "",
      popularity: "medium",
      timeEstimate: "",
    })
    setIsAddingService(false)
  }

  // Handle canceling adding a new service
  const handleCancelAddService = () => {
    setIsAddingService(false)
    setNewService({
      id: "",
      name: "",
      status: "active",
      price: 0,
      category: "",
      description: "",
      popularity: "medium",
      timeEstimate: "",
    })
  }

  // Handle editing a service
  const handleEditService = (service: IService) => {
    setEditingService({ ...service })
    setExpandedServiceId(service.id)
  }

  // Handle saving edited service
  const handleSaveEditedService = () => {
    if (!editingService) return

    setServices(services.map((service) => (service.id === editingService.id ? editingService : service)))
    setEditingService(null)
  }

  // Handle canceling editing
  const handleCancelEdit = () => {
    setEditingService(null)
  }

  // Handle toggling service status
  const handleToggleStatus = (serviceId: string) => {
    setServices(
      services.map((service) =>
        service.id === serviceId
          ? { ...service, status: service.status === "active" ? "inactive" : "active" }
          : service,
      ),
    )
  }

  // Handle deleting a service
  const handleDeleteService = (serviceId: string) => {
    setServiceToDelete(serviceId)
    setDeleteConfirmOpen(true)
  }

  // Confirm delete service
  const confirmDeleteService = () => {
    if (!serviceToDelete) return

    setServices(services.filter((service) => service.id !== serviceToDelete))
    setDeleteConfirmOpen(false)
    setServiceToDelete(null)
    if (expandedServiceId === serviceToDelete) {
      setExpandedServiceId(null)
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "design":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "development":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "marketing":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "content":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  // Get popularity icon
  const getPopularityIcon = (popularity: string) => {
    switch (popularity) {
      case "high":
        return <Star className="h-4 w-4 text-amber-500" />
      case "medium":
        return <Star className="h-4 w-4 text-gray-400" />
      case "low":
        return <Star className="h-4 w-4 text-gray-300" />
      default:
        return null
    }
  }

  // Scroll to expanded service
  useEffect(() => {
    if (expandedServiceId && expandedServiceRef.current) {
      setTimeout(() => {
        expandedServiceRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }, 100)
    }
  }, [expandedServiceId])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Services</h1>
          <Button onClick={handleAddService} className="rounded-full h-10 px-4 bg-primary hover:bg-primary/90">
            <Plus className="h-5 w-5 mr-1" />
            <span>Add Service</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* New Service Input (when adding) */}
        <AnimatePresence>
          {isAddingService && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border rounded-lg p-4 bg-background shadow-sm">
                <h3 className="text-lg font-medium mb-3">Add New Service</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-service-name">Service Name</Label>
                      <Input
                        id="new-service-name"
                        ref={newServiceInputRef}
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        placeholder="Enter service name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-service-price">Price ($)</Label>
                      <Input
                        id="new-service-price"
                        type="number"
                        value={newService.price || ""}
                        onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-service-category">Category</Label>
                      <Select
                        value={newService.category}
                        onValueChange={(value) => setNewService({ ...newService, category: value })}
                      >
                        <SelectTrigger id="new-service-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="content">Content</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-service-time">Time Estimate</Label>
                      <Input
                        id="new-service-time"
                        value={newService.timeEstimate}
                        onChange={(e) => setNewService({ ...newService, timeEstimate: e.target.value })}
                        placeholder="e.g. 2-3 weeks"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-service-description">Description</Label>
                    <Textarea
                      id="new-service-description"
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      placeholder="Describe the service..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label htmlFor="new-service-status" className="flex items-center space-x-2 cursor-pointer">
                      <Switch
                        id="new-service-status"
                        checked={newService.status === "active"}
                        onCheckedChange={(checked) =>
                          setNewService({ ...newService, status: checked ? "active" : "inactive" })
                        }
                      />
                      <span>Active</span>
                    </Label>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" onClick={handleCancelAddService}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveNewService}>Save Service</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Services List */}
        <div className="space-y-3 mt-2">
          {filteredServices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No services found. Try adjusting your filters or add a new service.
              </p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <div key={service.id} className="relative">
                {/* Service Pill */}
                <motion.div
                  layout
                  className={`
                    border rounded-full px-4 py-2.5 flex items-center justify-between
                    cursor-pointer transition-colors hover:bg-muted/50
                    ${service.status === "inactive" ? "opacity-60" : ""}
                    ${expandedServiceId === service.id ? "rounded-b-none border-b-0" : ""}
                  `}
                  onClick={() => toggleServiceExpansion(service.id)}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div
                      className={`w-2 h-2 rounded-full ${service.status === "active" ? "bg-green-500" : "bg-gray-400"}`}
                    />
                    <span className="font-medium truncate">{service.name}</span>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getPopularityIcon(service.popularity)}
                    <div className="flex items-center text-sm font-medium">
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                      {service.price.toLocaleString()}
                    </div>
                    {expandedServiceId === service.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </motion.div>

                {/* Expanded Service Details */}
                <AnimatePresence>
                  {expandedServiceId === service.id && (
                    <motion.div
                      ref={expandedServiceRef}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border border-t-0 rounded-b-lg px-4 py-3 bg-background"
                    >
                      {editingService && editingService.id === service.id ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-service-name">Service Name</Label>
                              <Input
                                id="edit-service-name"
                                value={editingService.name}
                                onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-service-price">Price ($)</Label>
                              <Input
                                id="edit-service-price"
                                type="number"
                                value={editingService.price}
                                onChange={(e) =>
                                  setEditingService({ ...editingService, price: Number(e.target.value) })
                                }
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-service-category">Category</Label>
                              <Select
                                value={editingService.category}
                                onValueChange={(value) => setEditingService({ ...editingService, category: value })}
                              >
                                <SelectTrigger id="edit-service-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="design">Design</SelectItem>
                                  <SelectItem value="development">Development</SelectItem>
                                  <SelectItem value="marketing">Marketing</SelectItem>
                                  <SelectItem value="content">Content</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-service-time">Time Estimate</Label>
                              <Input
                                id="edit-service-time"
                                value={editingService.timeEstimate}
                                onChange={(e) => setEditingService({ ...editingService, timeEstimate: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-service-description">Description</Label>
                            <Textarea
                              id="edit-service-description"
                              value={editingService.description}
                              onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-service-popularity">Popularity</Label>
                            <Select
                              value={editingService.popularity}
                              onValueChange={(value) => setEditingService({ ...editingService, popularity: value })}
                            >
                              <SelectTrigger id="edit-service-popularity">
                                <SelectValue placeholder="Select popularity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Label htmlFor="edit-service-status" className="flex items-center space-x-2 cursor-pointer">
                              <Switch
                                id="edit-service-status"
                                checked={editingService.status === "active"}
                                onCheckedChange={(checked) =>
                                  setEditingService({ ...editingService, status: checked ? "active" : "inactive" })
                                }
                              />
                              <span>Active</span>
                            </Label>
                          </div>

                          <div className="flex justify-end space-x-2 pt-2">
                            <Button variant="outline" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveEditedService}>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">{service.description}</p>

                          <div className="flex flex-wrap gap-3">
                            <Badge variant="outline" className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {service.timeEstimate}
                            </Badge>
                            <Badge variant="outline" className="flex items-center">
                              <Tag className="h-3.5 w-3.5 mr-1" />
                              {service.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`flex items-center ${service.status === "active" ? "border-green-500 text-green-600" : "border-gray-400 text-gray-500"}`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full mr-1.5 ${service.status === "active" ? "bg-green-500" : "bg-gray-400"}`}
                              />
                              {service.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          </div>

                          <div className="flex justify-end space-x-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleToggleStatus(service.id)}>
                              {service.status === "active" ? (
                                <>
                                  <X className="h-4 w-4 mr-1" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                            <Button size="sm" onClick={() => handleEditService(service)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button (visible on mobile) */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Button onClick={handleAddService} className="h-12 w-12 rounded-full p-0 shadow-lg">
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Service</span>
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteService}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

