import {
   Button,
   Dialog,
   DialogContent,
} from "@mui/material";
import "./style.css";

type Props = {
   open: boolean;
   onClose: () => void;
};

export default function BookingConflictDialog({
   open,
   onClose,
}: Props) {

   return (
      <Dialog
         open={open}
         onClose={
            onClose
         }
         maxWidth={false}

         slotProps={{
            paper: {
               className:
                  "booking-conflict-paper",
            },
         }}
      >
         <DialogContent
            className="booking-conflict-content"
         >

            <div className="booking-conflict-icon">

   <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
   >

      <path
         d="M10.3 4.1L2.1 18.2C1.7 18.9 2.2 19.8 3.1 19.8H20.9C21.8 19.8 22.3 18.9 21.9 18.2L13.7 4.1C12.9 2.7 11.1 2.7 10.3 4.1Z"
         stroke="currentColor"
         strokeWidth="1.8"
         strokeLinejoin="round"
      />

      <path
         d="M12 9V13"
         stroke="currentColor"
         strokeWidth="1.8"
         strokeLinecap="round"
      />

      <circle
         cx="12"
         cy="16.5"
         r="1"
         fill="currentColor"
      />

   </svg>

   </div>
            <h2>
               Время уже занято
            </h2>


            <p>
               Выбранный интервал был забронирован другим сотрудником.
               Расписание обновлено.
            </p>


            <Button
               variant="contained"

               fullWidth

               onClick={
                  onClose
               }

               sx={{
                  height:
                     "44px",

                  textTransform:
                     "none",

                  backgroundColor:
                     "#0D9488",

                  borderRadius:
                     "8px",

                  fontWeight:
                     700,

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
               Выбрать другое время
            </Button>
         </DialogContent>
      </Dialog>
   );
}