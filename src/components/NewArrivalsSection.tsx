"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "./Badge";

interface NewArrivalsSectionProps {
  title: string;
  href: string;
  items: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    badges?: Array<{ label: string; tone?: "primary" | "muted" | "success" | "warning" }>;
    address?: { prefecture: string; city: string };
  }>;
}

export function NewArrivalsSection({ title, href, items }: NewArrivalsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold text-[#2D2D2D]">{title}</h2>
        <Link
          href={href}
          className="text-base font-semibold text-[#4A5844] transition hover:text-[#B56952] hover:underline"
        >
          もっと見る →
        </Link>
      </div>
      <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div className="flex gap-6" style={{ width: "max-content" }}>
          {items.map((item) => (
            <Link
              key={item.id}
              href={`${href}/${item.id}`}
              className="group flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl w-80 sm:w-96"
            >
              <div className="relative h-56 sm:h-64 w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 320px, 384px"
                />
                {item.badges && item.badges.length > 0 ? (
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {item.badges.map((badge, idx) => (
                      <Badge key={idx} tone={badge.tone ?? "primary"}>
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col gap-3 p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#2D2D2D] line-clamp-1">{item.name}</h3>
                <p className="text-sm sm:text-base text-gray-700 line-clamp-2 leading-relaxed">{item.description}</p>
                {item.address ? (
                  <p className="text-sm text-gray-600 font-medium">
                    {item.address.prefecture} {item.address.city}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
