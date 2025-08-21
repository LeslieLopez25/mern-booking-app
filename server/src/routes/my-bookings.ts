import verifyToken from "../middleware/auth";
import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    const results = hotels.map((hotel) => {
      const userBookings = hotel.bookings
        .filter((booking) => booking.userId === req.userId)
        .sort(
          (a, b) =>
            new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
        );

      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };

      return hotelWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

router.delete(
  "/:hotelId/:bookingId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { hotelId, bookingId } = req.params;

      console.log("HotelId:", hotelId);
      console.log("BookingId:", bookingId);
      console.log("UserId:", req.userId);

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: hotelId,
          "bookings._id": bookingId,
          "bookings.userId": req.userId,
        },
        { $pull: { bookings: { _id: bookingId } } },
        { new: true }
      );

      if (!hotel) {
        return res
          .status(404)
          .json({ message: "Booking not found or not authorized" });
      }

      res.status(200).json({ message: "Booking canceled successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error canceling booking" });
    }
  }
);

export default router;
