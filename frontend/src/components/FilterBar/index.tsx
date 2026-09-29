import { useEffect } from "react";
import type { RoomFilters } from "../../types/roomFilters";
import {
   getAvailableDurations,
   getAvailableStartTimes,
   getDateLimits
} from "../../utils/dateTime";
import "./style.css";

type Props = {
   filters: RoomFilters;
   officeTimezone: string;
   onChange: (
      filters: RoomFilters
   ) => void;
};

const CAPACITY_OPTIONS = [
   2,
   4,
   6,
   8,
   10,
   12,
];

function formatDuration(
   minutes: number
) {

   if (minutes < 60) {
      return `${minutes} мин`;
   }

   if (minutes === 60) {
      return "1 час";
   }

   const hours =
      Math.floor(minutes / 60);

   const remainingMinutes =
      minutes % 60;

   if (remainingMinutes === 0) {
      return `${hours} ч`;
   }

   return (
      `${hours} ч ` +
      `${remainingMinutes} мин`
   );
}

export default function FilterBar({
   filters,
   officeTimezone,
   onChange
}: Props) {

   const {
      minDate,
      maxDate
   } =
      getDateLimits(
         officeTimezone
      );

   const timeOptions =
      getAvailableStartTimes(
         filters.date,
         officeTimezone
      );

   const durationOptions =
      getAvailableDurations(
         filters.startTime
      );

   useEffect(() => {

      if (
         timeOptions.length === 0
      ) {
         return;
      }

      if (
         !timeOptions.includes(
            filters.startTime
         )
      ) {
         onChange({
            ...filters,
            startTime:
               timeOptions[0],
         });
      }

   }, [
      filters,
      onChange,
      timeOptions
   ]);

   useEffect(() => {

      if (
         durationOptions.length === 0
      ) {
         return;
      }

      if (
         !durationOptions.includes(
            filters.durationMinutes
         )
      ) {
         onChange({
            ...filters,
            durationMinutes:
               durationOptions[
                  durationOptions.length - 1
               ],
         });
      }

   }, [
      durationOptions,
      filters,
      onChange
   ]);

   return (

      <section className="filter-bar">
         <div className="filter-item">
            <label>
               Дата
            </label>
            <input
               type="date"
               value={
                  filters.date
               }
               min={minDate}
               max={maxDate}
               onChange={(event) =>
                  onChange({
                     ...filters,
                     date:
                        event.target.value
                  })
               }
            />

         </div>

         <div className="filter-item">

            <label>
               Время начала
            </label>

            <select
               value={
                  filters.startTime
               }

               onChange={(event) =>
                  onChange({
                     ...filters,
                     startTime:
                        event.target.value
                  })
               }
            >

               {
                  timeOptions.map(
                     (time) => (

                        <option
                           key={time}
                           value={time}
                        >
                           {time}
                        </option>

                     )
                  )
               }

            </select>

         </div>

         <div className="filter-item">

            <label>
               Длительность
            </label>

            <select
               value={
                  filters.durationMinutes
               }

               onChange={(event) =>
                  onChange({
                     ...filters,
                     durationMinutes:
                        Number(
                           event.target.value
                        )
                  })
               }
            >

               {
                  durationOptions.map(
                     (minutes) => (

                        <option
                           key={minutes}
                           value={minutes}
                        >

                           {
                              formatDuration(
                                 minutes
                              )
                           }

                        </option>

                     )
                  )
               }
            </select>
         </div>

         <div className="filter-item">

            <label>
               Вместимость
            </label>
            <select
               value={
                  filters.minCapacity
               }

               onChange={(event) =>
                  onChange({
                     ...filters,
                     minCapacity:
                        Number(
                           event.target.value
                        )
                  })
               }
            >
               {
                  CAPACITY_OPTIONS.map(
                     (capacity) => (

                        <option
                           key={capacity}
                           value={capacity}
                        >
                           Мин. {capacity} чел.
                        </option>
                     )
                  )
               }
            </select>
         </div>
      </section>
   );
}