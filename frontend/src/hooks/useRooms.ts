import { useQuery } from "@tanstack/react-query";
import {
   getRooms,
   type GetRoomsParams
} from "../api/rooms";

export function useRooms(
   params: GetRoomsParams
) {
   return useQuery({

      queryKey: [
         "rooms",
         params.officeId,
         params.minCapacity,
         params.from,
         params.to,
      ],
      queryFn: () => getRooms(params),
      enabled: Boolean(
         params.officeId &&
         params.from &&
         params.to
      ),

   });
}