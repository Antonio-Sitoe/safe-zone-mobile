export type Coordinates = [number, number];

export type ZoneType = "SAFE" | "DANGER" | "CRITICAL";

export type Zone = {
	slug: string;
	date?: string;
	hour?: string;
	description?: string;
	type: ZoneType;
	reports?: number;
	coordinates: {
		latitude: number;
		longitude: number;
	};
	geom?: {
		x: number;
		y: number;
	};
	createdBy?: string;
	id?: string;
};
