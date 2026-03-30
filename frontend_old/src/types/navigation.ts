import { primaryNav } from "@/assets/content/shared/navigation";

export type PrimaryNavConfig = typeof primaryNav;
export type PrimaryNavItem = PrimaryNavConfig[number];
export type PrimaryNavChild = PrimaryNavItem["children"][number];
