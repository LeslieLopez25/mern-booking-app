import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="bg-blue-800 py-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4">
        {/* Logo / Brand */}
        <span className="text-2xl sm:text-3xl text-white font-bold tracking-tight flex-shrink-0">
          <Link to="/">MernHolidays.com</Link>
        </span>

        {/* Nav Buttons */}
        <span className="flex flex-wrap justify-center sm:justify-end gap-2">
          {isLoggedIn ? (
            <>
              <Link
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-full font-bold hover:bg-blue-500 transition-colors duration-200 text-sm sm:text-base"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-full font-bold hover:bg-blue-500 transition-colors duration-200 text-sm sm:text-base"
                to="/my-hotels"
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
