import "./style.css";
import Timeline from "../Timeline";
import type { Booking } from "../../types/booking";


type Props = {
    bookings: Booking[];
    date: string;
    onBookClick: () => void;
    onDateChange: () => void;
};


export default function RoomSchedule({
    bookings,
    date,
    onBookClick,
    onDateChange
}: Props) {


return (

<div className="schedule-card">


<div className="schedule-header">


<div>

<h2>
Расписание на день
</h2>


<p>
{date}
</p>


</div>


<button 
   className="date-select"
   onClick={onDateChange}
>
Выбрать дату
</button>


</div>



<Timeline
    bookings={bookings}
/>



<div className="timeline-actions">

<button
    className="primary-book-trigger"
    onClick={onBookClick}
>
Забронировать комнату
</button>


</div>


</div>

)

}