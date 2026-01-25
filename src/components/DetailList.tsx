export function DetailList({
  items,
}: {
  items: { label: string; value?: string | string[] | null }[];
}) {
  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => {
        if (!item.value) return null;
        const value = Array.isArray(item.value)
          ? item.value.join(" / ")
          : item.value;
        return (
          <div
            key={item.label}
            className="rounded-lg border border-gray-200 bg-white/70 px-4 py-3"
          >
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4A5844]">
              {item.label}
            </dt>
            <dd className="text-sm text-[#2D2D2D]">{value}</dd>
          </div>
        );
      })}
    </dl>
  );
}
