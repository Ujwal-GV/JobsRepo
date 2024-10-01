import React, { useEffect, useState } from "react";
import MainContext from "../../components/MainContext";

const SearchFilterPage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <MainContext>
      <div className="w-full flex md:w-[95%] mx-auto lg:w-[80%] h-[150vh] ">
        {windowWidth >= 750 && <div className="w-[30%] fixed h-[600px] bg-gray-300">
        Filter
        </div>}
        <div className="flex  bg-slate-500 w-[70%] me-0">Searched datas</div>
      </div>
    </MainContext>
  );
};

export default SearchFilterPage;
