import { useState } from "react";
import axios from "axios";
import {
   Alert,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   MenuItem,
   TextField,
} from "@mui/material";
import { useCreateBooking } from "../../hooks/useCreateBooking";
import type { Booking } from "../../types/booking";
import type { Room } from "../../types/room";
import {
   createRoomInterval,
   formatOfficeDate,
   getAvailableDurations,
   getAvailableStartTimes,
   getDateLimits,
} from "../../utils/dateTime";
import "./style.css";


type Props = {
   room: Room;
   initialDate: string;
   onClose: () => void;
   onCreated: (booking: Booking) => void;
   onConflict: () => void;
};

type ApiErrorResponse = {
   error: {
      code: string;
      message: string;
   };
};

function formatDuration(minutes: number) {
   if (minutes < 60) {
      return `${minutes} мин`;
   }
   const hours = Math.floor(minutes / 60);
   const rest = minutes % 60;

   if (rest === 0) {
      return hours === 1
         ? "1 час"
         : `${hours} ч`;
   }
   return `${hours} ч ${rest} мин`;
}

function pickDuration(
   currentDuration: number,
   startTime: string
) {
   const durations =
      startTime
         ? getAvailableDurations(startTime)
         : [];

   if (durations.includes(currentDuration)) {
      return currentDuration;
   }
   if (durations.includes(60)) {
      return 60;
   }

   return durations.at(-1) ?? 0;
}

