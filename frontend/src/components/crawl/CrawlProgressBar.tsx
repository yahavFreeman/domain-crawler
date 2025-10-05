export const CrawlProgressBar = ({
  pagesChecked,
  totalPages,
}: {
  pagesChecked: number;
  totalPages: number;
}) => {
  return (
    <div style={{ width: "100%", background: "#eee", borderRadius: "8px" }}>
      <div
        style={{
          width: `${(pagesChecked / totalPages) * 100}%`,
          background: "#28a745",
          height: "10px",
          borderRadius: "8px",
          transition: "width 0.5s ease",
        }}
      ></div>
    </div>
  );
};
