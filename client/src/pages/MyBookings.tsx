import { useQuery, useMutation, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import * as apiClient from "../api-client";

const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        setTimeLeft("0d 0h 0m");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

const BookingCard = ({ booking, hotel, onCancel }: any) => {
  const today = new Date();
  const checkOut = new Date(booking.checkOut);
  const isCompleted = checkOut < today;

  const removalDate = new Date(checkOut);
  removalDate.setDate(removalDate.getDate() + 1);

  const countdown = useCountdown(removalDate);

  if (isCompleted && countdown === "0d 0h 0m") {
    return null;
  }

  return (
    <div
      key={booking._id}
      className={`p-3 rounded-md ${
        isCompleted ? "bg-gray-100 opacity-70" : "bg-white"
      }`}
    >
      <div>
        <span className="font-bold mr-2">Dates: </span>
        <span>
          {new Date(booking.checkIn).toDateString()} -{" "}
          {new Date(booking.checkOut).toDateString()}
        </span>
      </div>
      <div>
        <span className="font-bold mr-2">Guests:</span>
        <span>
          {booking.adultCount} adults, {booking.childCount} children
        </span>
      </div>

      {isCompleted ? (
        <div className="mt-2 text-sm font-semibold text-gray-500">
          ✅ Completed <br />
          <span className="italic text-xs">(Removed in {countdown})</span>
        </div>
      ) : (
        <button
          onClick={() => onCancel(booking._id)}
          className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Cancel Reservation
        </button>
      )}
    </div>
  );
};

const MyBookings = () => {
  const queryClient = useQueryClient();

  const { data: hotels } = useQuery(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );

  const cancelBookingMutation = useMutation(
    ({ hotelId, bookingId }: { hotelId: string; bookingId: string }) =>
      apiClient.cancelBooking(hotelId, bookingId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("fetchMyBookings");
      },
    }
  );

  if (!hotels || hotels.length === 0) {
    return <span>No bookings found</span>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      {hotels.map((hotel) => (
        <div
          key={hotel._id}
          className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5"
        >
          <div className="lg:w-full lg:h-[250px]">
            <img
              src={hotel.imageUrls[0]}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            <div className="text-2xl font-bold">
              {hotel.name}
              <div className="text-xs font-normal">
                {hotel.city}, {hotel.country}
              </div>
            </div>
            {hotel.bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                hotel={hotel}
                onCancel={(bookingId: string) =>
                  cancelBookingMutation.mutate({
                    hotelId: hotel._id,
                    bookingId,
                  })
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
