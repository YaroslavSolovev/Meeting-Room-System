import { api } from "./client";
import type { User } from "../types/user";

export async function getMe(): Promise<User> {
   const response =
      await api.get<User>("/me");
   return response.data;
}