import { useQuery } from "@tanstack/react-query";
import { getRoomById } from "../api/rooms";

export function useRoom(
   roomId: string
) {

   return useQuery({

      queryKey: [
         "room",
         roomId
      ],

      queryFn: () =>
         getRoomById(roomId),

      enabled:
         Boolean(roomId),

   });
}