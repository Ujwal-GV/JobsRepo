import React from "react";
import notFound from "../assets/images/not-found.png";

const SomethingWentWrong = ({title="",subTitle=""}) => {
  return (
    <div className="w-full h-screen flex center">
      <div className="flex flex-col md:flex-row gap-6 md:gap-5 justify-center w-[70%] mx-auto ">
        <div className="flex flex-col justify-center items-start">
          <h1 className="text-[1.3rem] md:text-[3rem]">{title? title :"Oops"} </h1>
          <h2 className="text-[1rem] md:text-[1.5rem] text-nowrap">{subTitle? subTitle:"Somthing Went Wrong!!"}</h2>
        </div>
        <div className="w-[200px] h-[200px] lg:w-[400px] lg:h-[400px] animate-slow-bounce">
          <img src={notFound} alt="not found" className="astronut-img"  />
        </div>
      </div>
    </div>
  );
};

export default SomethingWentWrong;
