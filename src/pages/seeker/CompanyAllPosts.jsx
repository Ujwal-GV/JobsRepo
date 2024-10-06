import React, { useEffect, useState } from "react";
import MainContext from "../../components/MainContext";
import Select from "react-select";
import { Pagination } from "antd";
import { CiLocationOn } from "react-icons/ci";
import { VerticalBar } from "./CompanyPage";
import { LiaRupeeSignSolid } from "react-icons/lia";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const CustomSkeleton = ({ width = "100%", height = "100%" }) => (
  <Skeleton width={width} height={height} duration={1} />
);

const PostCardSkeleton = () => {
  return (
    <div className="mx-auto w-[95%] md:w-[80%] rounded-lg p-3 md:p-4 h-fit border border-slate-200 mb-2 overflow-hidden">
      <h1 className="w-[90%] overflow-hidden text-ellipsis text-nowrap text-xl font-semibold">
        <CustomSkeleton height="30px" />
      </h1>

      <div>
        <CustomSkeleton height="50px" />
      </div>

      <div className="flex justify-start items-center gap-4 mt-2">
        <CustomSkeleton height="20px" width="60px" />
        <CustomSkeleton height="20px" width="60px" />
        <CustomSkeleton height="20px" width="60px" />
      </div>
    </div>
  );
};

const PostCard = ({ data }) => {

    const {jobTitle,location,skills,salary,experience} = data
  return (
    <div className="mx-auto w-[95%] md:w-[80%] rounded-lg p-3 md:p-4 h-fit border border-slate-300 mb-2 cursor-pointer primary-shadow-hover">
      <h1 className="w-[90%] overflow-hidden text-ellipsis text-nowrap text-xl font-semibold">
        {jobTitle}
      </h1>
      <div className="w-full flex justify-start items-start gap-2 my-3">
        <span className="w-fit"> Skills : </span>
        <div className="flex-1 w-full flex text-wrap overflow-hidden text-ellipsis max-h-9 ">
          {skills}
        </div>
      </div>
      <div className="mt-1 flex flex-row justify-start items-center gap-1 text-gray-500 text-xs md:text-sm">
        <span className="flex center">
          <CiLocationOn /> {location}
        </span>
        <VerticalBar className={"!border-slate-500 h-3 md:h-5"} />
        <span className="flex center">
          <LiaRupeeSignSolid /> {salary}
        </span>
        <VerticalBar className={"!border-slate-500 h-3 md:h-5"} />
        <span className="flex center">Experience:{experience}</span>
      </div>
    </div>
  );
};

const CompanyAllPosts = () => {
  const PostedSections = [" Job Posts", "Freelance Post"];
  const [posttype, setPostType] = useState(0);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gray-100  px-1 md:px-6 lg:px-10 flex flex-col gap-10">
      <div className="bg-white min-h-[calc(100vh-160px)] w-full mt-2  p-2  md:w-[95%] mx-auto md:p-4 lg:w-[80%]">
        {/* Head Section */}

        <div className="flex justify-between items-center md:px-4 border-b border-gray-100 py-2 lg:py-4">
          <span>All Posts</span>
          <span>
            <Select className="w-[150px] md:w-[200px] text-sm p-0" />
          </span>
        </div>

        {/* data Section */}

        <div className="w-full mt-1 flex-col lg:flex-row md:mt-3 flex gap-0 lg:gap-2 justify-center items-start">
          {/* Post Section */}
          <div className="w-full lg:w-[30%] flex flex-row lg:flex-col items-center gap-2 p-4">
            {PostedSections.map((data, idx) => (
              <div
                className={
                  "w-fit lg:w-full text-start mt-3 border-b border-gray-100 cursor-pointer  hover:bg-gray-100 py-3 rounded-md px-4 " +
                  (idx === posttype ? "bg-gray-100" : "")
                }
                onClick={() => setPostType(idx)}
                key={idx}
              >
                {data}
              </div>
            ))}
          </div>

          <div className="w-full lg:w-[70%] ">

            {
                posttype === 0 ?  <JobPostContainer/>  :   <FreelanePostContainer/>
            }

          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAllPosts;

const JobPostContainer = () =>
  {


    const [currentPage, setCurrentPage] = useState(1);
    const [totalDatas, setTotalDatas] = useState(20); // Set total data state
  
    // Fetch Jobs
    const fetchJobs = async ({ queryKey }) => {
      const currentPage = queryKey[1]; // Extract current page
      const res = await axios.get(`http://localhost:8087/jobs/sample/jobs?page=${currentPage}`);
      
      if (res.status !== 200) {
        throw new Error('Failed to fetch jobs data'); // Throw error if response is not OK
      }
      console.log(res.data)
      setTotalDatas(res.data.length); 
      return res.data; 
    };
  
    // Using React Query for fetching and caching jobs
    const { data, isLoading, isError, error } = useQuery({
      queryKey: ["jobs", currentPage], 
      queryFn: fetchJobs,              
      keepPreviousData: true,          
      staleTime: 300000,               
    });
  
    // Handle page change
    const handlePageChange = (val) => {
      setCurrentPage(val);
      window.scrollTo({
        top: 0,
        behavior: "smooth", 
      });
    };
  
    return (
      <>
        {isLoading
          ? [...Array(10)].map((_, index) => <PostCardSkeleton key={index} />) // Show loading skeletons
          : data?.pageData?.map((item, index) => <PostCard key={index} data={item} />)} 
  
        <Pagination
          disabled={isLoading}  // Disable pagination if loading
          defaultCurrent={1}
          current={currentPage}
          className="w-fit mx-auto"
          total={totalDatas}
          showSizeChanger={false}
          pageSize={10}
          onChange={(e) => handlePageChange(e)}
          prevIcon={
            <button
              className="hidden md:flex"
              style={{ border: "none", background: "none" }}
            >
              ← Prev
            </button>
          }
          nextIcon={
            <button
              className="hidden md:flex"
              style={{ border: "none", background: "none" }}
            >
              Next →
            </button>
          }
        />
      </>
    );
  };



const FreelanePostContainer = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalDatas,setTotalDatas] = useState(20);
    const [data,setData] = useState([]);


    const fetchData = async ()=>{
        setLoading(true)
        const res = await axios.get(`http://localhost:8087/jobs/sample/jobs?page=${currentPage}`);
        setLoading(false)
        const {length ,pageData} = res.data;
        setData(pageData)
        setTotalDatas(length)
    }
  
    useEffect(() => {


        fetchData()

    }, [currentPage]);
  
    const handlePageChange = (val) => {
      setCurrentPage(val);
      window.scrollTo({
        top: 0,
        behavior: "smooth", // You can change this to 'auto' if you don't want a smooth scroll
      });
    };
  
    return (
      <>
        {loading
          ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i, j) => <PostCardSkeleton key={j}/>)
          : data.map((i, j) => <PostCard key={j} data={i}/>)}
  
        <Pagination
          disabled={loading}
          defaultCurrent={1}
          current={currentPage}
          className="w-fit mx-auto"
          total={totalDatas}
          showSizeChanger={false}
          pageSize={10}
          onChange={(e) => handlePageChange(e)}
          prevIcon={
            <button
              className="hidden md:flex"
              style={{ border: "none", background: "none" }}
            >
              ← Prev
            </button>
          }
          nextIcon={
            <button
              className="hidden md:flex"
              style={{ border: "none", background: "none" }}
            >
              Next →
            </button>
          }
        />
      </>
    );
  };
