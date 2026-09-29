import { useQuery } from "@tanstack/react-query";
import { getOffices } from "../api/offices";
import type { Office } from "../types/office";

export function useOffices() {
   return useQuery<Office[]>({
      queryKey: ["offices"],
      queryFn: getOffices,
   });
}