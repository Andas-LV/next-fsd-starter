import {
	QueryClient,
	defaultShouldDehydrateQuery,
	isServer,
} from "@tanstack/react-query";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// При SSR ставим staleTime > 0, чтобы клиент сразу не перезапрашивал данные
				staleTime: 60 * 1000,
				refetchOnWindowFocus: false,
				retry: 1,
			},
			dehydrate: {
				// Передаём на клиент и pending-запросы (стриминг через Suspense)
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) ||
					query.state.status === "pending",
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

/**
 * На сервере — новый клиент на каждый запрос,
 * в браузере — один синглтон на всё приложение.
 */
export function getQueryClient() {
	if (isServer) {
		return makeQueryClient();
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}
