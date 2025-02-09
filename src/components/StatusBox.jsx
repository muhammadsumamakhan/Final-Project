import React, { useState, useEffect } from "react";
import { FaVideo, FaRegImage, FaRegSmile } from "react-icons/fa";
import { auth, db } from "../config/firebase/config"; // Import Firestore DB
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const StatusBox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [postText, setPostText] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Store uploaded image URL

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Function to open Cloudinary Upload Widget
  const handleImageUpload = () => {
    let myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dnak9yzfk",
        uploadPreset: "exp-hack",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Uploaded Image URL: ", result.info.secure_url);
          setImageUrl(result.info.secure_url); // Save URL in state
        }
      }
    );
    myWidget.open();
  };

  // Function to save post to Firebase Firestore
  const handlePostSubmit = async () => {
    if (!user) {
      alert("Please sign in to post.");
      return;
    }

    try {
      await addDoc(collection(db, "InstaPosts"), {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userProfile: user.photoURL || "",
        text: postText,
        imageUrl: imageUrl, // Save uploaded image URL
        createdAt: serverTimestamp(),
      });
      alert("Post uploaded successfully!");
      setIsModalOpen(false);
      setPostText(""); // Clear text input
      setImageUrl(""); // Reset image
    } catch (error) {
      console.error("Error posting: ", error);
      alert("Failed to post. Try again.");
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      {/* Status Input Box */}
      <div className="flex items-center space-x-3">
        <img
          src={user?.photoURL || "https://randomuser.me/api/portraits/women/44.jpg"}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <input
          type="text"
          placeholder="What's happening?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center mt-3">
        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
          <FaVideo className="text-red-500" />
          <span>Live video</span>
        </button>

        <button
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
          onClick={() => setIsModalOpen(true)}
        >
          <FaRegImage className="text-green-500" />
          <span>Photos</span>
        </button>

        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
          <FaRegSmile className="text-yellow-500" />
          <span>Feeling</span>
        </button>

        <button className="px-4 py-2 bg-pink-500 text-white rounded-full text-sm">
          Post
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Create Post</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-600">
                ✖
              </button>
            </div>
            <textarea
              className="w-full p-2 mt-3 border rounded"
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            ></textarea>

            {/* Cloudinary Upload Button */}
            <button
              onClick={handleImageUpload}
              className="w-full mt-3 bg-gray-500 text-white py-2 rounded"
            >
              Upload Image
            </button>

            {/* Display uploaded image preview */}
            {imageUrl && (
              <img src={imageUrl} alt="Uploaded" className="w-full h-32 object-cover mt-3 rounded" />
            )}

            <button
              onClick={handlePostSubmit}
              className="w-full mt-3 bg-blue-500 text-white py-2 rounded"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusBox;
