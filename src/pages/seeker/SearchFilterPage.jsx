import React, { useEffect, useRef, useState } from "react";
import MainContext from "../../components/MainContext";
import { Pagination } from "antd";
import { jobData } from "../../../assets/dummyDatas/Data";
import SearchJobCard, {
  SearchJobCardSkeleton,
} from "../../components/SearchJobCard";
import { FaChevronCircleDown } from "react-icons/fa";
import { Checkbox } from "antd";
import { CiFilter } from "react-icons/ci";
import { Popover, Drawer } from "antd";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../Loading";
import { NoPostFound } from "./CompanyPage";

const SearchFilterPage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // All About Filters
  const [allFilters, setAllFilters] = useState({});

  const [locationFilter, setLocationFilter] = useState({});
  const [workTypeFilter, setWorkTypeFilter] = useState({});

  const [openLocationDrawer, setLocationDrawer] = useState(false);
  const [openWorkTypeDrawer, setWorkTypeDrawer] = useState(false);

  const handleDrawerClose = () => {
    setLocationDrawer(false);
    setWorkTypeDrawer(false);
  };

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
  ];

  const workTypes = ["Full Time", "Part Time", "Hybrid"];

  const handleLocationFilter = (val) => {
    setLocationFilter((prev) => {
      return { ...val };
    });
    setAllFilters((prev) => {
      return { ...prev, location: val };
    });
  };

  const handleWorkTypeFilter = (val) => {
    console.log(val);
    setWorkTypeFilter((prev) => {
      return { ...val };
    });
    setAllFilters((prev) => {
      return { ...prev, work_type: val };
    });
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const queryClient = useQueryClient()

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // You can change this to 'auto' if you don't want a smooth scroll
    });
    return () => {
      window.removeEventListener("resize", handleResize);
      queryClient.removeQueries(["search"]);
    };
  }, [queryClient]);

  //Api request

  const [totalData, setTotalData] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [firstLoading, setFirstLoading] = useState(true);
  const [pageSize,setPageSize]= useState(5);

  const fetchSearchData = async () => {
    if (firstLoading) {
      setFirstLoading(false);
    }
    const res = await axios.get(
      `http://localhost:8087/jobs?page=${currentPage}&limit=${pageSize}&type=${Object.keys(workTypeFilter).join(",")}&location=${Object.keys(locationFilter).join(",")}`
    );
    console.log(res.data.pageData)
    setTotalData(res.data.searchdatas);
    return res.data.pageData;
  };

  const { data, isLoading: searchLoading ,refetch } = useQuery({
    queryKey: ["search", currentPage],
    queryFn: fetchSearchData,
    keepPreviousData: true,
    staleTime: 5000, 
    cacheTime: 5000, 
    onError: () => {
      toast.error("Something went wrong while fetching jobs");
    },
  });


  const handlePageChange = (val) => {
    setCurrentPage(val);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSearchApplyButton=()=>{
    queryClient.removeQueries(["search"]);
     refetch();
  }

  return (
    <MainContext>
      <div className="w-full gap-2 bg-slate-50 lg:gap-5 flex md:w-[95%] mx-auto lg:w-[80%] h-fit pb-10 flex-col md:flex-row pt-5 md:pt-10 ">
        {/* Search Filter  */}

        <div className="w-[30%] hidden md:block h-fit bg-white primary-shadow py-3 px-2 ms-4">
          <h2 className="mb-4 flex justify-between items-center px-2">
            <span>All Filters</span>
            <span className="relative">
              <span className="absolute w-2 h-2 bg-black rounded-full top-0 right-0 border border-white" />
              <CiFilter
                className="text-xl"
                onClick={() => console.log(JSON.stringify(allFilters))}
              />
            </span>
          </h2>
          <FilterItem
            title={"Location"}
            data={indianCities}
            defaultSelect={locationFilter}
            key={"location"}
            maxData={10}
            onChange={handleLocationFilter}
            onApplyClick={handleSearchApplyButton}
          />
          <FilterItem
            title={"Employeement Type"}
            data={workTypes}
            key={"emp_type"}
            onChange={handleWorkTypeFilter}
            defaultSelect={workTypeFilter}
            onApplyClick={handleSearchApplyButton}
          />
        </div>

        <div className="flex md:hidden justify-start items-center px-1 bg-white ">
          <h5 className="mr-2 text-sm lg:text-xl text-nowrap">All Filters</h5>
          <div className="max-w-full overflow-x-auto flex justify-start items-center flex-nowrap custom-scroll-nowidth  h-10">
            <span
              className="mx-1 flex-shrink-0 w-fit h-fit bg-gray-200 px-2 py-1 rounded-full text-sm"
              onClick={() => setLocationDrawer(true)}
            >
              Location
            </span>
            <span
              className="mx-1 flex-shrink-0 w-fit h-fit bg-gray-200 px-2 py-1 rounded-full text-sm"
              onClick={() => setWorkTypeDrawer(true)}
            >
              Work Type
            </span>
          </div>
        </div>

        {/* Search data */}

        <div className="flex w-full  md:w-[70%] me-0 flex-col ">
          <div className="w-[95%] mx-auto gap-2 flex  flex-col px-2  pt-0">
            <h4 className="lg:ps-24">Search Results :</h4>
            {searchLoading
              ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d, idx) => (
                  <SearchJobCardSkeleton key={idx} />
                ))
              : data.map((d, idx) => <SearchJobCard data={d} key={idx} />)}
          </div>

          {
            (data?.length > 0)  ?
            <Pagination
              disabled={searchLoading} // Disable pagination if loading
              defaultCurrent={1}
              current={currentPage}
              className="w-fit mx-auto mb-5 mt-3"
              total={totalData}
              showSizeChanger={false}
              pageSize={pageSize}
              onChange={(e) => handlePageChange(e)}
              prevIcon={
                <button
                  disabled={searchLoading}
                  className={
                    "hidden md:flex " + (totalData < pageSize && " !hidden")
                  }
                  style={{ border: "none", background: "none" }}
                >
                  ← Prev
                </button>
              }
              nextIcon={
                <button
                  disabled={searchLoading}
                  className={
                    "hidden md:flex " + (totalData < pageSize && " !hidden")
                  }
                  style={{ border: "none", background: "none" }}
                >
                  Next →
                </button>
              }
            /> : (!searchLoading ? <NoPostFound/> :<></>)
          }
        </div>
      </div>

      <Drawer
        id="location-drawer"
        open={openLocationDrawer}
        title={
          <div className="w-full flex justify-between items-center px-2">
            <span>Location</span>{" "}
            <span onClick={() => alert(JSON.stringify(locationFilter))}>
              Apply
            </span>
          </div>
        }
        onClose={handleDrawerClose}
        placement="bottom"
      >
        <div className="w-full grid grid-cols-2 gap-1">
          {indianCities.map((d, idx) => (
            <Checkbox
              key={idx}
              className="font-outfit max-w-fit"
              checked={
                locationFilter[`${d}`] === null
                  ? false
                  : locationFilter[`${d}`]
                  ? true
                  : false
              }
              name={d}
              onChange={(e) => {
                const { name, checked } = e.target;
                let updatedFilter = { ...locationFilter };
                if (!checked) {
                  delete updatedFilter[`${name}`];
                } else {
                  updatedFilter = { ...updatedFilter, [`${name}`]: checked };
                }
                console.log(updatedFilter);
                handleLocationFilter(updatedFilter);
              }}
            >
              {d}
            </Checkbox>
          ))}
        </div>
      </Drawer>

      <Drawer
        id="workType-drawer"
        open={openWorkTypeDrawer}
        title={
          <div className="w-full flex justify-between items-center px-2">
            <span>Work Type</span>{" "}
            <span onClick={() => alert(JSON.stringify(workType))}>Apply</span>
          </div>
        }
        height={"40vh"}
        onClose={handleDrawerClose}
        placement="bottom"
      >
        <div className="w-full grid grid-cols-2 gap-1">
          <div className="w-full grid grid-cols-2 gap-1">
            {workTypes.map((d, idx) => (
              <Checkbox
                className="font-outfit max-w-fit"
                key={idx}
                checked={
                  workTypeFilter[`${d}`] === null
                    ? false
                    : workTypeFilter[`${d}`]
                    ? true
                    : false
                }
                name={d}
                onChange={(e) => {
                  const { name, checked } = e.target;
                  let updatedFilter = { ...workTypeFilter };
                  if (!checked) {
                    delete updatedFilter[`${name}`];
                  } else {
                    updatedFilter = { ...updatedFilter, [`${name}`]: checked };
                  }
                  console.log(updatedFilter);
                  handleWorkTypeFilter(updatedFilter);
                }}
              >
                {d}
              </Checkbox>
            ))}
          </div>
        </div>
      </Drawer>
    </MainContext>
  );
};

