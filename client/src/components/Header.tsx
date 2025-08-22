import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-blue-800 py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <span className="text-2xl sm:text-3xl text-white font-bold tracking-tight">
          <Link to="/">MernHolidays.com</Link>
        </span>

        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className={`w-6 h-6 transition-transform duration-300 ${
              isOpen ? "rotate-90" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <nav className="hidden md:flex space-x-3">
          {isLoggedIn ? (
            <>
              <Link
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-500 transition-colors duration-200"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-500 transition-colors duration-200"
                to="/history"
              >
                History
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
        </nav>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-2 mt-4 px-4 pb-4">
          {isLoggedIn ? (
            <>
              <Link
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-500 transition-colors duration-200"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-500 transition-colors duration-200"
                to="/history"
              >
                History
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-500 transition-colors duration-200"
                to="/my-hotels"
              >
                My Hotels
              </Link>
              <div onClick={() => setIsOpen(false)}>
                <SignOutButton />
              </div>
            </>
          ) : (
            <Link
              onClick={() => setIsOpen(false)}
              to="/sign-in"
              className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
