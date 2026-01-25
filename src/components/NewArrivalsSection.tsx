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
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#2D2D2D]">{title}</h2>
        <Link
          href={href}
          className="text-sm font-semibold text-[#4A5844] transition hover:text-[#3a4636] hover:underline"
        >
          もっと見る →
        </Link>
      </div>
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-4" style={{ width: "max-content" }}>
          {items.map((item) => (
            <Link
              key={item.id}
              href={`${href}/${item.id}`}
              className="group flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl w-72"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 288px, 288px"
                />
                {item.badges && item.badges.length > 0 ? (
                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    {item.badges.map((badge, idx) => (
                      <Badge key={idx} tone={badge.tone ?? "primary"}>
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 p-4">
                <h3 className="text-base font-semibold text-[#2D2D2D] line-clamp-1">{item.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                {item.address ? (
                  <p className="text-xs text-gray-500">
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
