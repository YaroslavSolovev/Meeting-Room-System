import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import CancelBookingDialog from "../../components/CancelBookingDialog";
import BookingCard from "../../components/BookingCard";
import CalendarIcon from "../../components/icons/CalendarIcon";
import ChevronDown from "../../components/icons/ChevronDown";
import EmptyCalendarIcon from "../../components/icons/EmptyCalendarIcon";
import BookingSkeleton from "../../components/BookingSkeleton";
import { useCancelBooking } from "../../hooks/useCancelBooking";
import { useMyBookings } from "../../hooks/useMyBookings";
import { useOffices } from "../../hooks/useOffices";
import type { Booking } from "../../types/booking";

type BookingTab =
    | "upcoming"
    | "past";

type DateFilter =
    | "all"
    | "today"
    | "week"
    | "month";


function matchesDateFilter(
    startsAt: string,
    filter: DateFilter
) {
    if (filter === "all") {
        return true;
    }

    const bookingDate =
        new Date(startsAt);

    const now =
        new Date();

    if (filter === "today") {
        return (
            bookingDate.getFullYear() ===
                now.getFullYear() &&
            bookingDate.getMonth() ===
                now.getMonth() &&
            bookingDate.getDate() ===
                now.getDate()
        );
    }

    const limit =
        new Date(now);

    if (filter === "week") {
        limit.setDate(
            limit.getDate() + 7
        );
    }

    if (filter === "month") {
        limit.setDate(
            limit.getDate() + 30
        );
    }

    return (
        bookingDate >= now &&
        bookingDate <= limit
    );
}


export default function BookingsPage() {
    const navigate =
        useNavigate();
    const [
    cancelBooking,
    setCancelBooking
    ] =
    useState<Booking | null>(null);
    const [
        tab,
        setTab
    ] =
        useState<BookingTab>(
            "upcoming"
        );

    const [
        officeFilter,
        setOfficeFilter
    ] =
        useState("all");

    const [
        dateFilter,
        setDateFilter
    ] =
        useState<DateFilter>(
            "all"
        );

    const {
        data,
        isLoading,
        isError,
        refetch
    } =
        useMyBookings();
    const {
        data: officesData
        }=useOffices();
    const cancelMutation =
        useCancelBooking();

    const bookings =
        data ?? [];
    const offices = officesData ?? [];

    const filteredByControls =
        useMemo(() => {
            return bookings.filter(
                (booking) => {
                const matchesOffice =
                    officeFilter === "all" ||
                    booking.office?.id ===
                        officeFilter;

                const matchesDate =
                    matchesDateFilter(
                        booking.startsAt,
                        dateFilter
                    );

                return (
                    matchesOffice &&
                    matchesDate
                );
                }
            );
        }, [
            bookings,
            officeFilter,
            dateFilter
        ]);


    const {
        upcomingBookings,
        pastBookings
    } =
        useMemo(() => {
            const now =
                new Date();

            return {
                upcomingBookings:
                filteredByControls.filter(
                    (booking) =>
                        new Date(
                            booking.startsAt
                        ) > now
                ),

                pastBookings:
                filteredByControls.filter(
                    (booking) =>
                        new Date(
                            booking.startsAt
                        ) <= now
                )
            };
        }, [filteredByControls]);


    const visibleBookings =
        tab === "upcoming"
            ? upcomingBookings
            : pastBookings;


    const handleCancel =
        (booking: Booking) => {

            setCancelBooking(
                booking
            );

        };

    const confirmCancel =
    async () => {

        if(!cancelBooking){
            return;
        }


        await cancelMutation.mutateAsync(
            cancelBooking.id
        );


        setCancelBooking(null);

    };
    if (isLoading) {
        return (
            <div className="bookings-page">
                <div className="bookings-header">
                <h1>
                    Мои бронирования
                </h1>
                </div>

                <div className="loading-box">
                    <div className="booking-list">

                    <BookingSkeleton/>
                    <BookingSkeleton/>

                    </div>
                </div>
            </div>
        );
    }


    if (isError) {
        return (
            <div className="bookings-page">
                <div className="error-state">
                <div className="error-icon">
                    !
                </div>

                <h2>
                    Не удалось загрузить данные
                </h2>

                <p>
                    Произошла ошибка при загрузке ваших бронирований
                </p>

                <button
                    type="button"
                    onClick={() => {
                        void refetch();
                    }}
                >
                    Попробовать снова
                </button>
                </div>
            </div>
        );
    }


    return (
        <div className="bookings-page">
            <div className="bookings-header">
                <h1>
                Мои бронирования
                </h1>

                <div className="booking-filters">
                <div className="booking-filter-control">
                    <select
                        aria-label="Фильтр по офису"
                        value={officeFilter}
                        onChange={(event) =>
                            setOfficeFilter(
                            event.target.value
                            )
                        }
                    >
                        <option value="all">
                            Все офисы
                        </option>

                        {offices.map(
                            (office) => (
                                <option
                                    key={office.id}
                                    value={office.id}
                                >
                                    {office.name}
                                </option>
                            )
                        )}
                    </select>

                    <ChevronDown />
                </div>


                <div className="booking-filter-control booking-date-filter">
                    <CalendarIcon />

                    <select
                        aria-label="Фильтр по дате"
                        value={dateFilter}
                        onChange={(event) =>
                            setDateFilter(
                            event.target
                                .value as DateFilter
                            )
                        }
                    >
                        <option value="all">
                            За все время
                        </option>

                        <option value="today">
                            Сегодня
                        </option>

                        <option value="week">
                            На 7 дней
                        </option>

                        <option value="month">
                            На 30 дней
                        </option>
                    </select>

                    <ChevronDown />
                </div>
                </div>
            </div>


            <div className="booking-tabs">
                <button
                type="button"
                className={
                    tab === "upcoming"
                        ? "active"
                        : ""
                }
                onClick={() =>
                    setTab("upcoming")
                }
                >
                Предстоящие ({upcomingBookings.length})
                </button>

                <button
                type="button"
                className={
                    tab === "past"
                        ? "active"
                        : ""
                }
                onClick={() =>
                    setTab("past")
                }
                >
                Прошедшие ({pastBookings.length})
                </button>
            </div>


            {visibleBookings.length === 0 ? (
                <div className="empty-state">
                <div className="empty-icon">
                    <EmptyCalendarIcon />
                </div>

                <h2>
                    Нет бронирований
                </h2>

                <p>
                    {tab === "upcoming"
                        ? "У вас пока нет предстоящих бронирований."
                        : "У вас пока нет прошедших бронирований."}
                </p>

                {tab === "upcoming" && (
                    <>

                        <button
                            type="button"
                            onClick={() =>
                            navigate("/rooms")
                            }
                        >
                            Перейти к переговорным
                        </button>
                    </>
                )}
                </div>
            ) : (
                <div className="booking-list">
                {visibleBookings.map(
                    (booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onCancel={
                                tab === "upcoming"
                                    ? handleCancel
                                    : undefined
                            }
                        />
                    )
                )}
                </div>
                        )}
                        {
            cancelBooking && (

            <CancelBookingDialog

            booking={cancelBooking}

            onClose={() =>
            setCancelBooking(null)
            }

            onConfirm={confirmCancel}

            />

            )
            }
        </div>
    );
}