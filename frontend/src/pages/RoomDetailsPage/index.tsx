import {
   useMemo,
   useState,
   useRef
} from "react";
import {
    getAvailableStartTimes
} from "../../utils/dateTime";
import {
   Alert,
   Button,
   CircularProgress
} from "@mui/material";
import dayjs from "dayjs";
import {
   useQueryClient
} from "@tanstack/react-query";
import {
   Link,
   useParams
} from "react-router-dom";
import BookingConflictDialog
   from "../../components/BookingConflictDialog";
import BookingDialog
   from "../../components/BookingDialog";
import BookingSuccessToast
   from "../../components/BookingSuccessToast";
import { useMe }
   from "../../hooks/useMe";
import { useRoom }
   from "../../hooks/useRoom";
import { useRoomBookings }
   from "../../hooks/useRoomBookings";
import type { Booking }
   from "../../types/booking";
import {
   createScheduleDayInterval,
   formatOfficeDate,
   getDateLimits,
   getSchedulePosition,
} from "../../utils/dateTime";
import {
   CalendarIcon,
   CapacityIcon,
   FeatureIcon
} from "./icons";
import "./style.css";

const HOUR_ROW_HEIGHT = 48;



const HOURS =
   Array.from(
      {
         length: 12
      },
      (_, index) =>
         9 + index
   );

function formatSuccessInterval(
   booking: Booking,
   officeTimezone: string
) {
   const date =
      new Intl.DateTimeFormat(
         "ru-RU",
         {
            day: "numeric",
            month: "long",
            timeZone: officeTimezone,
         }
      ).format(
         new Date(booking.startsAt)
      );

   const timeFormatter =
      new Intl.DateTimeFormat(
         "ru-RU",
         {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: officeTimezone,
         }
      );

   const startTime =
      timeFormatter.format(
         new Date(booking.startsAt)
      );

   const endTime =
      timeFormatter.format(
         new Date(booking.endsAt)
      );

   const timezoneLabel =
      officeTimezone === "Europe/Moscow"
         ? "MSK"
         : "";

   return `${date}, ${startTime}–${endTime}${
      timezoneLabel ? ` ${timezoneLabel}` : ""
   }`;
}

