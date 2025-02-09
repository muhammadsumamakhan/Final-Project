// import React from "react";

// const RightSideBarFirst = () => {
//   return (
//     <div className="max-w-xs mx-auto p-4 space-y-4">
//       {/* You Might Like Section */}
//       <div className="bg-white p-4 shadow rounded-lg">
//         <div className="flex justify-between items-center mb-2">
//           <h3 className="font-semibold text-gray-800">You might like</h3>
//           <a href="#" className="text-blue-500 text-sm">See all</a>
//         </div>
//         <div className="flex items-center space-x-3">
//           <img
//             src="https://randomuser.me/api/portraits/men/50.jpg"
//             alt="User"
//             className="w-12 h-12 rounded-full"
//           />
//           <div>
//             <h4 className="font-medium text-gray-900">Mohammad Rafil</h4>
//             <p className="text-sm text-gray-500">15 Mutuals</p>
//             <div className="flex -space-x-2 mt-1">
//               <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-6 h-6 rounded-full border-2 border-white" />
//               <img src="https://randomuser.me/api/portraits/women/31.jpg" className="w-6 h-6 rounded-full border-2 border-white" />
//               <img src="https://randomuser.me/api/portraits/men/33.jpg" className="w-6 h-6 rounded-full border-2 border-white" />
//             </div>
//           </div>
//         </div>
//         <div className="flex mt-3 space-x-2">
//           <button className="bg-pink-500 text-white text-sm px-4 py-2 rounded-lg">Follow</button>
//           <button className="bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg">Ignore</button>
//         </div>
//       </div>

//       {/* Upcoming Events Section */}
//       <div className="bg-white p-4 shadow rounded-lg">
//         <div className="flex justify-between items-center mb-2">
//           <h3 className="font-semibold text-gray-800">Upcoming Events</h3>
//           <a href="#" className="text-blue-500 text-sm">See all</a>
//         </div>

//         {/* Event Card */}
//         {[1, 2].map((event, index) => (
//           <div key={index} className="bg-gray-100 p-3 rounded-lg mb-2">
//             <div className="flex items-center space-x-2">
//               <span className="bg-green-500 text-white p-2 rounded-full text-xs">💎</span>
//               <h4 className="font-medium text-gray-900">Design Talks</h4>
//             </div>
//             <p className="text-sm text-gray-500">12 Oct, 13:00 IST</p>
//             <p className="text-sm text-gray-700 mt-1">
//               A General talk about design with Sr Designer of Logitech Michael Spunfik.
//             </p>
//             <div className="flex justify-between items-center mt-2">
//               <div className="flex -space-x-2">
//                 <img src="https://randomuser.me/api/portraits/men/35.jpg" className="w-6 h-6 rounded-full border-2 border-white" />
//                 <img src="https://randomuser.me/api/portraits/women/36.jpg" className="w-6 h-6 rounded-full border-2 border-white" />
//                 <img src="https://randomuser.me/api/portraits/men/37.jpg" className="w-6 h-6 rounded-full border-2 border-white" />
//                 <span className="text-xs text-gray-500 ml-2">+8</span>
//               </div>
//               <p className="text-xs text-gray-600">112 Joined</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RightSideBarFirst;



























import React from "react";
import { FaRegCommentDots } from "react-icons/fa";

const RightSidebar = () => {
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
    <div className="max-w-xs mx-auto p-4 space-y-4 bg-white shadow-md rounded-lg">
      {/* You Might Like */}
      <div className="p-4 border-b">
        <h3 className="text-gray-800 font-semibold mb-3">You might like</h3>
        <div className="flex items-center space-x-3">
          <img src="https://randomuser.me/api/portraits/men/11.jpg" alt="User" className="w-12 h-12 rounded-full" />
          <div>
            <p className="font-medium text-gray-900">Mohammad Rafil</p>
            <p className="text-sm text-gray-500">15 Mutuals</p>
          </div>
        </div>
        <div className="mt-3 flex space-x-2">
          <button className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm">Follow</button>
          <button className="px-4 py-1 border rounded-full text-sm">Ignore</button>
        </div>
      </div>

      {/* Search Stories */}
      {/* <div className="relative">
        <input
          type="text"
          placeholder="Search Stories"
          className="w-full px-4 py-2 border rounded-full bg-gray-100 text-sm focus:outline-none"
        />
      </div> */}

      {/* Stories Section */}
      <div className="flex space-x-4 overflow-x-auto">
        {stories.map((story, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-14 h-14 rounded-full p-1 cursor-pointer ${story.isNew ? 'border-2 border-pink-500' : ''}`}>
              <img src={story.img} alt={story.name} className="w-full h-full rounded-full object-cover" />
            </div>
            <p className="text-xs text-gray-700 mt-1">{story.name}</p>
          </div>
        ))}
      </div>

      {/* Recent Chats */}
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

      {/* Upcoming Events */}
      <div className="p-4 border-t">
        <h3 className="text-gray-800 font-semibold mb-3">Upcoming Events</h3>
        <div className="p-3 bg-gray-100 rounded-lg">
          <h4 className="font-medium">Design Talks</h4>
          <p className="text-sm text-gray-500">12 Oct, 13:00 IST</p>
          <p className="text-xs text-gray-500">A General talk about design with Sr Designer of Logitech Michael Sputnik.</p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;





