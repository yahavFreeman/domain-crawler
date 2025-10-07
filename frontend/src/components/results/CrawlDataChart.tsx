import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CustomTooltip } from "./utils/CustomTooltip";

export function CrawlDataGraph({ data }) {
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

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="xl:flex-1 w-full h-108 bg-white shadow rounded-xl p-2 pb-6">
      {/* Main chart title */}
      <h3 className="text-center mb-4">
        Number of Domains per Detection Category
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          
          <XAxis
            dataKey="category"
            label={{
              value: "Crawl Category",
              position: "insideBottom",
              offset: -12,
              fill: "#374151",
              fontSize: 14,
            }}
          />
          <YAxis
            allowDecimals={false}
            label={{
              value: "Number of Domains",
              angle: -90,
              position: "insideLeft",
              fill: "#374151",
              fontSize: 14,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
