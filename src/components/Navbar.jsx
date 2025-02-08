import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase/config';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Observe user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update current user
    });
    return () => unsubscribe(); // Clean up observer
  }, []);

  // Logout function
  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        setCurrentUser(null);
        navigate('/'); // Redirect to login page
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <nav className="w-full h-[60px] bg-[#7749F8] flex justify-between items-center px-4 md:px-16 lg:px-[166px] shadow-md relative z-50">
      {/* Brand Logo */}
      <h1 className="text-white text-lg font-bold">
        <Link to="/">MSK</Link>
      </h1>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white focus:outline-none"
        >
          {isMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center ml-auto space-x-6 ">
        {currentUser ? (
          <div className="relative">
            {/* User Icon and Dropdown */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-white hover:text-gray-200 transition"
            >
              <img
                src={currentUser.photoURL || "https://i.ibb.co/yVJBYFG/businessman-character-avatar-isolated-24877-60111.jpg"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span className="font-medium">{currentUser.displayName || "User"}</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <Link
                  to="/"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Home
                </Link>
                <button
                  onClick={() => {
                    logoutUser();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="text-white hover:text-gray-200 transition duration-200"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-[60px] left-0 right-0 bg-[#7749F8] p-6 transform transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
          } md:hidden`}
        style={{ visibility: isMenuOpen ? 'visible' : 'hidden' }}
      >
        {currentUser ? (
          <>
            <Link
              to="/"
              className="block text-white py-2 hover:text-gray-200 transition duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <button
              onClick={() => {
                logoutUser();
                setIsMenuOpen(false);
              }}
              className="block text-white py-2 hover:text-gray-200 transition duration-200"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="block text-white py-2 hover:text-gray-200 transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
