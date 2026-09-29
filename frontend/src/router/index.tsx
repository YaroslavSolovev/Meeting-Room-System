import {
   Routes,
   Route,
   Navigate
} from "react-router-dom";

import RoomsPage from "../pages/RoomsPage";
import RoomDetailsPage from "../pages/RoomDetailsPage";
import BookingsPage from "../pages/BookingsPage";
import NotFoundPage from "../pages/NotFoundPage";

import Layout from "../components/Layout";


export function AppRouter() {

   return (

      <Routes>

         <Route element={<Layout />}>

            <Route
               path="/"
               element={
                  <Navigate
                     to="/rooms"
                     replace
                  />
               }
            />

            <Route
               path="/rooms"
               element={
                  <RoomsPage/>
               }
            />


            <Route
               path="/rooms/:roomId"
               element={
                  <RoomDetailsPage/>
               }
            />


            <Route
               path="/bookings"
               element={
                  <BookingsPage/>
               }
            />


            <Route
               path="*"
               element={
                  <NotFoundPage/>
               }
            />


         </Route>


      </Routes>

   );

}