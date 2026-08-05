import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Sayfa yolu" className="border-b border-gray-100 bg-white">
      <ol className="container mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 text-xs text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li className="flex min-w-0 items-center gap-2" key={`${item.label}-${index}`}>
              {index > 0 ? <ChevronRight aria-hidden="true" size={12} /> : null}
              {item.href && !isLast ? (
                <Link className="truncate transition-colors hover:text-primary" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="truncate font-semibold text-secondary">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
