"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Search } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import axios from "axios";
import { Button } from "./ui/button";
import EditableBadgeButton from "./edit-tags";
import GoogleLoader from "./google-loader";

dotenv.config();

// Example of pre-filled data for editing

export function BusinessesTable() {
  const auth = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [businesses, setBusinesses] = useState<BusinessFormValues[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState<"name" | "website" | "location">(
    "name"
  );
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

  const handleReport = (business: BusinessFormValues) => {
    window.open(
      `/reports/?account_id=${
        JSON.parse(localStorage.getItem("user") || "").user.userId || ""
      }&location_id=${business.locationId}`,
      "_blank"
    );
  };

  // Sort businesss based on sort field and direction
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    const aValue = a[sortField]?.toLowerCase();
    const bValue = b[sortField]?.toLowerCase();

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

  useEffect(() => {
    const userId = auth?.user?.user?.userId;
    if (!userId) return;

    const storedBusinesses = localStorage.getItem(`businesses_${userId}`);

    if (storedBusinesses) {
      setBusinesses(JSON.parse(storedBusinesses));
    } else {
      setLoading(true);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations?user_id=${userId}`
        )
        .then((response) => {
          const formattedBusinesses = response.data?.locations?.map(
            // // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (business: BusinessFormValues) => ({
              name: business.name,
              location: business.location,
              locationId: business.locationId,
              country: business.country,
              website: business.website,
              cid: business.cid,
              imagePrompt: business.imagePrompt,
              isAdded: false,
            })
          );
          setBusinesses(formattedBusinesses);
          localStorage.setItem(
            `businesses_${userId}`,
            JSON.stringify(formattedBusinesses)
          );
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [auth?.user?.user?.userId]);

  return (
    <>
      {loading ? (
        <GoogleLoader />
      ) : (
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
                    <TableHead>Tags</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Audits</TableHead>
                    <TableHead>Reports</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBusinesses.length > 0 ? (
                    sortedBusinesses.map((business, index) => (
                      <TableRow key={`${business.locationId}-${index}`}>
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
                        <TableCell className="font-medium">
                          {business?.country}
                        </TableCell>
                        <TableCell>
                          <EditableBadgeButton />
                        </TableCell>
                        <TableCell
                          onClick={() => {
                            setBusinesses((prevBusinesses) => {
                              const updatedBusinesses = prevBusinesses.map(
                                (b) =>
                                  b.locationId === business.locationId
                                    ? { ...b, isAdded: true }
                                    : b
                              );

                              // Guardar en localStorage
                              const userId = auth?.user?.user?.userId;
                              if (userId) {
                                localStorage.setItem(
                                  `businesses_${userId}`,
                                  JSON.stringify(updatedBusinesses)
                                );
                              }

                              return updatedBusinesses;
                            });
                          }}
                        >
                          <BusinessFormDialog
                            variant="outline"
                            element={{
                              name: "business.name",
                              location: "business.location",
                              country: "business.country",
                              locationId: "business.locationId",
                              price: 25,
                              phones: [{ number: "business.phones" }],
                              services: [{ name: "business.services" }],
                              keywords: [{ text: "business.keywords" }],
                              targetLocations: [
                                { name: "business.targetLocations" },
                              ],
                              tags: [{ name: "business.tags" }],
                              website: "https://business.website",
                              coordinates: {
                                latitude: "business.coordinates?.latitude",
                                longitude: "business.coordinates?.longitude",
                              },
                              cid: "business.cid",
                              imagePrompt: "business.imagePrompt",
                              isAdded: false,
                            }}
                            onSave={handleSaveBusiness}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            className="border-destructive text-destructive hover:bg-destructive"
                          >
                            Start
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            className="border-secondary text-secondary hover:bg-secondary"
                            onClick={() => handleReport(business)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No businesses found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
