import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateZoneSchema } from "@/@types/Zone";
import { createZone, updateZone, deleteZone } from "@/actions/zone";

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

export const useUpdateZoneMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<CreateZoneSchema> }) =>
			updateZone(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["zones"] });
		},
		onError: (error) => {
			console.error("Error updating zone:", error);
		},
	});
};

export const useDeleteZoneMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteZone(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["zones"] });
		},
		onError: (error) => {
			console.error("Error deleting zone:", error);
		},
	});
};
