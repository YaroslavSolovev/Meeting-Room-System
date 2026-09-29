import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelBooking } from "../api/bookings";


export function useCancelBooking(){

    const queryClient =
        useQueryClient();


    return useMutation({

        mutationFn: cancelBooking,


        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey:[
                    "my-bookings"
                ]
            });

        }

    });

}