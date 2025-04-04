"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import type Chart from "chart.js/auto";
import PerformanceChart from "./PerformanceChart";
import GoogleReviewCard from "./GoogleReviewCard";
import ReactMarkdown from "react-markdown";
import { Star } from "lucide-react";
import { PerformanceData } from "@/types/types";
import GoogleLoader from "../google-loader";
import Heatmap from "./Heatmap";
import { useSearchParams } from "next/navigation";
import { useHeatmapManifest } from "@/hooks/useHeatmapManifest";

type Reviewer = {
  displayName: string;
  profilePhotoUrl: string;
};

type Review = {
  createTime: string;
  rating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  reviewText: string;
  reviewer: Reviewer;
};

interface BusinessDetails {
  doc_id: string;
  gmb_details: GmbDetails;
  location: string;
  location_id: string;
  name: string;
  phone: string;
  services: string[];
  social_tags: string[];
  target_locations: string[];
  website: string;
}

interface GmbDetails {
  address: string;
  description: string;
  location_id: string;
  phones: string;
  placeId: string;
  title: string;
  websiteUri: string;
}

interface Post {
  createTime: string;
  summary: string;
  searchUrl: string;
  googleUrl: string;
}

interface SheetData {
  [key: string]: string | number;
}

interface Keyword {
  searchKeyword: string;
  value: string;
}

interface ApiResponse {
  posts: Post[];
  sheetData: SheetData[];
  keywords: Keyword[];
  performance: PerformanceData;
  performancePastMonth: PerformanceData;
  businessDetails: BusinessDetails;
  reviews: {
    positive_reviews_count: number;
    total_reviews_count: number;
    reviews: Review[];
  };
  businessInsightsSummary: string;
  businessInsightsSummaryPastMonth: string;
}

interface QueryParams {
  account_id: string;
  location_id: string;
  start_month: number;
  start_year: number;
  end_month: number;
  end_year: number;
}

