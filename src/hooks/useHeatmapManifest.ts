import { useEffect, useState } from "react";

export const useHeatmapManifest = () => {
  const [manifest, setManifest] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    fetch("/heatmaps/heatmaps-manifest.json")
      .then((res) => res.json())
      .then(setManifest)
      .catch((err) => {
        console.error("Failed to load heatmap manifest:", err);
        setManifest({});
      });
  }, []);

  return manifest;
};
