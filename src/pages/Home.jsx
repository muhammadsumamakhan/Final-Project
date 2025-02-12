import React from 'react';
import LeftSideBar from '../components/LeftSideBar';
import MiddleBar from '../components/MiddleBar'
import RightSideBarFirst from '../components/RightSideBarFirst';


const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex pt-20">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-white shadow-lg p-4 h-screen overflow-y-auto">
        <LeftSideBar />
      </div>

      {/* Middle Content */}
      <div className="w-1/2 p-4">
        <MiddleBar />
      </div>

      {/* Right Sidebar (Fixed Issue by Using Flex-Col) */}
      <div className="w-1/4 flex flex-col space-y-4 p-4">
        <RightSideBarFirst />  
      </div>
    </div>
  );
};

export default Home;
