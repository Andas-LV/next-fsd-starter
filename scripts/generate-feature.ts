import { program } from "commander";
import * as fs from "fs-extra";
import * as path from "path";

// Утилиты для преобразований имен
const toCamel = (str: string) =>
	str.replace(/[-_ ]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase());

const toPascal = (str: string) => {
	const camel = toCamel(str);
	return camel.charAt(0).toUpperCase() + camel.slice(1);
};

// Общая структура файлов и шаблоны
const fileConfigs = (camel: string, pascal: string) => [
	{
		dir: "",
		name: "index.ts",
		content: `export {
	${camel}Keys,
	${camel}Queries,
	use${pascal}List,
	use${pascal},
	useCreate${pascal},
} from "./api/${camel}.queries";
export {
	fetch${pascal}List,
	fetch${pascal}ById,
	create${pascal},
} from "./api/${camel}.service";
export type { I${pascal} } from "./model/types";`,
	},
	{
		dir: "api",
		name: `${camel}.service.ts`,
		content: `import axiosInstance from "@/shared/api/axiosInstance";
import type { I${pascal} } from "../model/types";

export async function fetch${pascal}List(): Promise<I${pascal}[]> {
	const { data } = await axiosInstance.get<I${pascal}[]>("/${camel}");
	return data;
}

export async function fetch${pascal}ById(id: string): Promise<I${pascal}> {
	const { data } = await axiosInstance.get<I${pascal}>(\`/${camel}/\${id}\`);
	return data;
}

export async function create${pascal}(
	payload: Omit<I${pascal}, "id">,
): Promise<I${pascal}> {
	const { data } = await axiosInstance.post<I${pascal}>("/${camel}", payload);
	return data;
}`,
	},
	{
		dir: "api",
		name: `${camel}.queries.ts`,
		content: `import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	create${pascal},
	fetch${pascal}ById,
	fetch${pascal}List,
} from "./${camel}.service";

export const ${camel}Keys = {
	all: ["${camel}"] as const,
	lists: () => [...${camel}Keys.all, "list"] as const,
	detail: (id: string) => [...${camel}Keys.all, "detail", id] as const,
};

export const ${camel}Queries = {
	list: () =>
		queryOptions({
			queryKey: ${camel}Keys.lists(),
			queryFn: fetch${pascal}List,
		}),
	detail: (id: string) =>
		queryOptions({
			queryKey: ${camel}Keys.detail(id),
			queryFn: () => fetch${pascal}ById(id),
			enabled: Boolean(id),
		}),
};

export function use${pascal}List() {
	return useQuery(${camel}Queries.list());
}

export function use${pascal}(id: string) {
	return useQuery(${camel}Queries.detail(id));
}

export function useCreate${pascal}() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: create${pascal},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ${camel}Keys.lists() }),
	});
}`,
	},
	{
		dir: "model",
		name: "types.ts",
		content: `export interface I${pascal} {
	id: string;
	// TODO: добавьте поля для ${pascal}
}`,
	},
];

async function generateFeature(featureName: string) {
	const camel = toCamel(featureName);
	const pascal = toPascal(featureName);
	const baseDir = path.join("src", "features", camel);

	for (const { dir, name, content } of fileConfigs(camel, pascal)) {
		const dirPath = path.join(baseDir, dir);
		await fs.ensureDir(dirPath);
		await fs.writeFile(path.join(dirPath, name), content.trim() + "\n");
	}

	console.log(`✅ Feature "${featureName}" создана в ${baseDir}`);
}

program
	.version("1.0.0")
	.argument("<featureName>", "Имя фичи (любой кейс — будет скорректирован)")
	.action(generateFeature)
	.parse();
