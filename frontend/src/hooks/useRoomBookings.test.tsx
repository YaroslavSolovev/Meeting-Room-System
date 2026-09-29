/* eslint-disable @typescript-eslint/no-explicit-any */
import {
 renderHook,
 waitFor
} from "@testing-library/react";

import {
 QueryClient,
 QueryClientProvider
} from "@tanstack/react-query";

import {
 describe,
 expect,
 it,
 vi
} from "vitest";


import {
 useRoomBookings
} from "./useRoomBookings";


import * as api from "../api/rooms";


vi.mock(
 "../api/rooms",
 ()=>({

  getRoomBookings:
    vi.fn()

 })
);



describe(
"useRoomBookings",
()=>{


it(
"loads room schedule",
async()=>{


(
api.getRoomBookings as any
)
.mockResolvedValue([

 {
  id:"booking1",
  startsAt:"2026-09-10T10:00",
  endsAt:"2026-09-10T11:00"
 }

]);



const client =
new QueryClient();



const wrapper =
({children}:any)=>(

<QueryClientProvider client={client}>
 {children}
</QueryClientProvider>

);



const {
 result
}=renderHook(

()=>useRoomBookings(
 "room1",
 "2026-09-10T09:00",
 "2026-09-10T20:00"
),

{
 wrapper
}

);



await waitFor(()=>{

 expect(
 result.current.data
 )
 .toBeDefined();

});



expect(
result.current.data?.length
)
.toBe(1);


expect(
api.getRoomBookings
)
.toHaveBeenCalled();


});


});