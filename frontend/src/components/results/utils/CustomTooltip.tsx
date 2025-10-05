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
        <p>Count: {count}</p>
        <p className="text-xs mt-2 break-words">
          {domains.length > 0 ? domains.join(", ") : "No domains"}
        </p>
      </div>
    );
  }
  return null;
};
