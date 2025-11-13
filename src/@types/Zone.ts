export interface Zone {
	id: string;
	slug: string;
	date: string;
	hour: string;
	description: string;
	type: "SAFE" | "DANGER";
	reports?: number;
	coordinates: {
		latitude: number;
		longitude: number;
	};
	featureDetails: {
		goodLighting?: boolean;
		policePresence?: boolean;
		publicTransport?: boolean;
		insufficientLighting?: boolean;
		lackOfPolicing?: boolean;
		abandonedHouses?: boolean;
	};
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateZoneSchema {
	slug: string;
	date: string;
	hour: string;
	description: string;
	type: "SAFE" | "DANGER";
	coordinates: {
		latitude: number;
		longitude: number;
	};
	geom: {
		x: number;
		y: number;
	};
	featureDetails: {
		goodLighting?: boolean;
		policePresence?: boolean;
		publicTransport?: boolean;
		insufficientLighting?: boolean;
		lackOfPolicing?: boolean;
		abandonedHouses?: boolean;
	};
}

export interface ZoneResponse {
	success: boolean;
	message: string;
	data: Zone[];
}

export interface CreateZoneResponse {
	success: boolean;
	message: string;
	data: Zone;
}
