import "./style.css";
import type { Booking } from "../../types/booking";


const HOURS = Array.from(
   {length:12},
   (_,index)=>index+9
);


type Props = {
   bookings: Booking[];
};


export default function Timeline({
   bookings
}:Props){


return (

<div className="timeline">

{
HOURS.map(hour=>(

<div
className="timeline-row"
key={hour}
>

<div className="timeline-time">
{String(hour).padStart(2,"0")}:00
</div>


<div className="timeline-track">

{
bookings
.filter(booking=>{

const start =
new Date(booking.startsAt)
.getHours();

return start===hour;

})
.map(booking=>(

<div
key={booking.id}
className="booking-block"
>
{booking.title}
</div>

))
}

</div>


</div>

))
}

</div>

)

}