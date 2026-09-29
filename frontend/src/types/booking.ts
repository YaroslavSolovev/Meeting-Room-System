import type { Feature } from "./feature";
import type { Office } from "./office";
import type { User } from "./user";

export type BookingRoom = {
   id: string;
   officeId: string;
   name: string;
   floor: number;
   capacity: number;
   features: Feature[];
};

export type Booking = {
   id: string;
   roomId: string;
   userId: string;
   title: string;
   comment: string | null;
   startsAt: string;
   endsAt: string;
   createdAt: string;
   room: BookingRoom;
   office: Office;
   owner: User;
};