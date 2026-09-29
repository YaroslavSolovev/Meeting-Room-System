import type { Room } from "../../types/room";
import RoomCard from "../RoomCard";
import "./style.css";

type Props = {
    rooms: Room[];
};
export default function RoomsGrid({
    rooms
}: Props){

    return (
        <div className="rooms-grid">
            {
            rooms.map(room=>(
            <RoomCard
            key={room.id}
            room={room}
            />
            ))
            }
        </div>

    );

}