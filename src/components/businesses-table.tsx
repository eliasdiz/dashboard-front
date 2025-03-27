"use client";
import { useEffect, useState } from "react";
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
import {
  BusinessFormDialog,
  BusinessFormValues,
} from "@/components/business-form-dialog";
import dotenv from "dotenv";
import { useUser } from "@/context/UserContext";
import { Switch } from "@/components/ui/switch";
import axios from "axios";

dotenv.config();

// interface IBusiness {
//   locations: {
//     location: string;
//     locationId: string;
//     name: string;
//     website: string;
//     tag: string;
//   }[]
// }

export interface ILocations {
  location: string;
  locationId: string;
  name: string;
  website: string;
  tag: boolean
}

// Example of pre-filled data for editing
const existingBusiness: BusinessFormValues = {
  name: "Acme Corporation",
  location: "123 Main St, Anytown, USA",
  phones: [{ number: "+1 (555) 123-4567" }],
  services: [{ name: "Web Development" }, { name: "Digital Marketing" }],
  keywords: [{ text: "web design" }, { text: "digital marketing" }],
  targetLocations: [{ name: "Anytown" }, { name: "Nearby City" }],
  website: "https://acme-example.com",
  coordinates: {
    latitude: "40.7128",
    longitude: "-74.0060",
  },
  cid: "12345678901234567890",
  imagePrompt: "A modern office building with the Acme logo",
};

// Sample data - we'll expand the provided single entry
const sampleBusinesses: ILocations[] = [
  {
    location: "United States Of America",
    locationId: "910490211122741230",
    name: "All Seasons Roofing & Restoration",
    tag: false,
    website: "http://myallseasonsnebraska.com/"
  },
  {
    location: "United States Of America",
    locationId: "823456789012345678",
    name: "Sunshine Home Services",
    tag: false,
    website: "http://sunshinehomeservices.com/"
  },
  {
    location: "United States Of America",
    locationId: "734567890123456789",
    name: "Metro Plumbing Solutions",
    tag: false,
    website: "http://metroplumbingsolutions.com/"
  },
  {
    location: "United States Of America",
    locationId: "645678901234567890",
    name: "Green Valley Landscaping",
    tag: false,
    website: "http://greenvalleylandscaping.com/",
  },
  {
    location: "Colombia",
    locationId: "556789012345678901",
    name: "Elite Electrical Contractors",
    tag: false,
    website: "http://eliteelectricalcontractors.com/"
  },
  {
    location: "Colombia",
    locationId: "467890123456789012",
    name: "Precision Painting Pros",
    tag: false,
    website: "http://precisionpaintingpros.com/"
  },
  {
    location: "Perú",
    locationId: "378901234567890123",
    name: "Comfort Heating & Cooling",
    tag: false,
    website: "http://comfortheatingcooling.com/"
  },
];

export function BusinessesTable() {
  const context = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [businesses, setBusinesses] = useState<ILocations[] | []>(sampleBusinesses);
  const [sortField, setSortField] = useState<
    "name" | "website" | "location"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Example of handling the save event
  const handleSaveBusiness = (data: BusinessFormValues) => {
    console.log("Business data saved:", data);
    // In a real app, you would send this data to your backend
  };

  // Filter businesss based on search term
  const filteredBusinesses = businesses.filter(
    (business) =>
      business.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      business.website?.toLowerCase().includes(searchTerm?.toLowerCase())
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
  const handleSort = (field: "name" | "website" | "location") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleTagChange = (locationId: string, checked: boolean) => {
    setBusinesses((prevBusinesses) =>
      prevBusinesses.map((business) =>
        business.locationId === locationId
          ? { ...business, tag: checked }
          : business
      )
    );
  };

  useEffect(() => {
    try {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/locations?user_id=${context?.user?.user.userId}`)
      .then(response => setBusinesses(response.data.locations))
      .catch((err) => console.error(err))
    } catch (err) {
      console.error(err)
    }
  }, [context?.user?.user?.userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Businesses Locations</CardTitle>
        <CardDescription>
          Manage your business locations and websites
        </CardDescription>
        <div className="flex items-center mt-4  gap-2">
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Location ID</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("location")}
                >
                  <div className="flex items-center">
                    Location
                    {sortField === "location" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Business Name
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("website")}
                >
                  <div className="flex items-center">
                    Website
                    {sortField === "website" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Add
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBusinesses.length > 0 ? (
                sortedBusinesses.map((business) => (
                  <TableRow key={business.locationId}>
                    <TableCell className="font-medium">
                      {business.locationId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {business.location}
                    </TableCell>
                    <TableCell>{business.name.slice(0, 30)}</TableCell>
                    <TableCell>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:text-primary hover:underline"
                      >
                        {business.website
                          ?.replace(/(^\w+:|^)\/\//, "")
                          ?.replace(/\/$/, "")
                          .slice(0, 30)}
                        ...
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={!!business.tag}
                        onCheckedChange={(checked: boolean) =>
                          handleTagChange(business.locationId, checked)
                        }
                      />
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
                          <BusinessFormDialog
                            variant="ghost"
                            onSave={handleSaveBusiness}
                          />
                          <DropdownMenuSeparator />
                          <BusinessFormDialog
                            variant="ghost"
                            business={existingBusiness}
                            onSave={handleSaveBusiness}
                          />
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
