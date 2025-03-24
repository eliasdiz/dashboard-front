"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink, MoreHorizontal, Search } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data - we'll expand the provided single entry
const sampleLocations = [
  {
    name: "locations/910490211122741230",
    title: "All Seasons Roofing & Restoration",
    websiteUri: "http://myallseasonsnebraska.com/"
  },
  {
    name: "locations/823456789012345678",
    title: "Sunshine Home Services",
    websiteUri: "http://sunshinehomeservices.com/"
  },
  {
    name: "locations/734567890123456789",
    title: "Metro Plumbing Solutions",
    websiteUri: "http://metroplumbingsolutions.com/"
  },
  {
    name: "locations/645678901234567890",
    title: "Green Valley Landscaping",
    websiteUri: "http://greenvalleylandscaping.com/"
  },
  {
    name: "locations/556789012345678901",
    title: "Elite Electrical Contractors",
    websiteUri: "http://eliteelectricalcontractors.com/"
  },
  {
    name: "locations/467890123456789012",
    title: "Precision Painting Pros",
    websiteUri: "http://precisionpaintingpros.com/"
  },
  {
    name: "locations/378901234567890123",
    title: "Comfort Heating & Cooling",
    websiteUri: "http://comfortheatingcooling.com/"
  }
]

export function LocationsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<"title" | "websiteUri">("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filter locations based on search term
  const filteredLocations = sampleLocations.filter(location => 
    location.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.websiteUri.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort locations based on sort field and direction
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    const aValue = a[sortField].toLowerCase()
    const bValue = b[sortField].toLowerCase()
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Handle sort click
  const handleSort = (field: "title" | "websiteUri") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Extract location ID from the name string
  const getLocationId = (name: string) => {
    return name.split('/')[1]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Locations</CardTitle>
        <CardDescription>Manage your business locations and websites</CardDescription>
        <div className="flex items-center mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search locations..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="ml-4 bg-[#f5870e] hover:bg-[#f5870e]/90 text-white">
            Add Location
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">ID</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    Business Name
                    {sortField === "title" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("websiteUri")}
                >
                  <div className="flex items-center">
                    Website
                    {sortField === "websiteUri" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLocations.length > 0 ? (
                sortedLocations.map((location) => (
                  <TableRow key={location.name}>
                    <TableCell className="font-medium">{getLocationId(location.name)}</TableCell>
                    <TableCell>{location.title}</TableCell>
                    <TableCell>
                      <a 
                        href={location.websiteUri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-[#f58c0d] hover:text-[#f5870e] hover:underline"
                      >
                        {location.websiteUri.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit location</DropdownMenuItem>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete location</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No locations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
