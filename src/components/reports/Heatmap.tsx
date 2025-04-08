interface HeatmapViewerProps {
  location_id: string;
  file: string;
}

const Heatmap: React.FC<HeatmapViewerProps> = ({ location_id, file }) => {
  const src = `/heatmaps/${location_id}/${file}`;

  return (
    <div className="w-full h-[1000px] border rounded shadow overflow-hidden mx-auto mb-20 z-index-100">
      <iframe title="Heatmap Viewer" src={src} className="w-full h-full" />
    </div>
  );
};

export default Heatmap;