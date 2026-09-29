import type { Feature } from "./feature";
import type { Office } from "./office";

export type Room = {
   id: string;
   officeId: string;
   name: string;
   floor: number;
   capacity: number;
   features: Feature[];
   office: Office;
   available?: boolean;
};