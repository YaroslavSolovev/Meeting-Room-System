import {
   useNavigate
} from "react-router-dom";
import type { Room } from "../../types/room";
import ClockIcon from "./icons/ClockIcon";
import usersIcon from "../../assets/icons/users.svg";
import "./style.css";

type Props = {
   room: Room;
};

export default function RoomCard({
   room
}: Props) {

   const navigate = useNavigate();

   const openRoom = () => {

      navigate(
         `/rooms/${room.id}`
      );

   };

   const openBooking = () => {

      navigate(
         `/rooms/${room.id}?booking=true`
      );

   };

   return (

      <div className="room-card">

         <div className="card-body">

            <div className="card-header">
               <h2>
                  {room.name}
               </h2>

               <span>
                  {room.floor} этаж
               </span>

            </div>

            <div className="room-stats">

               <div className="stat">
                  <img
                     className="icon"
                     src={usersIcon}
                     alt=""
                  />
                  <span>
                     Вместимость: до {room.capacity} человек
                  </span>

               </div>
               <div className="stat">
                  <ClockIcon />
                  <span>

                     {
                        room.available
                        ?
                        "Свободна на выбранное время"
                        :
                        "Занята на выбранное время"
                     }
                  </span>
               </div>
            </div>

            <div
               className={
                  `availability-bar ${
                     room.available
                     ?
                     "available"
                     :
                     "unavailable"
                  }`
               }
            >

               <span className="dot" />

               <span>

                  {
                     room.available

                     ?

                     "Доступно на выбранное время"

                     :

                     "Недоступно на выбранное время"
                  }

               </span>

            </div>
            <div className="card-actions">

               <button
                  className="details-link"

                  onClick={openRoom}

               >

                  Подробнее

               </button>

               <button
                  disabled={!room.available}
                  onClick={openBooking}
                  className={
                     room.available

                     ?

                     "book-btn active"

                     :

                     "book-btn"
                  }

               >
                  Забронировать
               </button>
            </div>
         </div>
      </div>
   );
}