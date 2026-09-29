import type { Office } from "../../types/office";
import OfficeSelector from "../OfficeSelector";
import "./style.css";

type Props = {
    office?: Office;
    offices: Office[];
    officeId: string;
    onOfficeChange: (id:string)=>void;
};

export default function OfficeHeader({
    office,
    offices,
    officeId,
    onOfficeChange
}: Props) {

    return (

    <section className="office-header">
        <div className="office-top">
            <OfficeSelector
            offices={offices}
            value={officeId}
            onChange={onOfficeChange}
            />
        </div>

        <div className="office-bottom">
            <div className="office-address">
                {office?.address}
            </div>

            <div className="office-time">
                Местное время: 14:35 MSK
            </div>

        </div>


    </section>

)

}