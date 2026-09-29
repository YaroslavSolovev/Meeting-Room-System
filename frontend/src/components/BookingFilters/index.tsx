type Props = {
   officeFilter:string;
   setOfficeFilter:
      (value:string)=>void;

   dateFilter:string;
   setDateFilter:
      (value:string)=>void;
};


export default function BookingFilters({
      officeFilter,
      setOfficeFilter,
      dateFilter,
      setDateFilter
   }:Props){

   return (

      <div className="booking-filters">


         <select
         value={officeFilter}
         onChange={(e)=>
         setOfficeFilter(e.target.value)
         }
         >

            <option value="all">
            Все офисы
            </option>

         </select>

         <select
         value={dateFilter}
         onChange={(e)=>
         setDateFilter(e.target.value)
         }
         >

            <option value="all">
               За все время
            </option>

         </select>
      </div>
   )
}