/* eslint-disable @typescript-eslint/no-explicit-any */
import {
 describe,
 expect,
 it,
 vi
} from "vitest";


import {
 createBooking,
 cancelBooking,
 getMyBookings
} from "./bookings";


import { api } from "./client";


vi.mock("./client",()=>({

 api:{
   get:vi.fn(),
   post:vi.fn(),
   delete:vi.fn()
 }

}));



describe(
"bookings api",
()=>{


it(
"gets user bookings",
async()=>{


(
api.get as any
)
.mockResolvedValue({

 data:{
   items:[
    {
      id:"1"
    }
   ]
 }

});



const result =
await getMyBookings();



expect(api.get)
.toHaveBeenCalledWith(
"/bookings",
{
 params:{
  scope:"all"
 }
}
);


expect(result)
.toHaveLength(1);


});





it(
"creates booking",
async()=>{


(
api.post as any
)
.mockResolvedValue({

 data:{
  id:"123"
 }

});



await createBooking({

 roomId:"room1",

 title:"test",

 startsAt:
 "2026-09-10T10:00",

 endsAt:
 "2026-09-10T10:30"

});



expect(api.post)
.toHaveBeenCalledWith(
"/bookings",
expect.any(Object)
);


});





it(
"cancels booking",
async()=>{


(
api.delete as any
)
.mockResolvedValue({});



await cancelBooking(
"booking1"
);



expect(api.delete)
.toHaveBeenCalledWith(
"/bookings/booking1"
);


});


});