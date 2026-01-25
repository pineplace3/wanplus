import Image from "next/image";
import Link from "next/link";
import { Badge } from "./Badge";

interface InfoCardProps {
  href: string;
  title: string;
  description: string;
  image: string;
  tags?: { label: string; tone?: "primary" | "muted" | "success" | "warning" }[];
  meta?: string;
}

export function InfoCard({
  href,
  title,
  description,
  image,
  tags = [],
  meta,
}: InfoCardProps) {
  return (
    <Link
      href={href}
      className="group card block h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-xl rounded-xl"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {tags.length > 0 ? (
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.label} tone={tag.tone ?? "primary"}>
                {tag.label}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex h-full flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold text-[#2D2D2D]">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        {meta ? (
          <p className="text-xs font-medium text-[#4A5844]">{meta}</p>
        ) : null}
      </div>
    </Link>
  );
}
