import { api } from "./client";
import type { Booking } from "../types/booking";
import type { Room } from "../types/room";

type RoomsResponse = {
   items: Room[];
};

type RoomBookingsResponse = {
   items: Booking[];
};

export type GetRoomsParams = {
   officeId: string;
   minCapacity?: number;
   from?: string;
   to?: string;
};

export type GetRoomBookingsParams = {
   roomId: string;
   from: string;
   to: string;
};

export async function getRooms(
   params: GetRoomsParams
): Promise<Room[]> {

   const response =
      await api.get<RoomsResponse>(
         "/rooms",
         {
            params,
         }
      );
   return response.data.items;
}

export async function getRoomById(
   roomId: string
): Promise<Room> {
   const response =
      await api.get<Room>(
         `/rooms/${roomId}`
      );

   return response.data;
}

export async function getRoomBookings({
   roomId,
   from,
   to,
}: GetRoomBookingsParams): Promise<Booking[]> {

   const response =
      await api.get<RoomBookingsResponse>(
         `/rooms/${roomId}/bookings`,
         {
            params: {
               from,
               to,
            },
         }
      );

   return response.data.items;
}