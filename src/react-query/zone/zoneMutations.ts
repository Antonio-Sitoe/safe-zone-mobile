import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateZoneSchema } from "@/@types/Zone";
import { createZone } from "@/actions/zone";

export const useCreateZoneMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateZoneSchema) => createZone(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["zones"] });
		},
		onError: (error) => {
			console.error("Error creating zone:", error);
		},
	});
};