const GoogleMyBusinessDashboard: React.FC = () => {
  // State for storing fetched data
  const [posts, setPosts] = useState<Post[]>([]);
  const [sheetData, setSheetData] = useState<SheetData[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [location_id, setLocationId] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [performance, setPerformance] = useState<any>({
    WEBSITE_CLICKS: {},
    CALL_CLICKS: {},
    BUSINESS_CONVERSATIONS: {},
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [performancePastMonth] = useState<any>({
    WEBSITE_CLICKS: {},
    CALL_CLICKS: {},
    BUSINESS_CONVERSATIONS: {},
  });
  const [insightsSummary, setInsightsSummary] = useState<string | null>(null);
  const [insightsSummaryPastMonth] = useState<
    string | null
  >(null);
  const [businessDetails, setBusinessDetails] =
    useState<BusinessDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Chart instances refs for cleanup
  const chartInstances = useRef<Chart[]>([]);
  const query = useSearchParams()
  const services = businessDetails?.services || [];

  const manifest = useHeatmapManifest();
  const heatmapFile = useMemo(
    () => manifest?.[location_id],
    [manifest, location_id]
  );

  // API configuration
  const API_URL = "https://gs45rpq0-5010.use2.devtunnels.ms/fetch-data";

  const randomServiceMap = useMemo(() => {
    const cacheKey = `post_service_map_${query.get("account_id")}_${query.get(
      "location_id"
    )}`;
    const stored = localStorage.getItem(cacheKey);
    const existingMap: Record<string, string> = stored
      ? JSON.parse(stored)
      : {};

    const updatedMap = { ...existingMap };

    posts.forEach((post) => {
      const key = post.createTime;
      if (!updatedMap[key]) {
        if (services.length > 0) {
          const randomService =
            services[Math.floor(Math.random() * services.length)];
          updatedMap[key] = randomService;
        } else {
          updatedMap[key] = "N/A";
        }
      }
    });

    localStorage.setItem(cacheKey, JSON.stringify(updatedMap));

    return posts.map((post) => updatedMap[post.createTime] || "N/A");
  }, [posts, services, query])

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const params: QueryParams = {
        account_id: query.get("account_id") || "116395807109318287954",
        location_id: query.get("location_id") || "10374497510417847507",
        start_month: 2,
        start_year: 2025,
        end_month: 3,
        end_year: 2025,
      };

      setLocationId(params.location_id);

      const cacheKey = `gmb_data_${params.account_id}_${params.location_id}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        setPosts(parsed.posts || []);
        setSheetData(parsed.sheetData || []);
        setPerformance(parsed.performance || {});
        setKeywords(parsed.keywords || []);
        setReviews(parsed.reviews?.reviews || []);
        // setPositive(parsed.reviews?.positive_reviews_count || 0);
        setInsightsSummary(parsed.businessInsightsSummary || null);
        setBusinessDetails(parsed.businessDetails || null);
        setLoading(false);
        return;
      }

      console.log(sheetData)

      try {
        const queryString = new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, v.toString()])
        ).toString();

        const response = await fetch(`${API_URL}?${queryString}`);

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        // Save to localStorage
        localStorage.setItem(cacheKey, JSON.stringify(data));

        // Update state
        setPosts(data.posts || []);
        setSheetData(data.sheetData || []);
        setPerformance(
          data.performance || {
            WEBSITE_CLICKS: {},
            CALL_CLICKS: {},
            BUSINESS_CONVERSATIONS: {},
          }
        );
        setKeywords(data.keywords || []);
        setReviews(data.reviews.reviews || []);
        // setPositive(data.reviews.positive_reviews_count || 0);
        setInsightsSummary(data.businessInsightsSummary || null);
        setBusinessDetails(data.businessDetails || null);

        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to destroy charts when component unmounts
    return () => {
      chartInstances.current.forEach((chart) => {
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, [query]);

  // Effect to create charts after data is loaded
  useEffect(() => {
    if (!loading && !error) {
      // Clean up existing charts first
      chartInstances.current.forEach((chart) => {
        if (chart) {
          chart.destroy();
        }
      });
      chartInstances.current = [];
    }
  }, [loading, error, performance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-white">
        <GoogleLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-white">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg border border-red-200">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-50">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h2 className="mb-4 text-xl font-semibold text-center text-gray-800">
            Error Loading Data
          </h2>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  // Helper function to create decorative triangles
  const DecorativeTriangles = () => (
    <>
      {/* Top left triangles */}
      <div className="mb-1 absolute z-1 top-0 left-0 w-0 h-0 border-r-[150px] border-t-[150px] border-solid border-transparent border-t-[#EA4335]" />
      <div className="mb-1 absolute top-12 left-0 w-0 h-0 border-r-[90px] border-t-[200px] border-solid border-transparent border-t-[#FBBC05] " />
      <div className="mb-1 absolute top-0 left-0 w-0 h-0 border-r-[300px] border-t-[90px] border-solid border-transparent border-t-[#4285F4]" />

      {/* Top right triangles */}
      <div className="mb-1 absolute z-1 top-0 right-0 w-0 h-0 border-l-[150px] border-t-[150px] border-solid border-transparent border-t-[#4285F4]" />
      <div className="mb-1 absolute top-12 right-0 w-0 h-0 border-l-[90px] border-t-[200px] border-solid border-transparent border-t-[#EA4335] " />
      <div className="mb-1 absolute top-0 right-0 w-0 h-0 border-l-[300px] border-t-[90px] border-solid border-transparent border-t-[#34A853]" />

      {/* Bottom right triangles */}
      <div className="mb-1 absolute z-1 bottom-0 right-0 w-0 h-0 border-l-[150px] border-b-[150px] border-solid border-transparent border-b-[#FBBC05]" />
      <div className="mb-1 absolute bottom-12 right-0 w-0 h-0 border-l-[90px] border-b-[200px] border-solid border-transparent border-b-[#34A853] " />
      <div className="mb-1 absolute bottom-0 right-0 w-0 h-0 border-l-[300px] border-b-[95px] border-solid border-transparent border-b-[#4285F4]" />

      {/* Bottom left triangles */}
      <div className="mb-1 absolute z-1 bottom-0 left-0 w-0 h-0 border-r-[150px] border-b-[150px] border-solid border-transparent border-b-[#34A853]" />
      <div className="mb-1 absolute bottom-12 left-0 w-0 h-0 border-r-[90px] border-b-[200px] border-solid border-transparent border-b-[#4285F4] " />
      <div className="mb-1 absolute bottom-0 left-0 w-0 h-0 border-r-[300px] border-b-[95px] border-solid border-transparent border-b-[#FBBC05]" />
    </>
  );

  return (
    <div className="bg-white">
      {/* Business Profile Section */}
      <section className="relative min-h-screen w-full px-4 md:px-8 md:py-16 py-[15rem] overflow-hidden">
        <DecorativeTriangles />

        {businessDetails && (
          <div className="flex flex-col gap-8 max-w-4xl mx-auto pt-16 md:pt-24">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-[#34A853] text-center md:text-left">
                GMB REPORT
              </h1>

              <div className="space-y-3 md:space-y-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  {businessDetails.name}
                </h2>

                <a
                  href={businessDetails.gmb_details.websiteUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg md:text-xl text-blue-500 hover:text-blue-700 transition-colors inline-block"
                >
                  {businessDetails.gmb_details.websiteUri}
                </a>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill="#facc15"
                      stroke="#facc15"
                      className="text-yellow-400"
                    />
                  ))}
                  <span className="ml-2 text-gray-600">({reviews.length})</span>
                </div>

                <div className="space-y-2 text-gray-700">
                  <p className="text-lg flex items-start">
                    {businessDetails.gmb_details.address && <svg
                      className="w-5 h-5 mr-2 mt-1 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>}
                    {businessDetails.gmb_details.address}
                  </p>
                  {businessDetails.gmb_details.phones && <p className="text-lg flex items-start">
                    <svg
                      className="w-5 h-5 mr-2 mt-1 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                    {businessDetails.gmb_details.phones}
                  </p>}
                </div>
              </div>
            </div>

            <div className="z-10 mt-8 p-6 bg-gray-50 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Business Description
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {businessDetails.gmb_details.description}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Introduction Section */}
      <section className="relative min-h-screen w-full px-4 md:px-8 md:py-16 py-[15rem] flex flex-col justify-center items-center overflow-hidden">
        <DecorativeTriangles />

        <div className="max-w-4xl mx-auto pt-16 md:pt-24 z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-[#34A853] text-center mb-12">
            GMB AI REPORT
          </h1>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <p className="text-xl text-gray-700 leading-relaxed">
              We present the GMB Monthly Report for{" "}
              <strong>{businessDetails && businessDetails.name}</strong> in
              Google business, covering the performance and progress made during
              the past month. This comprehensive overview highlights the various
              strategies and efforts to enhance Google store visibility and
              local search rankings, ultimately driving organic traffic and
              attracting potential customers.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      {posts.length > 0 && (<section className="relative min-h-screen w-full px-4 md:px-8 md:py-16 py-[15rem] overflow-hidden">
        <DecorativeTriangles />

        <div className="max-w-6xl mx-auto pt-16 md:pt-24 z-10">
          <div className="bg-[#EA4335] px-6 py-5 rounded-lg shadow-lg mb-12">
            <h2 className="text-3xl md:text-4xl text-white font-bold text-center">
              Posts
            </h2>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#EA4335] text-white">
                  <th className="px-6 py-4 text-lg font-semibold">Date</th>
                  <th className="px-6 py-4 text-lg font-semibold">Post URL</th>
                  <th className="px-6 py-4 text-lg font-semibold">
                    Target Keyword
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700">
                      {post.createTime}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={post.searchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition-colors flex items-center"
                      >
                        <span>Link URL</span>
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          ></path>
                        </svg>
                      </a>
                    </td>              
                    <td className="px-6 py-4 text-gray-700">
                      {businessDetails?.services[index] || randomServiceMap[index]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>)}

      {/* Post Preview Section */}
      {posts.length > 0 && (<section className="relative min-h-screen w-full px-4 md:px-8 md:py-16 py-[15rem] overflow-hidden">
        <DecorativeTriangles />

        <div className="max-w-6xl mx-auto pt-16 md:pt-24 z-10">
          <div className="bg-[#4285F4] px-6 py-5 rounded-lg shadow-lg mb-12">
            <h2 className="text-3xl md:text-4xl text-white font-bold text-center">
              Post Preview
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post, index) => (
              <div
                key={index}
                className="bg-white z-10 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
              >
                {post.googleUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={post.googleUrl || "/placeholder.svg"}
                    alt="Post image"
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
                <div className="p-6 z-10 bg-white">
                  <span className="text-gray-700 leading-relaxed">
                    {post.summary.split("\n").map((line, i) => (
                      <p key={i} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>)}

      {/* Heatmaps Section */}
      {heatmapFile && <section className="relative min-h-screen w-full px-4 md:px-8 md:py-16 py-[15rem] overflow-hidden">
        <DecorativeTriangles />

        <div className="mx-auto pt-16 md:pt-24 z-10">
          <div className="max-w-6xl mx-auto bg-[#FBBC05] px-6 py-5 rounded-lg shadow-lg mb-12">
            <h2 className="text-3xl md:text-4xl text-white font-bold text-center">
              Heatmaps
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-lg text-gray-700 mb-8 text-center">
              This heatmap is a combination of user interactions with your
              Google Business Profile
            </p>

            <div className="rounded-xl overflow-hidden shadow-lg">
              <Heatmap locationId={location_id} file={heatmapFile} />
            </div>
          </div>
        </div>
      </section>}

      {/* Citations Section */}
      {sheetData.length > 0 && (
        <section className="relative min-h-screen w-full px-4 md:px-8 md:py-16 py-[15rem] overflow-hidden">
          <DecorativeTriangles />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 z-10">
            {/* Header */}
            <div className="bg-[#34A853] px-6 py-5 rounded-lg shadow-lg mb-8 text-center">
              <h2 className="text-3xl md:text-4xl text-white font-bold">
                Citations
              </h2>
            </div>

            {/* Responsive Table */}
            <div className="overflow-auto rounded-xl shadow-lg bg-white">
              <table className="w-full min-w-max border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#34A853] text-white">
                    <th className="px-6 py-4 text-lg font-semibold text-left">
                      Website
                    </th>
                    <th className="px-6 py-4 text-lg font-semibold text-left">
                      Link
                    </th>
                    <th className="px-6 py-4 text-lg font-semibold text-left">
                      Status
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-200">
                  {sheetData
                    .slice()
                    .sort((a, b) =>
                      String(a["Top Domains"] || "").localeCompare(
                        String(b["Top Domains"] || "")
                      )
                    )
                    .map((data, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-700 break-words">
                          {data["Top Domains"]}
                        </td>
                        <td className="px-6 py-4 break-words">
                          <a
                            href={
                              typeof data["Created Live Links"] === "string"
                                ? data["Created Live Links"]
                                : undefined
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                          >
                            <span className="truncate max-w-[180px] md:max-w-[250px]">
                              {typeof data["Created Live Links"] === "string"
                                ? new URL(data["Created Live Links"]).hostname
                                : ""}
                            </span>
                            <svg
                              className="w-5 h-5 ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </td>
                        <td
                          className={`px-6 py-4 font-medium ${
                            data["Status"] === "Live"
                              ? "text-green-600"
                              : data["Status"] === "Pending"
                              ? "text-yellow-500"
                              : "text-gray-500"
                          }`}
                        >
                          {data["Status"]}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Keywords Section */}
      {keywords.length > 0 && (
        <section className="relative min-h-screen w-full px-4 md:px-8 md:py-16 py-[15rem] overflow-hidden">
          <DecorativeTriangles />

          <div className="max-w-6xl mx-auto pt-16 md:pt-24 z-10">
            <div className="bg-[#EA4335] px-6 py-5 rounded-lg shadow-lg mb-12">
              <h2 className="text-3xl md:text-4xl text-white font-bold text-center">
                Keywords
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-4/6 max-w-6xl mx-auto">
              {services.map((data, index) => (
                <div
                  key={index}
                  className="bg-white p-4 shadow-md rounded-lg border border-gray-200"
                >
                  <p className="text-lg font-semibold text-gray-800">{data}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Performance Charts Section */}
      <section className="relative min-h-screen w-full px-4 md:px-8 md:py-16 py-[15rem] overflow-hidden">
        <DecorativeTriangles />

        <div className="max-w-6xl mx-auto pt-16 md:pt-24 z-10">
          <div className="bg-[#4285F4] px-6 py-5 rounded-lg shadow-lg mb-12">
            <h2 className="text-3xl md:text-4xl text-white font-bold text-center">
              Performance Charts
            </h2>
          </div>

          <div className="p-6 rounded-xl shadow-lg z-10">
            <PerformanceChart
              performanceData={performance}
              insightsSummary={insightsSummary ?? undefined}
              performanceDataPastMonth={performancePastMonth}
              insightsSummaryPastMonth={insightsSummaryPastMonth ?? undefined}
            />
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {reviews.length > 0 && (
      <section className="relative min-h-screen w-full px-4 md:px-8 md:py-16 py-[15rem] overflow-hidden">
        <DecorativeTriangles />

        <div className="mx-auto pt-16 md:pt-24 z-10">
          <div className="bg-[#FBBC05] px-6 py-5 rounded-lg shadow-lg mb-12 max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-white font-bold text-center">
              Reviews
            </h2>
          </div>

          <div className="w-full mx-auto relative">
            <div className="overflow-hidden">
                {reviews.slice(0, 4).map((review, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 mb-10 md:w-4/6 max-w-6xl mx-auto"
                  >
                    <GoogleReviewCard key={index} review={review} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* AI Report Section */}
      {insightsSummary && (
      <section className="relative min-h-screen w-full px-4 md:px-8 md:py-16 py-[15rem] overflow-hidden">
        <DecorativeTriangles />

        <div className="max-w-6xl mx-auto pt-16 md:pt-24 z-10">
          <div className="bg-[#34A853] px-6 py-5 rounded-lg shadow-lg mb-12">
            <h2 className="text-3xl md:text-4xl text-white font-bold text-center">
              AI REPORT
            </h2>
          </div>

          
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg">
              <div className="prose prose-lg max-w-none text-gray-700">
                <ReactMarkdown>{insightsSummary}</ReactMarkdown>
              </div>
            </div>
        </div>
      </section>
      )}

      {/* Thank You Section */}
      <section className="relative min-h-screen w-full px-4 md:px-8 md:py-16 py-[15rem] flex items-center justify-center overflow-hidden">
        <DecorativeTriangles />

        <div className="z-10 text-center">
          <h1 className="text-6xl md:text-9xl font-bold bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] bg-clip-text text-transparent">
            THANK YOU!
          </h1>
          <p className="mt-6 text-xl text-gray-700">
            For your continued partnership
          </p>
        </div>
      </section>
    </div>
  );
};

export default GoogleMyBusinessDashboard;
