import React, { useMemo } from "react";
import { Chart } from "react-google-charts";

interface DailyMetrics {
  WEBSITE_CLICKS?: number;
  CALL_CLICKS?: number;
  BUSINESS_DIRECTION_REQUESTS?: number;
}

interface PerformanceData {
  [date: string]: DailyMetrics;
}

interface PerformanceChartsProps {
  performanceData: PerformanceData;
  charts?: Array<{
    type: "website" | "call" | "directions";
    title: string;
  }>;
  insightsSummary?: string;
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  performanceData,
  insightsSummary,
  charts = [
    { type: "interactions", title: "Overall " },
    { type: "website", title: "Website Clicks" },
    { type: "call", title: "Call Clicks" },
    { type: "directions", title: "Directions Requests" },
  ],
}) => {
  // Extract and sort dates
  const dates = useMemo(() => {
    return Object.keys(performanceData).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  }, [performanceData]);

  const notes = useMemo(() => {
    return (
      insightsSummary
        ?.split("\n")
        .filter((note) => note.trim().length > 0)
        .slice(2) || []
    );
  }, [insightsSummary]);

  // Calculate totals for each metric
  const totals = useMemo(() => {
    return {
      websiteClicks: dates.reduce(
        (sum, date) => sum + (performanceData[date].WEBSITE_CLICKS || 0),
        0
      ),
      callClicks: dates.reduce(
        (sum, date) => sum + (performanceData[date].CALL_CLICKS || 0),
        0
      ),
      directionRequests: dates.reduce(
        (sum, date) =>
          sum + (performanceData[date].BUSINESS_DIRECTION_REQUESTS || 0),
        0
      ),
      interactionTotal: dates.reduce((sum, date) => {
        const {
          WEBSITE_CLICKS = 0,
          CALL_CLICKS = 0,
          BUSINESS_DIRECTION_REQUESTS = 0,
        } = performanceData[date];
        return sum + WEBSITE_CLICKS + CALL_CLICKS + BUSINESS_DIRECTION_REQUESTS;
      }, 0),
    };
  }, [performanceData, dates]);

  // Prepare chart data for different metrics
  const prepareChartData = (type: string) => {
    const headers: string[] = ["Date"];
    let dataKey: keyof DailyMetrics;

    switch (type) {
      case "website":
        headers.push("Website Clicks");
        dataKey = "WEBSITE_CLICKS";
        return [
          headers,
          ...dates.map((date) => [
            new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            performanceData[date][dataKey] || 0,
          ]),
        ];
      case "call":
        headers.push("Call Clicks");
        dataKey = "CALL_CLICKS";
        return [
          headers,
          ...dates.map((date) => [
            new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            performanceData[date][dataKey] || 0,
          ]),
        ];
      case "directions":
        headers.push("Directions Requests");
        dataKey = "BUSINESS_DIRECTION_REQUESTS";
        return [
          headers,
          ...dates.map((date) => [
            new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            performanceData[date][dataKey] || 0,
          ]),
        ];
      case "interactions":
        headers.push("Total Interactions");
        return [
          headers,
          ...dates.map((date) => {
            const {
              WEBSITE_CLICKS = 0,
              CALL_CLICKS = 0,
              BUSINESS_DIRECTION_REQUESTS = 0,
            } = performanceData[date];
            const total =
              WEBSITE_CLICKS + CALL_CLICKS + BUSINESS_DIRECTION_REQUESTS;
            return [
              new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              total,
            ];
          }),
        ];
      default:
        throw new Error("Invalid chart type");
    }
  };

  // Color mapping for different chart types
  const getChartColor = (type: string) => {
    switch (type) {
      case "website":
        return "#4285F4";
      case "call":
        return "#EA4335";
      case "directions":
        return "#34A853";
      case "interactions":
        return "#FBBC05";
      default:
        return "#000000";
    }
  };

  // Common chart options
  const getChartOptions = (title: string, type: string) => ({
    title: title,
    hAxis: {
      title: "Date",
      gridlines: { color: "transparent" },
      showTextEvery: Math.max(1, Math.floor(dates.length / 7)),
    },
    vAxis: {
      gridlines: { color: "transparent" },
    },
    curveType: "none",
    pointSize: 5,
    colors: [getChartColor(type)],
    explorer: { actions: ["dragToZoom", "rightClickToReset"] },
    legend: { position: "bottom" },
    series: { 0: { lineWidth: 2 } },
  });
  return (
    <div className="flex flex-col items-center">
      {/* Totals Section */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="bg-[#4285F4] border border-[#4285F4] text-white shadow-md shadow-gray-400 px-4 py-3 text-center rounded-lg">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{totals.interactionTotal}</div>
          <div className="text-sm sm:text-base">Total Interactions</div>
        </div>
        <div className="bg-[#34A853] border border-[#34A853] text-white shadow-md shadow-gray-400 px-4 py-3 text-center rounded-lg">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{totals.websiteClicks}</div>
          <div className="text-sm sm:text-base">Website Clicks</div>
        </div>
        <div className="bg-[#EA4335] border border-[#EA4335] text-white shadow-md shadow-gray-400 px-4 py-3 text-center rounded-lg">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{totals.callClicks}</div>
          <div className="text-sm sm:text-base">GBP CALLS</div>
        </div>
        <div className="bg-[#FBBC05] border border-[#FBBC05] text-black shadow-md shadow-gray-400 px-4 py-3 text-center rounded-lg">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{totals.directionRequests}</div>
          <div className="text-sm sm:text-base">Directions Requests</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-[1rem] items-center justify-center mb-12 px-4 w-full">
        {charts.map((chart, index) => (
          <div key={index} className="w-full flex flex-col justify-center max-w-4xl mb-8">
            <div className="w-full mx-auto">
              <Chart
                chartType="LineChart"
                width="100%"
                height="auto"
                className="min-h-[300px] md:min-h-[400px] lg:min-h-[500px]"
                data={prepareChartData(chart.type)}
                options={getChartOptions(chart.title, chart.type)}
              />
            </div>
            {notes[index] && (
              <div className="w-full my-4 p-4 bg-gray-100 border-l-4 border-blue-400 text-gray-700 text-base md:text-lg italic rounded shadow-md">
                💬 <span className="font-medium">Note:</span> {notes[index]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceCharts;
