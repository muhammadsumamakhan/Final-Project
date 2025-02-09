import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase/config";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const fullName = useRef();
  const email = useRef();
  const password = useRef();
  const repeatPassword = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); 

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRepeatPasswordVisibility = () =>
    setShowRepeatPassword(!showRepeatPassword);

  // Cloudinary Upload Widget Function
  const openUploadWidget = () => {
    if (!window.cloudinary) {
      toast.error("Cloudinary is not loaded yet. Try again later.");
      return;
    }
    let myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dnak9yzfk",
        uploadPreset: "exp-hack",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Upload Success:", result.info);
          setImageUrl(result.info.secure_url);
          toast.success("Image uploaded successfully!");
        } else if (error) {
          console.error("Upload Error:", error);
          toast.error("Image upload failed!");
        }
      }
    );
    myWidget.open();
  };

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

    const passwordPattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordPattern.test(userPassword)) {
      toast.error(
        "Password must be at least 6 characters, contain 1 uppercase letter, 1 number, and 1 special character."
      );
      return;
    }

    if (!imageUrl) {
      toast.warning("Please upload a profile image.");
      return;
    }

    try {
      // Firebase Authentication (Signup)
      const signUp = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      );

      // Update Firebase User Profile
      await updateProfile(signUp.user, {
        displayName: userName,
        photoURL: imageUrl,
      });

      // Store user in Firestore (Collection: "users")
      await addDoc(collection(db, "InstaUsers"), {
        fullName: userName,
        email: userEmail,
        photoURL: imageUrl,
        createdAt: new Date(),
      });

      toast.success("Registration successful!");
      fullName.current.value = "";
      email.current.value = "";
      password.current.value = "";
      repeatPassword.current.value = "";
      setImageUrl("");
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

          {/* Image Upload Button */}
          <button
            type="button"
            onClick={openUploadWidget}
            className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 transition duration-200"
          >
            Upload Profile Image
          </button>

          {/* Display Uploaded Image */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded Profile"
              className="w-32 h-32 mx-auto rounded-full mt-4"
            />
          )}

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
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
              type={showRepeatPassword ? "text" : "password"}
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
            Already have an account?{" "}
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