export default SearchFilterPage;

const FilterItem = ({
  title,
  data = [],
  onChange = () => {},
  maxData = 4,
  defaultSelect,
  onApplyClick=()=>{}
}) => {
  const [maxHeight, setMaxHeight] = useState(0); // State to store maxHeight
  const contentRef = useRef(null);
  const [collapse, setCollapse] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(defaultSelect);

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
      <h1 className="flex justify-between px-2 font-outfit font-light">
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
            checked={
              defaultSelect[`${item}`] === null
                ? false
                : defaultSelect[`${item}`]
                ? true
                : false
            }
            className="font-outfit"
            key={idx}
            name={item}
            onChange={(e) => handleFilterChnage(e.target)}
          >
            {item}
          </Checkbox>
        ))}
         
        {data.length > maxData && (
          <p className="text-sm flex justify-between items-center cursor-pointer w-full">
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
        <div className="mt-1 flex justify-end pe-1 items-center w-full mb-2 text-sm"><button onClick={onApplyClick}>Apply</button></div>
      </div>
    </div>
  );
};

const FilterMorePopOverContent = ({ data, onChange, selectedFilter }) => {
  return (
    <>
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
      <div className="w-full flex justify-end items-center mt-1">
        <button className="px-2 py-1 bg-slate-200 rounded-full">Apply</button>
      </div>
    </>
  );
};
