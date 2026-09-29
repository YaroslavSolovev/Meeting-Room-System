import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";


export function useWebSocket() {

    const queryClient = useQueryClient();


    useEffect(() => {

        const ws = new WebSocket(
            import.meta.env.VITE_WS_URL
        );


        ws.onopen = () => {

            console.log(
                "WebSocket connected"
            );

        };


        ws.onmessage = (event)=>{


            const message =
                JSON.parse(
                    event.data
                );


            console.log(
                "WS EVENT:",
                message
            );


            switch(message.type){


               case "booking.created":
               /* falls through */

               case "booking.cancelled":


                    queryClient.invalidateQueries({
                        queryKey:[
                            "my-bookings"
                        ]
                    });


                    queryClient.invalidateQueries({
                        queryKey:[
                            "room-bookings"
                        ]
                    });


                    queryClient.invalidateQueries({
                        queryKey:[
                            "rooms"
                        ]
                    });


                break;



                case "room.availability_changed":


                    queryClient.invalidateQueries({
                        queryKey:[
                            "rooms"
                        ]
                    });


                break;



                case "data.reset":


                    queryClient.invalidateQueries();


                break;


                default:

                    console.log(
                        "Unknown WS event",
                        message
                    );

            }


        };


      ws.onerror = (error)=>{

         console.warn(
            "WebSocket connection error",
            error
         );

      };


        ws.onclose = ()=>{

            console.log(
                "WebSocket disconnected"
            );

        };


        return ()=>{

            ws.close();

        };


    },[
        queryClient
    ]);

}