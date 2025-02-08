import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../config/firebase/config';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 


const Register = () => {
  const fullName = useRef();
  const email = useRef();
  const password = useRef();
  const repeatPassword = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRepeatPasswordVisibility = () => setShowRepeatPassword(!showRepeatPassword);

  const registerUser = async (e) => {
    e.preventDefault();

    const userName = fullName.current.value.trim();
    const userEmail = email.current.value.trim();
    const userPassword = password.current.value;
    const confirmPassword = repeatPassword.current.value;

    // Validation checks
    if (userPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (userPassword.length < 6) {
      toast.error("Password should be at least 6 characters long");
      return;
    }

    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharPattern.test(userPassword)) {
      toast.error("Password should include at least one special character");
      return;
    }

    try {
      // Step 1: Create the user with email and password
      const signUp = await createUserWithEmailAndPassword(auth, userEmail, userPassword);

      // Step 2: Update the user's profile with the full name
      await updateProfile(signUp.user, {
        displayName: userName,
      });

      console.log("User registered:", signUp.user);
      toast.success("Registration successful!");

      // Clear the form fields
      fullName.current.value = '';
      email.current.value = '';
      password.current.value = '';
      repeatPassword.current.value = '';
    } catch (err) {
      console.error("Firebase error:", err.message);
      toast.error(err.message || "Failed to register. Please try again.");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="w-full h-[70px] flex items-center justify-between bg-white border-b-2 shadow-md px-6 md:px-16 lg:px-[166px]">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Sign Up</h1>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-70px)] bg-[#F8F9FA] p-4">
        <form
          onSubmit={registerUser}
          className="w-full sm:w-[90%] md:w-[456px] bg-white p-8 md:p-12 rounded-lg shadow-lg flex flex-col gap-6"
        >
          <input
            type="text"
            placeholder="Full Name"
            ref={fullName}
            required
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="email"
            placeholder="Email"
            ref={email}
            required
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              ref={password}
              required
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Repeat Password Field */}
          <div className="relative">
            <input
              type={showRepeatPassword ? 'text' : 'password'}
              placeholder="Repeat Password"
              ref={repeatPassword}
              required
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            />
            <button
              type="button"
              onClick={toggleRepeatPasswordVisibility}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
            >
              {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="bg-purple-600 text-white py-3 rounded-md w-full hover:bg-purple-700 transition duration-200"
          >
            Sign Up
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </>
  );
};

export default Register;

