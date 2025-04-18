#!/usr/bin/env node

import { program } from "commander";
import * as fs from "fs-extra";
import * as path from "path";

// Утилиты для преобразований имен
const toCamel = (str: string) =>
	str.replace(/[-_ ]+([a-zA-Z0-9])/g, (_, c) => c.toLowerCase());

const toPascal = (str: string) => {
	const camel = toCamel(str);
	return camel.charAt(0).toUpperCase() + camel.slice(1);
};

// Общая структура файлов и шаблоны
const fileConfigs = (camel: string, pascal: string) => [
	{
		dir: "",
		name: "index.ts",
		content: `export * from './service/${camel}.service';
			export * from './store/use${pascal}Store';
			export * from './types/${camel}Types';`,
	},
	{
		dir: "service",
		name: `${camel}.service.ts`,
		content: `import axiosInstance from '@/shared/api/axiosInstance';
	export async function fetch${pascal}() {
	const { data } = await axiosInstance.get('/${camel}');
	return data;
}
			
	export async function create${pascal}(payload: unknown) {
	const { data } = await axiosInstance.post('/${camel}', payload);
	return data;
}
			
	export async function fetch${pascal}ById(id: string) {
	const { data } = await axiosInstance.get("/${camel}/id");
	return data;
}`,
	},
	{
		dir: "store",
		name: `use${pascal}Store.ts`,
		content: `import { create } from 'zustand';
import * as service from '@/features/${camel}/service/${camel}.service';
import type { I${pascal} } from '@/features/${camel}/types/${camel}Types';
			
interface ${pascal}State {
	data: I${pascal} | null;
	loading: boolean;
	error: string | null;
	get${pascal}: () => Promise<void>;
}
			
export const use${pascal}Store = create<${pascal}State>((set) => ({
		data: null,
				loading: false,
				error: null,
			
				get${pascal}: async () => {
					set({ loading: true, error: null });
					try {
						const result = await service.fetch${pascal}();
						set({ data: result, loading: false });
					} catch (err) {
						set({ error: (err as Error).message, loading: false });
					}
				}
			}));`,
	},
	{
		dir: "types",
		name: `${camel}Types.ts`,
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
		await fs.writeFile(path.join(dirPath, name), content.trim());
	}

	console.log(`✅ Feature "${featureName}" создана в ${baseDir}`);
}

program
	.version("1.0.0")
	.argument("<featureName>", "Имя фичи (любой кейс — будет скорректирован)")
	.action(generateFeature)
	.parse();