export default function BookingDialog({
   room,
   initialDate,
   onClose,
   onCreated,
   onConflict,
}: Props) {
   const initialTimes =
      getAvailableStartTimes(
         initialDate,
         room.office.timezone
      );

   const initialStartTime =
      initialTimes[0] ?? "";

   const [title, setTitle] =
      useState("");

   const [comment, setComment] =
      useState("");

   const [date, setDate] =
      useState(initialDate);

   const [startTime, setStartTime] =
      useState(initialStartTime);
   const [
      durationMinutes,
      setDurationMinutes
   ] =
      useState(
         pickDuration(
            60,
            initialStartTime
         )
      );
   const [
      titleError,
      setTitleError
   ] =
      useState("");

   const [
      dateError,
      setDateError
   ] =
      useState("");
   const [
      formError,
      setFormError
   ] =
      useState("");

   const createBookingMutation =
      useCreateBooking();

   const {
      minDate,
      maxDate
   } =
      getDateLimits(
         room.office.timezone
      );

   const timeOptions =
      getAvailableStartTimes(
         date,
         room.office.timezone
      );
      console.log(
   "BOOKING DEBUG",
   {
      date,
      timezone: room.office.timezone,
      timeOptions
   }
);

   const durationOptions =
      startTime
         ? getAvailableDurations(
            startTime
         )
         : [];

   const interval =
      startTime && durationMinutes
         ?
         createRoomInterval(
            {
               date,
               startTime,
               durationMinutes,
               minCapacity: room.capacity,
            },
            room.office.timezone
         )
         :
         null;

   const endTime =
      interval
         ?
         new Intl.DateTimeFormat(
            "ru-RU",
            {
               hour: "2-digit",
               minute: "2-digit",
               hour12: false,
               timeZone:
                  room.office.timezone,
            }
         ).format(
            new Date(interval.to)
         )
         :
         "";

   function handleDateChange(
      value: string
   ) {

      setDate(value);

      const times =
         getAvailableStartTimes(
            value,
            room.office.timezone
         );

      const firstTime =
         times[0] ?? "";

      setStartTime(
         firstTime
      );

      setDurationMinutes(
         pickDuration(
            60,
            firstTime
         )
      );

      setDateError("");
      setFormError("");
   }

   function handleStartTimeChange(
      nextStartTime: string
   ) {

      setStartTime(
         nextStartTime
      );

      setDurationMinutes(
         pickDuration(
            durationMinutes,
            nextStartTime
         )
      );

      setDateError("");
      setFormError("");
   }

   async function handleSubmit() {

      setTitleError("");
      setDateError("");
      setFormError("");

      if (!title.trim()) {

         setTitleError(
            "Обязательное поле"
         );

         return;
      }

      if (
         date < minDate ||
         date > maxDate
      ) {

         setDateError(
            "Выберите дату не более чем на 30 дней вперёд"
         );

         return;
      }

      if (!interval) {

         setDateError(
            "На выбранную дату нет доступного времени"
         );

         return;
      }

      if (
         new Date(
            interval.from
         ).getTime() <=
         Date.now()
      ) {

         setDateError(
            "Нельзя создать бронирование в прошлом"
         );

         return;
      }

      try {

         const booking =
            await createBookingMutation
               .mutateAsync({

                  roomId:
                     room.id,

                  title:
                     title.trim(),

                  comment:
                     comment.trim() ||
                     null,

                  startsAt:
                     interval.from,

                  endsAt:
                     interval.to,

               });

         onCreated(
            booking
         );

      } catch (error) {

         if (
            axios.isAxiosError<ApiErrorResponse>(
               error
            ) &&
            error.response?.status === 409
         ) {

            onConflict();

            return;
         }

         if (
            axios.isAxiosError<ApiErrorResponse>(
               error
            )
         ) {

            setFormError(
               error.response
                  ?.data
                  .error
                  .message
               ??
               "Не удалось создать бронирование"
            );

            return;
         }

         setFormError(
            "Не удалось создать бронирование"
         );
      }
   }

   return (

      <Dialog
         open
         onClose={
            createBookingMutation.isPending
               ? undefined
               : onClose
         }
         maxWidth={false}

         slotProps={{
            paper: {
               className:
                  "booking-dialog-paper",
            },
         }}
      >
         <DialogContent
            className="booking-dialog-content"
         >

            <div className="booking-dialog-header">

               <h2>
                  Новое бронирование
               </h2>

               <p>
                  Переговорная:{" "}
                  <strong>
                     {room.name}
                  </strong>

                  {" "}

                  ({room.office.name}, {room.floor} этаж)

               </p>

            </div>

            <div className="booking-dialog-divider" />

            <div className="booking-form-field">

               <label>
                  Тема встречи *
               </label>
               <TextField
                  value={title}
                  onChange={(event) => {

                     setTitle(
                        event.target.value.slice(
                           0,
                           200
                        )
                     );

                     setTitleError("");
                     setFormError("");

                  }}

                  placeholder="Укажите тему встречи"

                  error={
                     Boolean(
                        titleError
                     )
                  }
                  helperText={
                     titleError
                  }
                  fullWidth
                  size="small"
               />
            </div>

            <div className="booking-form-row">

               <div className="booking-form-field">

                  <label>
                     Дата
                  </label>
                  <TextField
                     type="date"

                     value={date}

                     onChange={(event) =>
                        handleDateChange(
                           event.target.value
                        )
                     }
                     error={
                        Boolean(
                           dateError
                        )
                     }
                     helperText={
                        dateError
                     }
                     fullWidth
                     size="small"

                     slotProps={{
                        htmlInput: {
                           min: minDate,
                           max: maxDate,
                        },
                     }}
                  />
               </div>
               <div className="booking-form-field">

                  <label>
                     Время начала
                  </label>

                  <TextField
                     select

                     value={
                        startTime
                     }

                     onChange={(event) =>
                        handleStartTimeChange(
                           event.target.value
                        )
                     }

                     disabled={
                        timeOptions.length === 0
                     }

                     fullWidth
                     size="small"
                  >
                     {
                        timeOptions.map(
                           (time) => (

                              <MenuItem
                                 key={time}
                                 value={time}
                              >
                                 {time}
                              </MenuItem>

                           )
                        )
                     }
                  </TextField>
               </div>
            </div>
            <div className="booking-form-field">
               <label>
                  Продолжительность
               </label>
               <TextField
                  select

                  value={
                     durationMinutes ||
                     ""
                  }

                  onChange={(event) =>
                     setDurationMinutes(
                        Number(
                           event.target.value
                        )
                     )
                  }
                  disabled={
                     durationOptions.length === 0
                  }

                  fullWidth
                  size="small"
               >
                  {
                     durationOptions.map(
                        (minutes) => {
                           const result =
                              createRoomInterval(
                                 {
                                    date,
                                    startTime,
                                    durationMinutes:
                                       minutes,
                                    minCapacity:
                                       room.capacity,
                                 },
                                 room.office.timezone
                              );
                           const formattedEnd =
                              new Intl.DateTimeFormat(
                                 "ru-RU",
                                 {
                                    hour:
                                       "2-digit",

                                    minute:
                                       "2-digit",

                                    hour12:
                                       false,

                                    timeZone:
                                       room.office.timezone,
                                 }
                              ).format(
                                 new Date(
                                    result.to
                                 )
                              );
                           return (
                              <MenuItem
                                 key={minutes}
                                 value={minutes}
                              >

                                 {
                                    formatDuration(
                                       minutes
                                    )
                                 }

                                 {" "}
                                 (до {formattedEnd})

                              </MenuItem>

                           );
                        }
                     )
                  }
               </TextField>
            </div>

            <div className="booking-form-field">

               <label>
                  Комментарий
               </label>
               <TextField
                  value={comment}

                  onChange={(event) => {

                     setComment(
                        event.target.value.slice(
                           0,
                           2000
                        )
                     );

                     setFormError("");

                  }}

                  placeholder="Дополнительная информация для участников встречи..."

                  multiline
                  minRows={3}
                  fullWidth
               />

            </div>

            {
               interval &&
               (
                  <div className="booking-summary">

                     <span className="booking-summary-icon">
                        i
                     </span>

                     <span>

                        Бронирование на{" "}

                        {
                           formatOfficeDate(
                              date,
                              room.office.timezone
                           )
                        },

                        {" "}

                        {startTime}–{endTime}

                        {" "}

                        (
                        {
                           formatDuration(
                              durationMinutes
                           )
                        }
                        )
                     </span>
                  </div>
               )
            }

            {
               formError &&
               (
                  <Alert severity="error">
                     {formError}
                  </Alert>
               )
            }

         </DialogContent>
         <DialogActions
            className="booking-dialog-actions"
         >
            <Button
               variant="outlined"

               onClick={
                  onClose
               }

               disabled={
                  createBookingMutation.isPending
               }
               sx={{
                  textTransform:
                     "none",

                  borderColor:
                     "#E2E8F0",

                  color:
                     "#334155",

                  fontWeight:
                     600,

                  borderRadius:
                     "8px",

                  minWidth:
                     "103px",
               }}
            >
               Отмена
            </Button>

            <Button
               variant="contained"

               onClick={
                  handleSubmit
               }

               disabled={
                  createBookingMutation.isPending ||
                  !startTime ||
                  !durationMinutes
               }

               sx={{
                  textTransform:
                     "none",

                  backgroundColor:
                     "#0D9488",

                  fontWeight:
                     600,

                  borderRadius:
                     "8px",

                  minWidth:
                     "159px",

                  boxShadow:
                     "none",

                  "&:hover": {
                     backgroundColor:
                        "#0F766E",

                     boxShadow:
                        "none",
                  },
               }}
            >

               {
                  createBookingMutation.isPending
                     ?
                     "Создание..."
                     :
                     "Забронировать"
               }
            </Button>
         </DialogActions>
      </Dialog>
   );
}