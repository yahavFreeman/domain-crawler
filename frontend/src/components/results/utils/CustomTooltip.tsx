interface CustomPayload {
  category: string;
  count: number;
  domains: string[];
}

export const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: CustomPayload }[] }) => {
  if (active && payload && payload.length) {
    const { category, count, domains } = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded border max-w-xs">
        <p className="font-bold">{category}</p>
        <p>Domains found: {count}</p>
<p className="mt-2 break-words">
  Domains: <span className="text-sm">
    {domains.slice(0, 5).join(", ")}
  {domains.length > 5 ? `, and ${domains.length - 5} more` : ""}
    </span>
</p>
      </div>
    );
  }
  return null;
};
