/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  renderHook,
  act,
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
  useCreateBooking
} from "./useCreateBooking";


import * as api from "../api/bookings";



vi.mock(
"../api/bookings",
()=>({

 createBooking:
 vi.fn()

})
);



function wrapper(){

 const client =
 new QueryClient({

  defaultOptions:{
   mutations:{
    retry:false
   },

   queries:{
    retry:false
   }
  }

 });



 return function Wrapper({
  children
 }:any){

  return (

   <QueryClientProvider client={client}>
    {children}
   </QueryClientProvider>

  );

 }

}




describe(
"useCreateBooking",
()=>{


it(
"creates booking successfully",
async()=>{


(
api.createBooking as any
)
.mockResolvedValue({

 id:"1"

});



const {
 result
}=renderHook(

()=>useCreateBooking(),

{
 wrapper:wrapper()
}

);



await act(async()=>{


 await result.current.mutateAsync({

   roomId:"room-1",

   title:"Meeting",

   startsAt:
   "2026-09-10T10:00",

   endsAt:
   "2026-09-10T10:30"

 });


});



expect(
 api.createBooking
)
.toHaveBeenCalled();



await waitFor(()=>{


 expect(
  result.current.isSuccess
 )
 .toBe(true);


});


});





it(
"throws error when booking conflicts",
async()=>{


(
api.createBooking as any
)
.mockRejectedValue({

 response:{
  status:409
 }

});



const {
 result
}=renderHook(

()=>useCreateBooking(),

{
 wrapper:wrapper()
}

);



await expect(

 result.current.mutateAsync({

  roomId:"room-1",

  title:"Meeting",

  startsAt:
  "2026-09-10T10:00",

  endsAt:
  "2026-09-10T10:30"

 })

)
.rejects
.toBeTruthy();



});


});