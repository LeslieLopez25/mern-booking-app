import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  hotelId: string;
  pricePerNight: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultCount: search.adultCount ?? 1,
      childCount: search.childCount ?? 0,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSignInClick = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );
    navigate("/sign-in", { state: { from: location } });
  };

  const onSubmit = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );
    navigate(`/hotel/${hotelId}/booking`);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col p-4 sm:p-6 bg-blue-200 rounded-lg shadow-md gap-4">
      <h3 className="text-lg font-bold">${pricePerNight} / night</h3>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
        className="grid grid-cols-1 gap-4"
      >
        {/* Check-in */}
        <DatePicker
          required
          selected={checkIn}
          onChange={(date) => setValue("checkIn", date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in Date"
          className="w-full bg-white p-2 rounded focus:outline-none"
          wrapperClassName="w-full"
        />

        {/* Check-out */}
        <DatePicker
          required
          selected={checkOut}
          onChange={(date) => setValue("checkOut", date as Date)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn || minDate}
          maxDate={maxDate}
          placeholderText="Check-out Date"
          className="w-full bg-white p-2 rounded focus:outline-none"
          wrapperClassName="w-full"
        />

        {/* Guests */}
        <div className="flex flex-col sm:flex-row bg-white px-2 py-2 gap-2 rounded">
          <label className="flex items-center gap-2 flex-1">
            Adults:
            <input
              className="w-full p-1 focus:outline-none font-bold border rounded"
              type="number"
              min={1}
              max={20}
              {...register("adultCount", {
                required: "This field is required",
                min: { value: 1, message: "There must be at least one adult" },
                valueAsNumber: true,
              })}
            />
          </label>
          <label className="flex items-center gap-2 flex-1">
            Children:
            <input
              className="w-full p-1 focus:outline-none font-bold border rounded"
              type="number"
              min={0}
              max={20}
              {...register("childCount", { valueAsNumber: true })}
            />
          </label>
        </div>
        {errors.adultCount && (
          <span className="text-red-500 font-semibold text-sm">
            {errors.adultCount.message}
          </span>
        )}

        {/* Button */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-500 hover:shadow-lg transition duration-200">
          {isLoggedIn ? "Book Now" : "Sign in to Book"}
        </button>
      </form>
    </div>
  );
};

export default GuestInfoForm;
