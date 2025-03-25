"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MoreHorizontal,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sample data - we'll expand the provided single entry
const sampleBusinesses = [
  {
    name: "businesss/910490211122741230",
    title: "All Seasons Roofing & Restoration",
    tag: "Roofing",
    websiteUri: "http://myallseasonsnebraska.com/",
  },
  {
    name: "businesss/823456789012345678",
    title: "Sunshine Home Services",
    tag: "Roofing",
    websiteUri: "http://sunshinehomeservices.com/",
  },
  {
    name: "businesss/734567890123456789",
    title: "Metro Plumbing Solutions",
    tag: "Roofing",
    websiteUri: "http://metroplumbingsolutions.com/",
  },
  {
    name: "businesss/645678901234567890",
    title: "Green Valley Landscaping",
    tag: "Travel",
    websiteUri: "http://greenvalleylandscaping.com/",
  },
  {
    name: "businesss/556789012345678901",
    title: "Elite Electrical Contractors",
    tag: "Travel",
    websiteUri: "http://eliteelectricalcontractors.com/",
  },
  {
    name: "businesss/467890123456789012",
    title: "Precision Painting Pros",
    tag: "Roofing",
    websiteUri: "http://precisionpaintingpros.com/",
  },
  {
    name: "businesss/378901234567890123",
    title: "Comfort Heating & Cooling",
    tag: "Roofing",
    websiteUri: "http://comfortheatingcooling.com/",
  },
];

export function BusinessesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"title" | "websiteUri">("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter businesss based on search term
  const filteredBusinesses = sampleBusinesses.filter(
    (business) =>
      business.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.websiteUri.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort businesss based on sort field and direction
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    const aValue = a[sortField].toLowerCase();
    const bValue = b[sortField].toLowerCase();

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Handle sort click
  const handleSort = (field: "title" | "websiteUri") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Extract business ID from the name string
  const getBusinessId = (name: string) => {
    return name.split("/")[1];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Businesses Locations</CardTitle>
        <CardDescription>
          Manage your business locations and websites
        </CardDescription>
        <div className="flex items-center mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search businesses..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="ml-4 bg-primary hover:bg-primary/90 text-white">
            Add Business
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">ID</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    Business Name
                    {sortField === "title" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("websiteUri")}
                >
                  <div className="flex items-center">
                    Website
                    {sortField === "websiteUri" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="">Tag</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBusinesses.length > 0 ? (
                sortedBusinesses.map((business) => (
                  <TableRow key={business.name}>
                    <TableCell className="font-medium">
                      {getBusinessId(business.name)}
                    </TableCell>
                    <TableCell>{business.title}</TableCell>
                    <TableCell>
                      <a
                        href={business.websiteUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:text-primary hover:underline"
                      >
                        {business.websiteUri
                          .replace(/(^\w+:|^)\/\//, "")
                          .replace(/\/$/, "")}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${business.tag[0] == 'T' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                        {business.tag}
                      </Badge>
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
                          <DropdownMenuItem>Edit business</DropdownMenuItem>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete business
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No businesses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
