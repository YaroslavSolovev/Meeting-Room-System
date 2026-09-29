import OfficeSelector from "../OfficeSelector";
import type { Office } from "../../types/office";

type Props = {
   offices: Office[];
   officeId: string;
   onOfficeChange: (id:string)=>void;
};

export default function RoomFilters({
   offices,
   officeId,
   onOfficeChange
}:Props){

   return (
   <div>
      <OfficeSelector
      offices={offices}
      value={officeId}
      onChange={onOfficeChange}
      />
   </div>
);
}