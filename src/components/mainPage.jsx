import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import React from 'react';
// import InfoBox from './InfoBox';

function MainPage() {

    const searchNow = () => {
        alert('Hello');
    }

    const footerStyle = () => {
        "text-black hover:underline p-5"
    }

  return (
    <div className="w-full h-screen flex flex-col m-0">
      
      <div className="w-full flex justify-between items-center bg-[#1E2A5E] p-7">
        <div className="flex items-center">
          <img src="/Logo.png" alt="Logo" className="w-10 h-10 mr-2" />
          <h1 className="text-3xl font-bold text-white">Find Jobs</h1>
        </div>

        <div className="flex-grow mx-4 relative">
        <input
            type="text"
            placeholder="Search...."
            className="w-full p-2 rounded-lg focus:outline-none pr-10" // Add padding to the right for the icon
        />
        <button onClick={searchNow} className="absolute inset-y-0 right-0 flex items-center pr-3">
            <MagnifyingGlassIcon className="h-6 w-6 text-black" />
        </button>
        </div>
        
        <a href="/login">
            <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200">Login</button>
        </a>
      </div>

      <div className="flex-grow flex flex-col justify-between m-10">
        <div className="flex-grow flex flex-col gap-4">
          <div className="flex-grow bg-[#55679C] p-4 flex items-center justify-center">
            <h2 className="text-xl font-bold">Part 1</h2>
          </div>
          <div className="flex-grow bg-[#55679C] p-4 flex items-center justify-center">
            <h2 className="text-xl font-bold">Part 2</h2>
          </div>
          <div className="flex-grow bg-[#55679C] p-4 flex items-center justify-center">
            <h2 className="text-xl font-bold">Part 3</h2>
          </div>
        </div>
      </div>

      <div className="flex justify-around p-4 m-10 gap-2">
        <div className="w-1/4 bg-[#E1D7B7] rounded-lg">
            <div className="text-lg text-white text-center rounded-t-lg p-2 font-bold bg-[#7C93C3]">Special Offers</div>
            <ul className="mt-2">
            <li><a href="#" className={footerStyle}>1</a></li>
            <li><a href="#" className={footerStyle}>2</a></li>
            <li><a href="#" className={footerStyle}>3</a></li>
            </ul>
        </div>

        <div className="w-1/4 bg-[#E1D7B7] rounded-lg">
                <h3 className="text-lg font-bold bg-[#7C93C3] text-white rounded-t-lg text-center p-2">Freelancer</h3>
            <ul className="mt-2">
            <li><a href="#" className={footerStyle}>1</a></li>
            <li><a href="#" className={footerStyle}>2</a></li>
            <li><a href="#" className={footerStyle}>3</a></li>
            </ul>
        </div>

        <div className="w-1/4 bg-[#E1D7B7] rounded-lg p-4">
            <h3 className="text-lg font-bold">News</h3>
            <ul className="mt-2">
            <li><a href="#" className={footerStyle}>1</a></li>
            <li><a href="#" className={footerStyle}>2</a></li>
            <li><a href="#" className={footerStyle}>3</a></li>
            </ul>
        </div>

        <div className="w-1/4 bg-[#E1D7B7] rounded-lg p-4">
            <h3 className="text-lg font-bold">Profile Rating</h3>
            <ul className="mt-2">
            <li><a href="#" className={footerStyle}>1</a></li>
            <li><a href="#" className={footerStyle}>2</a></li>
            <li><a href="#" className={footerStyle}>3</a></li>
            </ul>
        </div>
    </div>

    {/* <div className="flex justify-around bg-[#7C93C3] p-4 m-10">
  <InfoBox 
    title="Special Offers" 
    links={["Offer 1", "Offer 2", "Offer 3"]}
  />
  <InfoBox 
    title="Freelancer" 
    links={["Freelancer 1", "Freelancer 2", "Freelancer 3"]}
  />
  </div> */}

    </div>
  );
}

export default MainPage;
