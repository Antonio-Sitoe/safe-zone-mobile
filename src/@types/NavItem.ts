import type { LucideIcon } from "lucide-react-native";

export interface NavItem {
	icon: LucideIcon;
	label: string;
	active?: boolean;
	route?: string;
}
