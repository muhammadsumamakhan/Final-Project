// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from "../config/firebase/config";

// const Navbar = () => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const navigate = useNavigate();

//   // Check if user is authenticated
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user ? { 
//         name: user.displayName || "User", 
//         photo: user.photoURL || "https://i.ibb.co/DL4Sz9C/user.png" 
//       } : null);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Logout function
//   const logoutUser = async () => {
//     await signOut(auth);
//     navigate("/login");
//   };

//   return (
//     <nav className="w-full bg-white shadow-md flex justify-between items-center px-6 py-4">
//       {/* 📌 Logo */}
//       <h1 className="text-blue-600 text-lg font-bold">
//         <Link to="/">ScrollLink</Link>
//       </h1>

//       {/* 🔍 Search Bar */}
//       <div className="hidden md:block flex-1 mx-4">
//         <input
//           type="text"
//           placeholder="Search something here..."
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       {/* 🧑 User Authentication Section */}
//       {currentUser ? (
//         <div className="flex items-center space-x-4">
//           <img
//             src={currentUser.photo}
//             alt="User Avatar"
//             className="w-10 h-10 rounded-full border border-gray-300"
//           />
//           <span className="text-gray-700 font-medium">{currentUser.name}</span>
//           <button
//             onClick={logoutUser}
//             className="text-red-500 text-sm font-medium hover:underline"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <Link to="/login" className="text-blue-500 font-medium hover:underline">
//           Login
//         </Link>
//       )}
//     </nav>
//   );
// };

// export default Navbar;





import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase/config";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          name: user.displayName || "User",
          photo: user.photoURL || "https://i.ibb.co/DL4Sz9C/user.png",
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false); // Stop loading once Firebase is done checking auth
    });

    return () => unsubscribe();
  }, []);

  // Logout function
  const logoutUser = useCallback(async () => {
    await signOut(auth);
    setCurrentUser(null);
    navigate("/login");
    setMenuOpen(false); // Close menu after logging out
  }, [navigate]);

  return (
    <nav className="w-full bg-white shadow-md flex justify-between items-center px-6 py-4 relative">
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
