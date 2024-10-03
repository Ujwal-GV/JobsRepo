import React, { useEffect, useRef, useState } from "react";
import MainContext from "../../components/MainContext";
import { Pagination } from "antd";
import { jobData } from "../../../assets/dummyDatas/Data";
import SearchJobCard from "../../components/SearchJobCard";
import { FaChevronCircleDown } from "react-icons/fa";
import { Checkbox } from "antd";
import { CiFilter } from "react-icons/ci";

const SearchFilterPage = () => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [totalData, setTotalData] = useState(50);
  const [currentPage, setCurrentPage] = useState(50);

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
      <div className="w-full gap-2 bg-slate-50 md:gap-5 flex md:w-[95%] mx-auto lg:w-[80%] min-h-[150vh] flex-col md:flex-row pt-5 md:pt-10 ">
        {/* Search Filter  */}

        <div className="w-[30%] h-fit bg-white primary-shadow py-3 px-2 ms-4">
          <h2 className="mb-4 flex justify-between items-center px-2">
            <span>All Filters</span>
            <span className="relative">
               <span className="absolute w-2 h-2 bg-black rounded-full top-0 right-0 border border-white"/>
              <CiFilter  className="text-xl"/>
            </span>
          </h2>
          <FilterItem />
          <FilterItem />
          <FilterItem />
          <FilterItem />
        </div>

        {/* Search data */}

        <div className="flex w-full  md:w-[70%] me-0 flex-col ">
          <div className="w-[90%] mx-auto gap-2 flex  flex-col px-2  pt-0">
            {jobData.map((data, idx) => (
              <SearchJobCard data={data} key={idx} />
            ))}
          </div>

          <Pagination
            defaultCurrent={1}
            showSizeChanger={false}
            className="w-full center my-3"
            total={60}
            prevIcon={
              <button style={{ border: "none", background: "none" }}>
                ← Prev
              </button>
            }
            nextIcon={
              <button style={{ border: "none", background: "none" }}>
                Next →
              </button>
            }
          />
        </div>
      </div>
    </MainContext>
  );
};

export default SearchFilterPage;

const FilterItem = () => {
  const [maxHeight, setMaxHeight] = useState(0); // State to store maxHeight
  const contentRef = useRef(null);
  const [collapse, setCollapse] = useState(true);


  const [selectedFilter,setSelectedFilter] = useState({});


  const handleFilterChnage =({name,checked})=>{
    
    let upadtedFilter = {...selectedFilter};
    if(!checked)
    {
      delete upadtedFilter[`${name}`]
    }
    else{
        upadtedFilter = {...upadtedFilter ,[`${name}`]:checked}
    }
     setSelectedFilter((prev)=>{return { ...upadtedFilter}})
     
    
  }


  useEffect(()=>{
       if(selectedFilter!==null)
       {
        console.log(selectedFilter)
       }
  },[selectedFilter])

  useEffect(() => {
    if (contentRef.current) {
      if (!collapse) {
        // Set max-height to the actual content height when expanded
        setMaxHeight(contentRef.current.scrollHeight);
      } else {
        // Set max-height to 0 when collapsed
        setMaxHeight(0);
      }
    }
  }, [collapse]);



  return (
    <div className="w-full px-1 border-b border-slate-100 mt-3">
      <h1 className="flex justify-between px-2 font-outfit">
        Location{" "}
        <FaChevronCircleDown
          className={
            "cursor-pointer duration-500 " + (!collapse && "rotate-180")
          }
          onClick={() => setCollapse((prev) => !prev)}
        />{" "}
      </h1>
      <div
        ref={contentRef}
        className="flex justify-start items-start flex-col ms-4"
        style={{
          maxHeight: `${maxHeight}px`, // Dynamically set max-height
          transition: "max-height 0.7s ease-in-out", // Add transition for max-height
          overflow: "hidden",
        }}
      >
        {["Data1", "Data2", "Data3", "Data4"].map((item, idx) => (
          <Checkbox checked={ selectedFilter[`${item}`] !=null ? true :false } className="font-outfit" key={idx} name={item} onChange={(e)=>handleFilterChnage(e.target)}>
            {item}
          </Checkbox>
        ))}
      </div>
    </div>
  );
};
