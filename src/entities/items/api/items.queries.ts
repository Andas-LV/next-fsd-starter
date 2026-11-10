import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { createItem, fetchItemById, fetchItems } from "./items.service";

export const itemsKeys = {
	all: ["items"] as const,
	lists: () => [...itemsKeys.all, "list"] as const,
	detail: (id: string) => [...itemsKeys.all, "detail", id] as const,
};

// queryOptions можно переиспользовать и в хуках, и для prefetch на сервере
export const itemsQueries = {
	list: () =>
		queryOptions({
			queryKey: itemsKeys.lists(),
			queryFn: fetchItems,
		}),
	detail: (id: string) =>
		queryOptions({
			queryKey: itemsKeys.detail(id),
			queryFn: () => fetchItemById(id),
			enabled: Boolean(id),
		}),
};

export function useItems() {
	return useQuery(itemsQueries.list());
}

export function useItem(id: string) {
	return useQuery(itemsQueries.detail(id));
}

export function useCreateItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createItem,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: itemsKeys.lists() }),
	});
}
