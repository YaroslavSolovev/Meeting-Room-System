/* eslint-disable @typescript-eslint/no-explicit-any */
import {
 renderHook,
 waitFor
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
 useRooms
}
from "./useRooms";



import * as api from "../api/rooms";



vi.mock(
"../api/rooms",
()=>({

 getRooms:
 vi.fn()

})
);



describe(
"useRooms",
()=>{


it(
"does not request without office",
()=>{


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

()=>useRooms({

 officeId:"",

 from:"",

 to:""

}),

{
 wrapper
}

);



expect(
result.current.fetchStatus
)
.toBe(
"idle"
);



});


it(
"loads rooms when filters are valid",
async()=>{


(
api.getRooms as any
)
.mockResolvedValue([

 {
   id:"room1",
   name:"Conference room"
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

()=>useRooms({

 officeId:"office1",

 from:"2026-09-10T10:00",

 to:"2026-09-10T11:00"

}),

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
result.current.data?.[0].id
)
.toBe(
"room1"
);



expect(
api.getRooms
)
.toHaveBeenCalled();


});
});