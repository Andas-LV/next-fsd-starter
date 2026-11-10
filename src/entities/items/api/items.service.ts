import axiosInstance from "@/shared/api/axiosInstance";
import type { CreateItemPayload, IItem } from "../model/types";

export async function fetchItems(): Promise<IItem[]> {
	const { data } = await axiosInstance.get<IItem[]>("/items");
	return data;
}

export async function fetchItemById(id: string): Promise<IItem> {
	const { data } = await axiosInstance.get<IItem>(`/items/${id}`);
	return data;
}

export async function createItem(payload: CreateItemPayload): Promise<IItem> {
	const { data } = await axiosInstance.post<IItem>("/items", payload);
	return data;
}
