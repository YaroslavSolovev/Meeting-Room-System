/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
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
  useWebSocket
} from "./useWebSocket";


const invalidateQueries =
vi.fn();



vi.mock(
"@tanstack/react-query",
async()=>{

 const actual =
 await vi.importActual<
 typeof import("@tanstack/react-query")
 >(
 "@tanstack/react-query"
 );


 return {

  ...actual,

  useQueryClient:()=>({

    invalidateQueries

  })

 };

});


describe(
"useWebSocket",
()=>{


it(
"invalidates queries after booking.created event",
async()=>{


let socket:any;



class MockWebSocket {


onmessage:any;

onopen:any;

onclose:any;


constructor(){

 socket=this;

}


close(){

}


}



vi.stubGlobal(
"WebSocket",
MockWebSocket
);



const client =
new QueryClient();



const wrapper =
({children}:any)=>(

<QueryClientProvider client={client}>
 {children}
</QueryClientProvider>

);



renderHook(
()=>useWebSocket(),
{
 wrapper
}
);



socket.onmessage({

 data:JSON.stringify({

  type:
  "booking.created"

 })

});



await waitFor(()=>{


expect(
invalidateQueries
)
.toHaveBeenCalledTimes(3);


});


});


});