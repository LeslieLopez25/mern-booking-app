import { useEffect, useState } from "react";
import * as apiClient from "../api-client";
import { HotelType } from "../../../server/src/shared/types";

const History = () => {
  const [bookings, setBookings] = useState<HotelType[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiClient.fetchPastBookings();
        setBookings(response);
      } catch (err) {
        console.error("Failed to fetch past bookings", err);
      }
    };
    fetchBookings();
  }, []);

  const sortedBookings = bookings
    .flatMap((hotel) => hotel.bookings.map((booking) => ({ hotel, booking })))
    .sort(
      (a, b) =>
        new Date(b.booking.checkIn).getTime() -
        new Date(a.booking.checkIn).getTime()
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">History</h1>
      {sortedBookings.length === 0 ? (
        <p className="text-center text-gray-500">No past bookings found</p>
      ) : (
        <div className="grid gap-6">
          {sortedBookings.map(({ booking, hotel }) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              hotel={hotel}
              past={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BookingCard = ({
  booking,
  hotel,
}: {
  booking: HotelType["bookings"][0];
  hotel: HotelType;
  past?: boolean;
}) => {
  const checkIn = new Date(booking.checkIn).toLocaleDateString();
  const checkOut = new Date(booking.checkOut).toLocaleDateString();

  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/3 h-40">
          <img
            src={hotel.imageUrls[0]}
            alt={hotel.name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold">{hotel.name}</h2>
            <p className="text-sm text-gray-600">
              {hotel.city}, {hotel.country}
            </p>
          </div>

          <div className="mt-2">
            <p className="text-gray-700">
              <span className="font-medium">Check-in:</span> {checkIn}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Check-out:</span> {checkOut}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Adults:</span> {booking.adultCount}{" "}
              <span className="font-medium">Children:</span>{" "}
              {booking.childCount}
            </p>
          </div>

          <div className="mt-3 text-sm text-gray-500 italic">
            Past booking (completed)
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
