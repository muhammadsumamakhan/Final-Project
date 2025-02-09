import React from "react";
import { FaRegCommentDots } from "react-icons/fa";

const RightSideBarSecond = () => {
  const stories = [
    { name: "Add", img: "https://randomuser.me/api/portraits/women/1.jpg", isNew: true },
    { name: "Emilia", img: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "John", img: "https://randomuser.me/api/portraits/men/3.jpg" },
    { name: "George", img: "https://randomuser.me/api/portraits/men/4.jpg" },
  ];

  const chats = [
    { name: "Julia Clarke", location: "New York, USA", img: "https://randomuser.me/api/portraits/women/5.jpg" },
    { name: "Sara Cliene", location: "Sydney, Australia", img: "https://randomuser.me/api/portraits/women/6.jpg" },
    { name: "Amy Ruth", location: "Dubai, UAE", img: "https://randomuser.me/api/portraits/women/7.jpg" },
    { name: "Mark Stefine", location: "Chicago, USA", img: "https://randomuser.me/api/portraits/men/8.jpg" },
    { name: "Trinity Sipson", location: "New York, USA", img: "https://randomuser.me/api/portraits/women/9.jpg" },
    { name: "Albini Vjosa", location: "Tokyo, Japan", img: "https://randomuser.me/api/portraits/women/10.jpg" },
  ];

  return (
    <div className="max-w-xs mx-auto p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search Stories"
          className="w-full px-4 py-2 border rounded-full bg-gray-100 text-sm focus:outline-none"
        />
      </div>

      {/* Stories Section */}
      <div className="flex space-x-4 overflow-x-auto">
        {stories.map((story, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border-2 p-1 cursor-pointer" 
                 style={{ borderColor: story.isNew ? "pink" : "gray" }}>
              <img src={story.img} alt={story.name} className="w-full h-full rounded-full object-cover" />
            </div>
            <p className="text-xs text-gray-700 mt-1">{story.name}</p>
          </div>
        ))}
      </div>

      {/* Recent Chats Section */}
      <div>
        <h3 className="font-semibold text-gray-800">Recent Chats</h3>
        <div className="space-y-3 mt-2">
          {chats.map((chat, index) => (
            <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <div className="flex items-center space-x-3">
                <img src={chat.img} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{chat.name}</h4>
                  <p className="text-xs text-gray-500">{chat.location}</p>
                </div>
              </div>
              <FaRegCommentDots className="text-gray-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSideBarSecond;
