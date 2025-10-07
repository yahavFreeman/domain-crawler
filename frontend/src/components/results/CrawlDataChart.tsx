import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CustomTooltip } from "./utils/CustomTooltip";
import type { CrawlResult } from "../../store/crawl/crawlSlice";

export function CrawlDataGraph({ data }: { data: CrawlResult[] }) {
  const chartData = [
    {
      category: "Streaming & Ads",
      count: data.filter((d) => d.streaming_detected && d.google_ads_detected).length,
      domains: data.filter((d) => d.streaming_detected && d.google_ads_detected).map((d) => d.domain),
    },
    {
      category: "Streaming Only",
      count: data.filter((d) => d.streaming_detected && !d.google_ads_detected).length,
      domains: data.filter((d) => d.streaming_detected && !d.google_ads_detected).map((d) => d.domain),
    },
    {
      category: "Ads Only",
      count: data.filter((d) => !d.streaming_detected && d.google_ads_detected).length,
      domains: data.filter((d) => !d.streaming_detected && d.google_ads_detected).map((d) => d.domain),
    },
    {
      category: "Could Not Crawl",
      count: data.filter((d) => d.errors?.length > 0 && d.pages_checked === 0).length,
      domains: data.filter((d) => d.errors?.length > 0 && d.pages_checked === 0).map((d) => d.domain),
    },
  ];

  const colors = ["#60a5fa", "#34d399", "#fbbf24", "#f87171"];


  return (
    <div className="xl:flex-1 w-full h-108 bg-white shadow rounded-xl pt-2 pb-8">
      {/* Main chart title */}
      <h3 className="font-semibold text-center mb-4">
        Number of Domains per Detection Category
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 40 }}  barCategoryGap="20%">
          
<XAxis
  dataKey="category"
  interval={0}
  tickMargin={10}
  tick={({ x, y, payload }) => {
const words = payload.value.match(/.{1,10}(\s|$)/g); // wrap every ~10 chars
    return (
      <text x={x} y={y + 10} textAnchor="middle" fill="#374151" fontSize={12}>
        {words.map((word, index) => (
          <tspan
            key={index}
            x={x}
            dy={index === 0 ? 0 : 14} // space between lines
          >
            {word}
          </tspan>
        ))}
      </text>
    );
  }}
  label={{
    value: "Crawl Category",
    position: "insideBottom",
    offset: -24,
    fill: "#374151",
    fontSize: 14,
  }}
/>
          <YAxis
            allowDecimals={false}
            label={{
              value: "Number of Domains",
              angle: -90,
              position: "centerLeft",
              offset: -2,
              fill: "#374151",
              fontSize: 14,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={65} >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
