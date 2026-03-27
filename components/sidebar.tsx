"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Box,
  Eye,
  Workflow,
  Network,
  MapPin,
  Shuffle,
  Cog,
  Radio,
  Zap,
  Combine,
} from "lucide-react";
import { useState } from "react";

interface SidebarSection {
  title: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: "Core Concepts",
    items: [
      { href: "/concepts/pcontainer", label: "pContainer", icon: Box },
      { href: "/concepts/pview", label: "pView", icon: Eye },
      { href: "/concepts/paragraph", label: "PARAGRAPH", icon: Workflow },
      { href: "/concepts/location", label: "Location", icon: MapPin },
    ],
  },
  {
    title: "Patterns & Skeletons",
    items: [
      { href: "/concepts/skeleton", label: "Skeletons", icon: Cog },
      { href: "/concepts/composition", label: "Composition", icon: Combine },
      { href: "/concepts/algorithm", label: "Algorithms", icon: Zap },
    ],
  },
  {
    title: "Communication",
    items: [
      { href: "/concepts/distribution", label: "Distribution", icon: Shuffle },
      { href: "/concepts/rmi", label: "RMI", icon: Radio },
      { href: "/concepts/workfunction", label: "Work Functions", icon: Network },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(
    sidebarSections.map((s) => s.title)
  );

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  // Only show sidebar on concept pages
  const showSidebar = pathname.startsWith("/concepts") || pathname === "/memory-model";

  if (!showSidebar) return null;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card/50 lg:block">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        <div className="space-y-4">
          {sidebarSections.map((section) => {
            const isExpanded = expandedSections.includes(section.title);

            return (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  {section.title}
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-1 space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick reference */}
        <div className="mt-8 rounded-lg border border-border bg-card p-4">
          <h4 className="text-sm font-semibold text-foreground">Quick Reference</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            STAPL provides parallel versions of STL abstractions for distributed computing.
          </p>
          <Link
            href="/cpp-mapping"
            className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
          >
            View C++ to STAPL mapping
          </Link>
        </div>
      </div>
    </aside>
  );
}
