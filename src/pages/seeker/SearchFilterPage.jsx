import React, { useEffect, useRef, useState } from "react";
import MainContext from "../../components/MainContext";
import { Pagination } from "antd";
import { jobData } from "../../../assets/dummyDatas/Data";
import SearchJobCard from "../../components/SearchJobCard";
import { FaChevronCircleDown } from "react-icons/fa";
import { Checkbox } from "antd";
import { CiFilter } from "react-icons/ci";
import { Popover } from "antd";

const SearchFilterPage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [totalData, setTotalData] = useState(50);
  const [currentPage, setCurrentPage] = useState(50);
  const [locationFilter, setLocationFilter] = useState({});
  const [workType, setWorkType] = useState({});

  // All About Filters

  const indianCities = [
    "Visakhapatnam",
    "Vijayawada",
    "Tirupati",
    "Nellore",
    "Kakinada",
    "Guwahati",

    "Patna",
    "Muzaffarpur",
    "Raipur",

    // Goa
    "Panaji",

    // Gujarat
    "Ahmedabad",
    "Surat",
    "Rajkot",

    // Haryana
    "Chandigarh",
    "Gurgaon (Gurugram)",

    // Himachal Pradesh
    "Shimla",
    "Dharamshala",
    "Ranchi",
    "Jamshedpur",
    "Bangalore (Bengaluru)",
    "Mysore (Mysuru)",
    "Hubli-Dharwad",
    "Mangalore",
    "Thiruvananthapuram",
    "Kochi (Cochin)",
    "Kozhikode (Calicut)",
    "Malappuram",
    "Bhopal",
    "Indore",
    "Mumbai",
    "Pune",
    "Nagpur",
    "Cuttack",
    "Chandigarh",
    "Amritsar",
    "Jaipur",
    "Udaipur",
    "Jodhpur",
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Hyderabad",
    "Warangal",
    "Agartala",
    "Lucknow",
    "Kanpur",
    "Varanasi",
    "Agra",
    "Dehradun",
    "Haridwar",
    "Nainital",

    "Kolkata",
    "Siliguri",
    "Howrah",
    "Durgapur",

    "Delhi",
    "Puducherry",
    "Jammu",
    "Srinagar",
  ];

  const handleLocationFilter = (val) => {
    setLocationFilter((prev) => {
      return { ...val };
    });
  };

  const handleWorkTypeFilter = (val) => {
    setLocationFilter((prev) => {
      return { ...val };
    });
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // You can change this to 'auto' if you don't want a smooth scroll
    });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <MainContext>
      <div className="w-full gap-2 bg-slate-50 lg:gap-5 flex md:w-[95%] mx-auto lg:w-[80%] min-h-[150vh] flex-col md:flex-row pt-5 md:pt-10 ">
        {/* Search Filter  */}

        <div className="w-[30%] hidden md:block h-fit bg-white primary-shadow py-3 px-2 ms-4">
          <h2 className="mb-4 flex justify-between items-center px-2">
            <span>All Filters</span>
            <span className="relative">
              <span className="absolute w-2 h-2 bg-black rounded-full top-0 right-0 border border-white" />
              <CiFilter
                className="text-xl"
                onClick={() => console.log(locationFilter)}
              />
            </span>
          </h2>
          <FilterItem
            title={"Location"}
            data={indianCities}
            key={"location"}
            maxData={10}
            onChange={handleLocationFilter}
          />
          <FilterItem
            title={"Employeement Type"}
            data={["Full Time", "Part Time", "Hybrid"]}
            key={"emp_type"}
            onChange={handleWorkTypeFilter}
          />
        </div>

        <div className="flex lg:hidden justify-start items-center">
           <h5 className="mr-2 text-sm lg:text-xl">All Filters</h5>
           <div className="max-w-full overflow-x-auto flex justify-start items-center flex-nowrap bg-orange-300   h-10">
          <span className="mx-1 flex-shrink-0 w-fit h-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
          <span className="mx-1 flex-shrink-0 w-fit bg-green-500">
            Location
          </span>
        </div>
        </div>

        {/* Search data */}

        <div className="flex w-full  md:w-[70%] me-0 flex-col ">
          <div className="w-[95%] mx-auto gap-2 flex  flex-col px-2  pt-0">
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

const FilterItem = ({ title, data = [], onChange = () => {}, maxData = 4 }) => {
  const [maxHeight, setMaxHeight] = useState(0); // State to store maxHeight
  const contentRef = useRef(null);
  const [collapse, setCollapse] = useState(true);

  const [selectedFilter, setSelectedFilter] = useState({});

  const handleFilterChnage = ({ name, checked }) => {
    let upadtedFilter = { ...selectedFilter };
    if (!checked) {
      delete upadtedFilter[`${name}`];
    } else {
      upadtedFilter = { ...upadtedFilter, [`${name}`]: checked };
    }
    setSelectedFilter((prev) => {
      return { ...upadtedFilter };
    });
  };

  useEffect(() => {
    if (selectedFilter !== null) {
      onChange(selectedFilter);
    }
  }, [selectedFilter]);

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
        {title}
        {data.length > 0 && (
          <FaChevronCircleDown
            className={
              "cursor-pointer duration-500 " + (!collapse && "rotate-180")
            }
            onClick={() => setCollapse((prev) => !prev)}
          />
        )}
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
        {data.slice(0, maxData).map((item, idx) => (
          <Checkbox
            checked={selectedFilter[`${item}`] != null ? true : false}
            className="font-outfit"
            key={idx}
            name={item}
            onChange={(e) => handleFilterChnage(e.target)}
          >
            {item}
          </Checkbox>
        ))}

        {data.length > maxData && (
          <p className="text-sm text-end cursor-pointer w-full">
            <Popover
              placement="rightTop"
              content={
                <FilterMorePopOverContent
                  data={data}
                  onChange={handleFilterChnage}
                  selectedFilter={selectedFilter}
                />
              }
              trigger={"click"}
            >
              <button>View more+</button>
            </Popover>
          </p>
        )}
      </div>
    </div>
  );
};

const FilterMorePopOverContent = ({ data, onChange, selectedFilter }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((d, idx) => (
        <Checkbox
          className="font-outfit max-w-fit"
          checked={selectedFilter[`${d}`] != null ? true : false}
          key={idx}
          name={d}
          onChange={(e) => onChange(e.target)}
        >
          {d}
        </Checkbox>
      ))}
    </div>
  );
};
