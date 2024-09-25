import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React from "react";
import Navbar from "../components/Navbar";
import MainContext from "../components/MainContext";
import SeachInput from "../components/SeachInput";
import { FaArrowRight } from "react-icons/fa";
import AdvancedSwiper from "../components/AdvanceSwiper";
// import InfoBox from './InfoBox';

function MainPage() {
  const searchNow = () => {
    alert("Hello");
  };

  const footerStyle = () => {
    "text-black hover:underline p-5";
  };

  return (
    <div className="w-full min-h-screen relative max-w-[1800px] bg-white mx-auto">
      <Navbar />
      <MainContext>
        <div className="h-[600px] w-full bg-slate-50 relative py-10">
          {/* blue bubble */}
          <div className="orange-bubble absolute top-[100px] left-[100px]" /> 
          {/* search input */}
          <div className="w-[250px] mx-auto md:w-[300px] lg:w-[500px]">
            <SeachInput />
          </div>
          {/* prime header  */}
          <div className="mt-10 mx-auto w-fit font-outfit">
             <h1 className="text-center text-xl md:text-5xl font-semibold">Find jobs that matches your</h1>
             <h1 className="mt-6 text-center text-xl md:text-5xl font-semibold text-orange-500">Preferences</h1>
          </div>
          <div className="orangle-circle absolute md:right-16  lg:right-[200px]  top-[200px]"/>
          <div className="blue-circle absolute md:left-16 lg:left-[200px] bottom-[200px] shadow-sm "/>
        </div>
        <div className="bg-white min-h-[500px] w-full px-10 py-5">
           <h1 className="text-2xl font-semibold flex items-center justify-start gap-2"><span>Recomended jobs for you</span> <span><FaArrowRight/></span> </h1>
           <AdvancedSwiper/>
        </div>
      </MainContext>
    </div>
  );
}

export default MainPage;
