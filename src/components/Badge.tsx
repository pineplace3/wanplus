type Tone = "primary" | "muted" | "success" | "warning";

const toneClass: Record<Tone, string> = {
  primary: "bg-[#D1D1CA] text-[#2D2D2D] border-[#D1D1CA]",
  muted: "bg-gray-100 text-gray-700 border-gray-200",
  success: "bg-[#4A5844] text-white border-[#4A5844]",
  warning: "bg-[#B56952] text-white border-[#B56952]",
};

export function Badge({
  children,
  tone = "primary",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
