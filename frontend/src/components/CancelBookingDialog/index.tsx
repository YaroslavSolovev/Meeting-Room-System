import "./style.css";
import type { Booking } from "../../types/booking";


type Props = {
    booking: Booking;
    onClose: () => void;
    onConfirm: () => void;
};


export default function CancelBookingDialog({
    booking,
    onClose,
    onConfirm
}: Props) {

    const start =
        new Date(
            booking.startsAt
        );

    const end =
        new Date(
            booking.endsAt
        );


    const date =
        start.toLocaleDateString(
            "ru-RU",
            {
                weekday:"long",
                day:"numeric",
                month:"long"
            }
        );


    const time =
        `${start.toLocaleTimeString(
            "ru-RU",
            {
                hour:"2-digit",
                minute:"2-digit"
            }
        )} - ${
            end.toLocaleTimeString(
                "ru-RU",
                {
                    hour:"2-digit",
                    minute:"2-digit"
                }
            )
        }`;


    return (
        <div className="cancel-overlay">

            <div className="cancel-dialog">


                <div className="dialog-header">

                    <h2>
                        Отменить бронирование?
                    </h2>

                    <p>
                        Это действие нельзя будет отменить.
                        Освободившееся время станет доступно
                        другим сотрудникам.
                    </p>

                </div>


                <div className="cancel-summary">

                    <strong>
                        {booking.title}
                    </strong>


                    <span>
                        {booking.room.name},
                        {" "}
                        {booking.room.floor} этаж
                    </span>


                    <span>
                        {date},
                        {" "}
                        {time}
                    </span>


                </div>


                <div className="dialog-actions">


                    <button
                        className="leave-btn"
                        onClick={onClose}
                    >
                        Нет, оставить
                    </button>


                    <button
                        className="confirm-btn"
                        onClick={onConfirm}
                    >
                        Да, отменить
                    </button>


                </div>


            </div>

        </div>
    );
}