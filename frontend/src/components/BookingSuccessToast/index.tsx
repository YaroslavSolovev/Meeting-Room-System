import {
   Snackbar
} from "@mui/material";
import "./style.css";

type Props = {
   open: boolean;

   roomName: string;

   intervalText: string;

   onClose: () => void;
};

function CheckIcon() {
   return (

      <svg
         width="20"
         height="20"
         viewBox="0 0 24 24"
         fill="none"
         aria-hidden="true"
      >
         <path
            d="M5 12.5L9.2 16.5L19 6.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>

   );
}

function CloseIcon() {
   return (

      <svg
         width="14"
         height="14"
         viewBox="0 0 14 14"
         fill="none"
         aria-hidden="true"
      >
         <path
            d="M2 2L12 12M12 2L2 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
         />
      </svg>
   );
}

export default function BookingSuccessToast({
   open,
   roomName,
   intervalText,
   onClose,
}: Props) {
   return (

      <Snackbar

         open={open}

         autoHideDuration={5000}
         anchorOrigin={{
            vertical: "top",
            horizontal: "center",
         }}

         onClose={(
            _event,
            reason
         ) => {

            if (
               reason === "clickaway"
            ) {
               return;
            }

            onClose();
         }}

         sx={{
            top: "32px !important",
         }}

      >
         <div className="booking-success-toast">

            <div className="booking-success-badge">

               <CheckIcon />

            </div>

            <div className="booking-success-content">

               <strong>
                  Бронирование создано
               </strong>

               <span>
                  Комната {roomName}, {intervalText}

               </span>

            </div>

            <button
               type="button"

               className="booking-success-close"

               onClick={onClose}

               aria-label="Закрыть уведомление"
            >
               <CloseIcon />
            </button>
         </div>
      </Snackbar>
   );
}