import React, { useRef, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase/config';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const email = useRef();
  const password = useRef();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Function to log in the user
  const loginUser = async (e) => {
    e.preventDefault();

    const userEmail = email.current.value.trim();
    const userPassword = password.current.value;

    // Form validation
    if (!userEmail || !userPassword) {
      toast.error('All fields are required');
      return;
    }

    try {
      const signIn = await signInWithEmailAndPassword(auth, userEmail, userPassword);
      console.log('User logged in:', signIn.user);
      toast.success('Login successful!');
      email.current.value = '';
      password.current.value = '';
  

      // Navigate after a short delay to show the success toast
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Firebase error:', err);
      toast.error('Failed to login. Please check your registration.');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      {/* Header */}
      <div className="w-full h-[70px] flex justify-between items-center bg-white border-b-2 px-4 md:px-16 lg:px-[166px]">
        <h1 className="text-black text-xl md:text-2xl font-bold">Login</h1>
      </div>

      {/* Main Content */}
      <div className="flex justify-center items-center bg-gray-100 h-[calc(100vh-70px)] p-4">
        <form
          onSubmit={loginUser}
          className="w-full sm:w-[90%] md:w-[456px] p-6 md:p-10 lg:p-12 mt-8 bg-white shadow-xl rounded-lg flex flex-col gap-6"
        >
          <input
            type="email"
            placeholder="Email"
            ref={email}
            required
            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
          />

          {/* Password Input with Toggle Visibility */}
          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              ref={password}
              required
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {passwordVisible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-300 w-full max-w-[200px] mx-auto"
          >
            Login
          </button>

          {/* Register Link */}
          <div className="text-center mt-4">
            <p className="text-gray-600">Don't have an account?</p>
            <Link to="/register" className="text-purple-600 hover:underline">
              Register here
            </Link>
          </div>
        </form>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </>
  );
};

export default Login;
