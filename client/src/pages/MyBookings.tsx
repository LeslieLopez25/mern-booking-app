import { useQuery, useMutation, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import * as apiClient from "../api-client";

// Custom countdown hook
const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        setTimeLeft("0d 0h 0m");
        setIsExpired(true);
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

  return { timeLeft, isExpired };
};

const BookingCard = ({ booking, onCancel }: any) => {
  const today = new Date();
  const checkOut = new Date(booking.checkOut);
  const isCompleted = checkOut < today;

  // Set removal to 1 day after checkout
  const removalDate = new Date(checkOut);
  removalDate.setDate(removalDate.getDate() + 1);

  const { timeLeft, isExpired } = useCountdown(removalDate);

  // If expired, hide booking
  if (isCompleted && isExpired) {
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
          <span className="italic text-xs">(Removed in {timeLeft})</span>
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
      {hotels.map((hotel) => {
        // Filter out expired bookings (checkout + 1 day in the past)
        const activeBookings = hotel.bookings.filter((booking: any) => {
          const checkOut = new Date(booking.checkOut);
          const removalDate = new Date(checkOut);
          removalDate.setDate(removalDate.getDate() + 1);
          return removalDate > new Date(); // keep only future or not-yet-expired
        });

        if (activeBookings.length === 0) return null;

        return (
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
              {activeBookings.map((booking: any) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
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
        );
      })}
    </div>
  );
};

export default MyBookings;
