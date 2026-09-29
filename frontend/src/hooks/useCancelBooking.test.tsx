/* eslint-disable @typescript-eslint/no-explicit-any */
import {
 renderHook,
 act
}
from "@testing-library/react";


import {
 QueryClient,
 QueryClientProvider
}
from "@tanstack/react-query";


import {
 describe,
 expect,
 it,
 vi
}
from "vitest";


import {
 useCancelBooking
}
from "./useCancelBooking";


import * as api from "../api/bookings";



vi.mock(
"../api/bookings",
()=>({

 cancelBooking:
 vi.fn()

})
);



describe(
"useCancelBooking",
()=>{


it(
"cancels booking",
async()=>{


(
api.cancelBooking as any
)
.mockResolvedValue({});



const invalidateQueries =
vi.fn();


const client =
new QueryClient();


client.invalidateQueries =
invalidateQueries as any;


const wrapper =
({children}:any)=>(

<QueryClientProvider client={client}>
 {children}
</QueryClientProvider>

);



const {
 result
}=renderHook(
()=>useCancelBooking(),
{
 wrapper
}
);



await act(async()=>{


await result.current.mutateAsync(
"booking-1"
);


});



expect(
api.cancelBooking
)
.toHaveBeenCalledWith(
"booking-1",
expect.any(Object)
);
expect(
invalidateQueries
)
.toHaveBeenCalled();


});


});