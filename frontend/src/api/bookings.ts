import { api } from "./client";
import type { Booking } from "../types/booking";

type BookingsResponse = {
   items: Booking[];
};

export async function getMyBookings(): Promise<Booking[]> {
   const response = await api.get<BookingsResponse>(
      "/bookings",
      {
         params: {
            scope: "all"
         }
      }
   );

   return response.data.items;
}

export async function createBooking(data: {
   roomId: string;
   title: string;
   comment?: string | null;
   startsAt: string;
   endsAt: string;
}) {

   const response = await api.post(
      "/bookings",
      data
   );

   return response.data;
}

export async function cancelBooking(
    bookingId: string
){
    await api.delete(
        `/bookings/${bookingId}`
    );
}