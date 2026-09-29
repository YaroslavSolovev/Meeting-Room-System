import "./style.css";
import type { Booking } from "../../types/booking";
import RoomIcon from "../icons/RoomIcon";
type Props = {
    booking: Booking;
    onCancel?: (booking: Booking) => void;
};

export default function BookingCard({
    booking,
    onCancel
}: Props) {

    const isFuture =
        new Date(booking.startsAt) > new Date();

    const start = new Date(booking.startsAt);
    const end = new Date(booking.endsAt);
        
    const month = start
    .toLocaleString(
    "ru-RU",
    {
    month:"short"
    }
    )
    .toUpperCase();

    const day = start.getDate();

    const time =
    `${start.toLocaleTimeString(
    "ru-RU",
    {
    hour:"2-digit",
    minute:"2-digit"
    }
    )}
        -
    ${end.toLocaleTimeString(
    "ru-RU",
    {
    hour:"2-digit",
    minute:"2-digit"
    }
    )} MSK`;

    return (

        <div className="booking-card">

            <div className="date-box">

                <span>
                    {month}
                </span>

                <strong>
                    {day}
                </strong>

            </div>

            <div className="booking-info">

                <h3>
                {booking.title}
                </h3>

                <div className="booking-meta">

                    <div className="room-name">

                        <RoomIcon />

                        <span>
                        {booking.room.name}
                        </span>

                    </div>

                    <span className="separator">
                    </span>

                    <span>
                    {booking.room.floor} этаж
                    </span>

                    <span className="separator">
                    </span>

                    <span>
                        {time}
                    </span>


                </div>


            </div>

            {
                onCancel && isFuture && (
                    <button
                        className="cancel-button"
                        onClick={() => onCancel(booking)}
                    >
                        Отменить
                    </button>
                )
            }

        </div>
        )
}