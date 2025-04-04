import React, { useState, useEffect } from "react";

interface HeatmapViewerProps {
  locationId: string;
}

const HeatmapViewer: React.FC<HeatmapViewerProps> = ({ locationId }) => {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  useEffect(() => {
    //   const heatmapPath = `/assets/heatmaps/${locationId}/0cfcb1f5-0efe-4bdb-baac-9831311fe7d8.html.html`;
    const testPath = `/heatmaps/75349521046262081/0cfcb1f5-0efe-4bdb-baac-9831311fe7d8.html`;

    fetch(testPath, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setIframeSrc(testPath);
        } else {
          console.warn("Heatmap not found");
          setIframeSrc(null);
        }
      })
      .catch((err) => {
        console.error("Error checking heatmap file:", err);
        setIframeSrc(null);
      });
  }, [locationId]);

  if (!iframeSrc) {
    return (
      <div className="text-center text-gray-600">
        No heatmap available for this location.
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] border rounded shadow overflow-hidden">
      <iframe
        title="Heatmap Viewer"
        src={iframeSrc}
        className="w-full h-full"
      />
    </div>
  );
};

export default HeatmapViewer;
