// src/config/nav.ts
import {
  Gauge,
  Crosshair,
  Undo2,
  DownloadCloud,
  ListChecks,
  BadgeCheck,
  UserCog,
  Shield,
  ScrollText,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface NavEntry {
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  groupLabel: string;
  items: NavEntry[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: "Live desk",
    items: [
      { label: "Dashboard", icon: Gauge },
      { label: "Execution Desk", icon: Crosshair },
      { label: "Recovery Desk", icon: Undo2 },
    ],
  },
  {
    groupLabel: "Setup",
    items: [
      { label: "Provider Import", icon: DownloadCloud },
      { label: "Imported Arbs", icon: ListChecks },
      { label: "Bookmaker Profiles", icon: BadgeCheck },
      { label: "Provider Profiles", icon: UserCog },
      { label: "Proxies", icon: Shield },
    ],
  },
  {
    groupLabel: "General",
    items: [
      { label: "Ledger", icon: ScrollText },
      { label: "Settings", icon: Settings },
    ],
  },
];

// Flat label -> icon lookup, derived once from NAV_GROUPS.
// Any future notification source just references a label — icon is never re-specified.
export const NAV_ICON_BY_LABEL: Record<string, LucideIcon> = Object.fromEntries(
  NAV_GROUPS.flatMap((group) =>
    group.items.map((item) => [item.label, item.icon]),
  ),
);

// Derived union of every valid nav label, for type-safety on notification.source
export type NavLabel = (typeof NAV_GROUPS)[number]["items"][number]["label"];
