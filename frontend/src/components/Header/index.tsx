import { NavLink } from "react-router-dom";
import LogoIcon from "./LogoIcon";
import "./style.css";


export default function Header() {
    
    return (
        <header className="navbar">

            <div className="brand">

                <div className="logo-badge">
                    <LogoIcon/>
                </div>

                <div className="logo-text">
                    BookRoom
                </div>

            </div>

            <nav className="nav-links">

                <NavLink
                    to="/rooms"

                    className={({isActive}) =>
                        isActive
                        ? "nav-rooms active"
                        : "nav-rooms"
                    }

                >

                    Переговорные

                </NavLink>

                <NavLink

                    to="/bookings"

                    className={({isActive}) =>
                        isActive
                        ? "nav-bookings active"
                        : "nav-bookings"
                    }

                >
                    Мои бронирования

                </NavLink>
            </nav>

            <div className="user-profile">
                <div className="user-info">

                    <span>
                        Константин К.
                    </span>

                </div>

                <div className="avatar-wrapper">

                    <div className="avatar-circle">

                        <span className="initials">
                            КК
                        </span>

                    </div>
                </div>

            </div>

        </header>
    );

}