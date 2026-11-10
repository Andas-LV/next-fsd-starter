export interface IItem {
	id: string;
	// TODO: добавьте поля
}

export type CreateItemPayload = Omit<IItem, "id">;
