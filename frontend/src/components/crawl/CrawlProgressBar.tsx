export const CrawlProgressBar = ({
  pagesChecked,
  totalPages,
}: {
  pagesChecked: number;
  totalPages: number;
}) => {
  const progress = totalPages ? (pagesChecked / totalPages) * 100 : 0;

  return (
    <div className="flex justify-center w-full">
      <div className="w-2/5 bg-gray-400 rounded-lg overflow-hidden">
        <div
          className="bg-green-600 h-2 rounded-lg transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
