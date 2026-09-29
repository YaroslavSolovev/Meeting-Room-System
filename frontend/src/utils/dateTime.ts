import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { RoomFilters } from "../types/roomFilters";

dayjs.extend(utc);
dayjs.extend(timezone);

export function createDefaultFilters(
   officeTimezone: string
): RoomFilters {

   const now = dayjs().tz(officeTimezone);
   let start = now
      .second(0)
      .millisecond(0);

   const remainder = start.minute() % 15;
   if (
      remainder !== 0 ||
      now.second() !== 0 ||
      now.millisecond() !== 0
   ) {
      const minutesToAdd =
         remainder === 0
            ? 15
            : 15 - remainder;

      start = start.add(
         minutesToAdd,
         "minute"
      );
   }

   const workStart = start
      .startOf("day")
      .hour(9);

   const workEnd = start
      .startOf("day")
      .hour(20);

   if (start.isBefore(workStart)) {
      start = workStart;
   }

   if (
      start
         .add(60, "minute")
         .isAfter(workEnd)
   ) {
      start = start
         .add(1, "day")
         .startOf("day")
         .hour(9);
   }

   return {
      date: start.format("YYYY-MM-DD"),
      startTime: start.format("HH:mm"),
      durationMinutes: 60,
      minCapacity: 4,
   };
}

export function createRoomInterval(
   filters: RoomFilters,
   officeTimezone: string
) {

   const start = dayjs.tz(
      `${filters.date}T${filters.startTime}:00`,
      officeTimezone
   );

   const end = start.add(
      filters.durationMinutes,
      "minute"
   );

   return {
      from: start.toISOString(),
      to: end.toISOString(),
   };
}

export function getDateLimits(
   officeTimezone: string
) {
   const today =
      dayjs()
         .tz(officeTimezone)
         .startOf("day");

   return {
      minDate:
         today.format("YYYY-MM-DD"),

      maxDate:
         today
            .add(30, "day")
            .format("YYYY-MM-DD"),
   };
}

export function getAvailableStartTimes(
   date: string,
   officeTimezone: string
) {

   const now =
      dayjs()
         .tz(officeTimezone);


   const selectedDay =
      dayjs.tz(
         `${date}T00:00:00`,
         officeTimezone
      );


   const isToday =
      selectedDay.format("YYYY-MM-DD") ===
      now.format("YYYY-MM-DD");


   const result: string[] = [];


   for (
      let minutes = 9 * 60;
      minutes < 20 * 60;
      minutes += 15
   ) {

      const hours =
         Math.floor(minutes / 60);

      const mins =
         minutes % 60;


      const value =
         `${String(hours).padStart(2, "0")}:` +
         `${String(mins).padStart(2, "0")}`;


      if (isToday) {

         const candidate =
            dayjs.tz(
               `${date}T${value}:00`,
               officeTimezone
            );


         if (
            !candidate.isAfter(now)
         ) {
            continue;
         }

      }


      result.push(value);

   }


   return result;
}

export function getAvailableDurations(
   startTime: string
) {

   const [
      hours,
      minutes
   ] = startTime
      .split(":")
      .map(Number);

   const startMinutes =
      hours * 60 + minutes;

   const workEndMinutes =
      20 * 60;

   const availableMinutes =
      workEndMinutes -
      startMinutes;

   const result: number[] = [];

   for (
      let duration = 15;
      duration <= availableMinutes;
      duration += 15
   ) {
      result.push(duration);
   }

   return result;
}

export function createScheduleDayInterval(
   date: string,
   officeTimezone: string
) {

   const from =
      dayjs.tz(
         `${date}T09:00:00`,
         officeTimezone
      );

   const to =
      dayjs.tz(
         `${date}T20:00:00`,
         officeTimezone
      );

   return {

      from:
         from.toISOString(),

      to:
         to.toISOString(),

   };
}

export function getSchedulePosition(
   startsAt: string,
   endsAt: string,
   officeTimezone: string
) {

   const start =
      dayjs(startsAt)
         .tz(officeTimezone);

   const end =
      dayjs(endsAt)
         .tz(officeTimezone);


   const workdayStartMinutes =
      9 * 60;

   const startMinutes =
      start.hour() * 60 +
      start.minute() -
      workdayStartMinutes;

   const durationMinutes =
      end.diff(
         start,
         "minute"
      );

   const hourRowHeight = 48;

   return {

      top:
         `${
            (startMinutes / 60) *
            hourRowHeight
         }px`,

      height:
         `${
            (durationMinutes / 60) *
            hourRowHeight
         }px`,

   };
}

export function formatOfficeDate(
   date: string,
   officeTimezone: string
) {

   const value =
      dayjs.tz(
         `${date}T12:00:00`,
         officeTimezone
      );

   return new Intl.DateTimeFormat(
      "ru-RU",
      {
         weekday: "long",
         day: "numeric",
         month: "long",
         timeZone:
            officeTimezone,
      }
   ).format(
      value.toDate()
   );
}