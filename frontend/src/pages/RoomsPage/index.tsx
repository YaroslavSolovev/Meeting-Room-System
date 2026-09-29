import {
   useMemo,
   useState
} from "react";
import { useOffices } from "../../hooks/useOffices";
import { useRooms } from "../../hooks/useRooms";
import type { RoomFilters } from "../../types/roomFilters";
import {
   createDefaultFilters,
   createRoomInterval
} from "../../utils/dateTime";
import FilterBar from "../../components/FilterBar";
import OfficeHeader from "../../components/OfficeHeader";
import RoomsGrid from "../../components/RoomsGrid";
import "./style.css";

export default function RoomsPage() {
   const [
      officeId,
      setOfficeId
   ] = useState(
      "office-moscow"
   );

   const [
      filters,
      setFilters
   ] = useState<RoomFilters | null>(
      null
   );

   const {
      data: offices
   } = useOffices();

   const office =
      offices?.find(
         (item) =>
            item.id === officeId
      );

   const activeFilters =
      useMemo(() => {

         if (filters) {
            return filters;
         }
         if (!office) {
            return null;
         }
         return createDefaultFilters(
            office.timezone
         );

      }, [filters, office]);

   const interval =
      useMemo(() => {

         if (
            !office ||
            !activeFilters
         ) {
            return null;
         }
         return createRoomInterval(
            activeFilters,
            office.timezone
         );
      }, [
         office,
         activeFilters
      ]);

   const {
      data: rooms,
      isLoading,
      error
   } = useRooms({
      officeId,
      minCapacity:
         activeFilters?.minCapacity,

      from:
         interval?.from,

      to:
         interval?.to,

   });

   function handleOfficeChange(
      nextOfficeId: string
   ) {
      setOfficeId(nextOfficeId);
      setFilters(null);
   }

   return (

      <div className="rooms-page">

         <OfficeHeader
            office={office}

            offices={
               offices ?? []
            }
            officeId={officeId}

            onOfficeChange={
               handleOfficeChange
            }

         />

         {
            activeFilters &&
            office &&
            <FilterBar
               filters={activeFilters}
               officeTimezone={
                  office.timezone
               }
               onChange={
                  setFilters
               }
            />
         }

         {
            isLoading &&
            <p>
               Загрузка...
            </p>
         }

         {
            error &&
            <p>
               Ошибка загрузки
            </p>
         }

         {
            rooms &&
            <section className="rooms-content">

               <h1>
                  Доступные переговорные в этом офисе
               </h1>

               {
                  rooms.length === 0
                     ?
                     <p>
                        Нет доступных переговорных
                     </p>
                     :
                     <RoomsGrid
                        rooms={rooms}
                     />
               }
            </section>
         }
      </div>
   );
}