export default function RoomDetailsPage() {

   const {
      roomId = ""
   } =
      useParams();

   const queryClient =
      useQueryClient();

   const dateInputRef =
      useRef<HTMLInputElement | null>(null);

   const [
      selectedDate,
      setSelectedDate
   ] =
   useState(
      ""
   );

   const [
      bookingDialogOpen,
      setBookingDialogOpen
   ] =
      useState(false);

   const [
      conflictDialogOpen,
      setConflictDialogOpen
   ] =
      useState(false);

   const [
      createdBooking,
      setCreatedBooking
   ] =
      useState<Booking | null>(
         null
      );

   const {
      data: room,

      isLoading:
         roomLoading,

      error:
         roomError,
   } =
      useRoom(
         roomId
      );

   const {
      data: me
   } =
      useMe();

   const defaultDate =
   room
      ?
      (() => {

          const limits =
             getDateLimits(
                room.office.timezone
             );


          const todaySlots =
             getAvailableStartTimes(
                limits.minDate,
                room.office.timezone
             );


          if(todaySlots.length > 0){
             return limits.minDate;
          }


          return dayjs
             .tz(
                limits.minDate,
                room.office.timezone
             )
             .add(
                1,
                "day"
             )
             .format(
                "YYYY-MM-DD"
             );

      })()
      :
      "";
   const activeDate =
      selectedDate ||
      defaultDate;

   const scheduleInterval =
      useMemo(() => {

         if (
            !room ||
            !activeDate
         ) {
            return null;
         }

         return createScheduleDayInterval(
            activeDate,
            room.office.timezone
         );

      }, [
         room,
         activeDate
      ]);


   const {
      data: bookings = [],

      isLoading:
         bookingsLoading,

      error:
         bookingsError,
   } =
      useRoomBookings(

         roomId,

         scheduleInterval?.from,

         scheduleInterval?.to

      );

   function refreshBookingData() {

      return Promise.all([

         queryClient
            .invalidateQueries({
               queryKey: [
                  "room-bookings",
                  roomId,
               ],
            }),

         queryClient
            .invalidateQueries({
               queryKey: [
                  "rooms"
               ],
            }),

         queryClient
            .invalidateQueries({
               queryKey: [
                  "bookings"
               ],
            }),

      ]);
   }

   function handleBookingCreated(
      booking: Booking
   ) {

      setBookingDialogOpen(
         false
      );

      setCreatedBooking(
         booking
      );

      void refreshBookingData();
   }

   async function handleBookingConflict() {

      setBookingDialogOpen(
         false
      );

      await refreshBookingData();

      setConflictDialogOpen(
         true
      );
   }

   if (roomLoading) {

      return (

         <div className="room-details-state">

            <CircularProgress />

            <span>
               Загрузка переговорной...
            </span>

         </div>

      );
   }

   if (
      roomError ||
      !room
   ) {

      return (

         <div className="room-details-state">

            <Alert severity="error">

               Не удалось загрузить переговорную

            </Alert>

         </div>

      );
   }

   const {
      minDate,
      maxDate
   } =
      getDateLimits(
         room.office.timezone
      );

   return (
      <div className="room-details-page">

         <div className="breadcrumbs">
            <Link to="/rooms">
               Переговорные
            </Link>

            <span>
               ›
            </span>

            <Link to="/rooms">
               {room.office.name}
            </Link>

            <span>
               ›
            </span>

            <strong>
               Комната "{room.name}"
            </strong>

         </div>

         <div className="room-details-layout">

            <aside className="room-info-card">

               <h1>
                  {room.name}
               </h1>

               <p className="room-address">
                  {room.office.name}

                  {" · "}

                  {room.office.address}
               </p>

               <div className="room-info-divider" />
               <div className="room-info-list">

                  <p>
                     <span className="room-info-marker">

                        <CapacityIcon />

                     </span>

                     Вместимость: до {room.capacity} человек

                  </p>

                  {
                     room.features.map(
                        (feature) => (

                           <p key={feature.code}>

                              <span className="room-info-marker">

                                 <FeatureIcon
                                    code={feature.code}
                                 />

                              </span>

                              {feature.name}

                           </p>

                        )
                     )
                  }

               </div>

            </aside>

            <section className="schedule-card">

               <div className="schedule-header">

                  <div>

                     <h2>
                        Расписание на день
                     </h2>
                     <p>

                        {
                           activeDate

                              ?

                              formatOfficeDate(
                                 activeDate,
                                 room.office.timezone
                              )

                              :

                              ""
                        }
                     </p>
                  </div>

                  <div
                     className="schedule-date-control"
                     onClick={() =>
                        dateInputRef.current?.showPicker()
                     }
                     >
                     <CalendarIcon />
                     <span>
                        Выбрать дату
                     </span>
                     <input
                        ref={dateInputRef}
                        type="date"
                        value={activeDate}
                        min={minDate}
                        max={maxDate}
                        onChange={(event)=>
                           setSelectedDate(
                              event.target.value
                           )
                        }
                     />

                  </div>

               </div>

               {
                  bookingsError

                     ?

                     (
                        <Alert severity="error">

                           Не удалось загрузить расписание

                        </Alert>
                     )

                     :

                     (
                        <div className="schedule-area">

                           <div className="schedule-times">

                              {
                                 HOURS.map(
                                    (
                                       hour,
                                       index
                                    ) => (

                                       <span

                                          key={hour}

                                          style={{
                                             top:
                                                `${index * HOUR_ROW_HEIGHT}px`,
                                          }}

                                       >

                                          {
                                             String(hour)
                                                .padStart(
                                                   2,
                                                   "0"
                                                )
                                          }:00

                                       </span>

                                    )
                                 )
                              }

                           </div>

                           <div className="schedule-timeline">

                              {
                                 HOURS.map(
                                    (
                                       hour,
                                       index
                                    ) => (

                                       <div

                                          key={hour}

                                          className="schedule-line"

                                          style={{
                                             top:
                                                `${(index + 1) * HOUR_ROW_HEIGHT}px`,
                                          }}

                                       />

                                    )
                                 )
                              }

                              {
                                 bookingsLoading &&
                                 (
                                    <div className="schedule-loading">

                                       <CircularProgress
                                          size={28}
                                       />

                                    </div>
                                 )
                              }

                              {
                                 !bookingsLoading &&

                                 bookings.map(
                                    (booking) => {

                                       const position =
                                          getSchedulePosition(

                                             booking.startsAt,

                                             booking.endsAt,

                                             room.office.timezone

                                          );

                                       const isOwnBooking =
                                          booking.userId ===
                                          me?.id;

                                       return (

                                          <div

                                             key={
                                                booking.id
                                             }

                                             className={
                                                isOwnBooking

                                                   ?

                                                   "schedule-booking own"

                                                   :

                                                   "schedule-booking busy"
                                             }
                                             style={
                                                position
                                             }

                                          >

                                             {
                                                isOwnBooking

                                                   ?

                                                   booking.title

                                                   :

                                                   "Занято"
                                             }
                                          </div>

                                       );
                                    }
                                 )
                              }

                           </div>
                        </div>
                     )
               }
               <div className="schedule-actions">

                  <Button
                     variant="contained"

                     disabled={
                        !activeDate ||
                        Boolean(
                           bookingsError
                        )
                     }
                     onClick={() =>
                        setBookingDialogOpen(
                           true
                        )
                     }
                     sx={{
                        textTransform:
                           "none",

                        borderRadius:
                           "8px",

                        backgroundColor:
                           "#0D9488",

                        fontFamily:
                           '"Inter", sans-serif',

                        fontSize:
                           "14px",

                        fontWeight:
                           600,

                        lineHeight:
                           "17px",

                        letterSpacing:
                           0,

                        whiteSpace:
                           "nowrap",

                        width:
                           "219px",

                        minWidth:
                           "219px",

                        height:
                           "39px",

                        padding:
                           "10px 24px",

                        boxShadow:
                           "none",

                        flexShrink:
                           0,

                        "&:hover": {

                           backgroundColor:
                              "#0F766E",

                           boxShadow:
                              "none",

                        },

                     }}

                  >
                     Забронировать комнату
                  </Button>

               </div>

            </section>

         </div>

         {
            bookingDialogOpen &&
            activeDate &&
            (
               <BookingDialog

                  room={
                     room
                  }

                  initialDate={
                     activeDate
                  }

                  onClose={() =>
                     setBookingDialogOpen(
                        false
                     )
                  }

                  onCreated={
                     handleBookingCreated
                  }

                  onConflict={
                     handleBookingConflict
                  }

               />
            )
         }

         <BookingConflictDialog
            open={
               conflictDialogOpen
            }
            onClose={() =>
               setConflictDialogOpen(
                  false
               )
            }

         />

         <BookingSuccessToast

            open={
               Boolean(
                  createdBooking
               )
            }

            roomName={
               room.name
            }

            intervalText={
               createdBooking
                  ?
                  formatSuccessInterval(
                     createdBooking,
                     room.office.timezone
                  )
                  :
                  ""
            }

            onClose={() =>
               setCreatedBooking(
                  null
               )
            }

         />

      </div>

   );
}