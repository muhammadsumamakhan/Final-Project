import React from "react";
import { FaRegSmile, FaRegImage, FaVideo, FaRegComment, FaRegHeart, FaShare } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import StatusBox from "./StatusBox";
import InstaPost from "./InstaPosts";

const MiddleBar = () => {
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Status Input Box */}
      <StatusBox/>
      {/* InstaPosts Box */}
      <InstaPost />

      
    </div>
  );
};

export default MiddleBar;
