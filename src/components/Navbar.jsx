import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase/config";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Function to update user profile if displayName or photoURL is missing
  const updateUserProfile = async (user) => {
    if (!user.displayName || !user.photoURL) {
      await updateProfile(user, {
        displayName: "Muhammad Sumama Khan",
        photoURL: "https://res.cloudinary.com/dnak9yzfk/image/upload/v1739359427/wgrvxn785rfnmpngu6vu.jpg",
      });
    }
  };

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await updateUserProfile(user);

        const userData = {
          name: user.displayName || localStorage.getItem("userName") || "User",
          photo: user.photoURL || localStorage.getItem("userPhoto") || "https://i.ibb.co/DL4Sz9C/user.png",
        };

        // Save to localStorage
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userPhoto", userData.photo);

        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Logout function
  const logoutUser = useCallback(async () => {
    await signOut(auth);
    setCurrentUser(null);
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");
    navigate("/login");
    setMenuOpen(false);
  }, [navigate]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md flex justify-between items-center px-6 py-4 z-50">
      {/* 📌 Logo */}
      <h1 className="text-blue-600 text-lg font-bold">
        <Link to="/">ScrollLink</Link>
      </h1>

      {/* 🔍 Search Bar (Hidden on mobile) */}
      <div className="hidden md:block flex-1 mx-4">
        <input
          type="text"
          placeholder="Search something here..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Search"
        />
      </div>

      {/* 🧑 User Authentication Section */}
      {loading ? (
        <span className="text-gray-500">Loading...</span>
      ) : currentUser ? (
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.photo}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
          <span className="text-gray-700 font-medium">{currentUser.name}</span>
          <button
            onClick={logoutUser}
            className="text-red-500 text-sm font-medium hover:underline"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login" className="text-blue-500 font-medium hover:underline">
          Login
        </Link>
      )}

      {/* 🍔 Mobile Menu Toggle */}
      <button
        className="md:hidden text-gray-700 text-xl ml-4"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* 📜 Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-6 bg-white shadow-lg rounded-lg p-4 flex flex-col space-y-4 z-50">
          {currentUser ? (
            <>
              <img
                src={currentUser.photo}
                alt="User Avatar"
                className="w-12 h-12 rounded-full border border-gray-300"
              />
              <span className="text-gray-700 font-medium">{currentUser.name}</span>
              <button
                onClick={logoutUser}
                className="text-red-500 text-sm font-medium hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-blue-500 font-medium hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
