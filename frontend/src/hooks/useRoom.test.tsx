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
 useRoom
}
from "./useRoom";


import * as api from "../api/rooms";



vi.mock(
"../api/rooms",
()=>({

 getRoomById:
 vi.fn()

})
);



describe(
"useRoom",
()=>{


it(
"loads room by id",
async()=>{


(
api.getRoomById as any
)
.mockResolvedValue({

 id:"room1",

 name:"Meeting room"

});



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

()=>useRoom("room1"),

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
result.current.data?.id
)
.toBe(
"room1"
);


});


});

