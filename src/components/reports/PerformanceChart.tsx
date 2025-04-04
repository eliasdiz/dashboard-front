import React, { useMemo } from "react";
import { Chart } from "react-google-charts";

interface DailyMetrics {
  WEBSITE_CLICKS?: number;
  CALL_CLICKS?: number;
  BUSINESS_DIRECTION_REQUESTS?: number;
}

interface PerformanceDataKey {
  [date: string]: DailyMetrics;
}

interface PerformanceChartsProps {
  performanceData: PerformanceDataKey;
  insightsSummary?: string;
  performanceDataPastMonth: PerformanceDataKey;
  insightsSummaryPastMonth?: string;
  charts?: Array<{ type: "website" | "call" | "directions"; title: string }>;
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  performanceData,
  insightsSummary,
  performanceDataPastMonth,
  charts = [
    { type: "interactions", title: "Overall" },
    { type: "website", title: "Website Clicks" },
    { type: "call", title: "Call Clicks" },
    { type: "directions", title: "Directions Requests" },
  ],
}) => {
  const dates = useMemo(
    () =>
      Object.keys(performanceData).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      ),
    [performanceData]
  );
  const pastMonthDates = useMemo(
    () =>
      Object.keys(performanceDataPastMonth).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      ),
    [performanceDataPastMonth]
  );

  const calculateTotals = (data: PerformanceDataKey, dateList: string[]) => ({
    websiteClicks: dateList.reduce(
      (sum, date) => sum + (data[date]?.WEBSITE_CLICKS || 0),
      0
    ),
    callClicks: dateList.reduce(
      (sum, date) => sum + (data[date]?.CALL_CLICKS || 0),
      0
    ),
    directionRequests: dateList.reduce(
      (sum, date) => sum + (data[date]?.BUSINESS_DIRECTION_REQUESTS || 0),
      0
    ),
    interactionTotal: dateList.reduce((sum, date) => {
      const {
        WEBSITE_CLICKS = 0,
        CALL_CLICKS = 0,
        BUSINESS_DIRECTION_REQUESTS = 0,
      } = data[date] || {};
      return sum + WEBSITE_CLICKS + CALL_CLICKS + BUSINESS_DIRECTION_REQUESTS;
    }, 0),
  });

  const totals = calculateTotals(performanceData, dates);
  const pastTotals = calculateTotals(performanceDataPastMonth, pastMonthDates);

  const notes = useMemo(
    () =>
      insightsSummary
        ?.split("\n")
        .filter((note) => note.trim().length > 0)
        .slice(2) || [],
    [insightsSummary]
  );

  const getChartOptions = (title: string, color = "#4285F4") => ({
    title,
    hAxis: { title: "Date", showTextEvery: 1 },
    vAxis: { minValue: 0 },
    curveType: "function",
    legend: { position: "none" },
    series: { 0: { color, lineWidth: 2 } },
  });
  
  const prepareChartDataSingleMonth = (
    data: PerformanceDataKey,
    dateList: string[],
    type: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any[][] => {
    let dataKey: keyof DailyMetrics;
    switch (type) {
      case "website":
        dataKey = "WEBSITE_CLICKS";
        break;
      case "call":
        dataKey = "CALL_CLICKS";
        break;
      case "directions":
        dataKey = "BUSINESS_DIRECTION_REQUESTS";
        break;
      case "interactions":
        return [
          ["Date", "Interactions"],
          ...dateList.map((date) => [
            new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            (data[date]?.WEBSITE_CLICKS || 0) +
              (data[date]?.CALL_CLICKS || 0) +
              (data[date]?.BUSINESS_DIRECTION_REQUESTS || 0),
          ]),
        ];
      default:
        throw new Error("Invalid chart type");
    }

    return [
      ["Date", type],
      ...dateList.map((date) => [
        new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        data[date]?.[dataKey] || 0,
      ]),
    ];
  };

  return (
    <div className="flex flex-col items-center">
      {/* Totales Comparativos */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8 w-full px-4">
        {[
          {
            label: "Total Interactions",
            past: pastTotals.interactionTotal,
            current: totals.interactionTotal,
            color: "#FBBC05",
          },
          {
            label: "Website Clicks",
            past: pastTotals.websiteClicks,
            current: totals.websiteClicks,
            color: "#34A853",
          },
          {
            label: "Call Clicks",
            past: pastTotals.callClicks,
            current: totals.callClicks,
            color: "#EA4335",
          },
          {
            label: "Directions Requests",
            past: pastTotals.directionRequests,
            current: totals.directionRequests,
            color: "#4285F4",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 shadow-md px-4 py-3 text-center rounded-lg"
          >
            <div className="text-sm sm:text-base text-gray-500">
              {item.label}
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-600">
              <span className="text-gray-400">{item.past}</span> →{" "}
              <span style={{ color: item.color }}>{item.current}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos Comparativos */}
      <>
        <div className="grid gap-12 w-full px-4">
          {charts.map((chart, index) => (
            <div key={chart.type} className="w-full mb-8">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
                {/* Mes pasado */}
                <div key={`${chart.type}-past`}>
                  <Chart
                    chartType="LineChart"
                    width="100%"
                    height="350px"
                    data={prepareChartDataSingleMonth(
                      performanceDataPastMonth,
                      pastMonthDates,
                      chart.type
                    )}
                    options={getChartOptions(
                      `${chart.title} - Last Month`,
                      "#A0A0A0"
                    )}
                  />
                </div>

                {/* Mes actual */}
                <div key={`${chart.type}-current`}>
                  <Chart
                    chartType="LineChart"
                    width="100%"
                    height="350px"
                    data={prepareChartDataSingleMonth(
                      performanceData,
                      dates,
                      chart.type
                    )}
                    options={getChartOptions(
                      `${chart.title} - This Month`,
                      "#4285F4"
                    )}
                  />
                </div>
              </div>
              {notes[index] && (
                <div className="mt-2 p-4 text-lg md:w-[80%] mx-auto bg-gray-100 border-l-4 border-blue-500 text-gray-700 italic rounded shadow-md">
                  💡 <span className="font-medium">This Month:</span>{" "}
                  {notes[index]}
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    </div>
  );
};

export default PerformanceCharts;
