import { useState } from "react";
import type { Office } from "../../types/office";
import "./style.css";

type Props = {
   offices: Office[];
   value: string;
   onChange: (id:string)=>void;
};

export default function OfficeSelector({
   offices,
   value,
   onChange
}:Props){

   const [open,setOpen] = useState(false);

   const office = offices.find(
      item => item.id === value
   );
   return (

      <div className="office-selector">
         <div
         className="office-title"
         onClick={()=>setOpen(!open)}
         >
            {office?.name}
            <span className={`arrow ${open ? "open" : ""}`}></span>
         </div>

         {
         open && (
         <div className="office-dropdown">
         {
         offices.map((item)=>(
         <div
         key={item.id}
         className="office-option"
         onClick={()=>{
         onChange(item.id);
         setOpen(false);
         }}
         >
         {item.name}
         </div>
         ))
         }

         </div>
         )
         }
      </div>
)

}