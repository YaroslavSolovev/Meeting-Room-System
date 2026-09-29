import { api } from "./client";
import type { Office } from "../types/office";

type OfficesResponse = {
    items: Office[];
};

export async function getOffices(): Promise<Office[]> {
    const response = await api.get<OfficesResponse>(
        "/offices"
    );
    return response.data.items;
}