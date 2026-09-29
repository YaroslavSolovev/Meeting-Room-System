import { useQuery } from "@tanstack/react-query";
import { getRoomBookings } from "../api/rooms";

export function useRoomBookings(
   roomId: string,
   from?: string,
   to?: string
) {

   return useQuery({

      queryKey: [
         "room-bookings",
         roomId,
         from,
         to,
      ],

      queryFn: () =>
         getRoomBookings({
            roomId,
            from: from!,
            to: to!,
         }),

      enabled:
         Boolean(
            roomId &&
            from &&
            to
         ),

   });
}