import Link from "next/link";

const categories = [
  {
    href: "/dog-runs",
    label: "ドッグラン",
    icon: "🏃",
  },
  {
    href: "/cafes",
    label: "カフェ",
    icon: "☕",
  },
  {
    href: "/clinics",
    label: "病院",
    icon: "🏥",
  },
  {
    href: "/stays",
    label: "宿",
    icon: "🏨",
  },
];

export function CategoryNav() {
  return (
    <nav className="bg-white py-6 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-center gap-8 sm:gap-12">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="flex flex-col items-center gap-2 group transition hover:opacity-70"
            >
              <span className="text-3xl sm:text-4xl">{category.icon}</span>
              <span className="text-sm sm:text-base font-medium text-[#4A5844]">
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
