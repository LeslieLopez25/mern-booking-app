import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">MernHolidays.com</Link>
        </span>
        <span className="flex space-x-3">
          {isLoggedIn ? (
            <>
              <Link
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-500 transition-colors duration-200"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-500 transition-colors duration-200"
                to="/my-hotels"
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors duration-200"
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
