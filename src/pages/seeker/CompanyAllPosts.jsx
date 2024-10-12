import React, { useEffect, useRef, useState } from "react";
import { Pagination } from "antd";
import { CiLocationOn } from "react-icons/ci";
import { VerticalBar } from "./CompanyPage";
import { LiaRupeeSignSolid } from "react-icons/lia";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const CustomSkeleton = ({ width = "100%", height = "100%" }) => (
  <Skeleton width={width} height={height} duration={1} />
);

export const NoPostFound = ({ title }) => {
  return (
    <div className="w-full py-5 flex center">
      {title ? title : "No Post Found"}
    </div>
  );
};

const PostCardSkeleton = ({ className }) => {
  return (
    <div
      className={
        "mx-auto w-[95%] md:w-[80%] rounded-lg p-3 md:p-4 h-fit border border-slate-200 mb-2 overflow-hidden " +
        className
      }
    >
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

const PostCard = ({ data, className }) => {

  const navigate = useNavigate()

  const { title, location, skills, package:salary,description, experience ,job_id  } = data;
  return (
    <div
      className={
        "mx-auto w-[95%] md:w-[80%] rounded-lg p-3 md:p-4 h-fit border border-slate-300 mb-2 cursor-pointer primary-shadow-hover " +
        className
      }
      onClick={()=>navigate(`/user/job-post/${job_id}`)}
    >
      <h1 className="w-[90%] overflow-hidden text-ellipsis text-nowrap text-xl font-semibold">
        {title}
      </h1>
      <div className="w-full flex justify-start items-start gap-2 my-3">
        <span className="w-fit"> Skills : </span>
        <div className="flex-1 w-full flex text-wrap overflow-hidden text-ellipsis max-h-9 ">
          {description}
        </div>
      </div>
      <div className="mt-1 flex flex-row justify-start items-center gap-1 text-gray-500 text-xs md:text-sm">
        <span className="flex center">
          <CiLocationOn /> {location.slice(0,2).join(" , ")}
        </span>
        <VerticalBar className={"!border-slate-500 h-3 md:h-5"} />
        <span className="flex center">
          <LiaRupeeSignSolid /> {!salary.disclosed ? "Not Disclosed" : <>{salary.min} - {salary.max}</> }
        </span>
        <VerticalBar className={"!border-slate-500 h-3 md:h-5"} />
        <span className="flex center">Experience: {experience && <>{experience.min} - {experience.max} yrs</>}</span>
      </div>
    </div>
  );
};

export const JobPostContainer = ({ cardClassname ,companyId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDatas, setTotalDatas] = useState(20); // Set total data state

  // Fetch Jobs
  const fetchJobs = async ({ queryKey }) => {
    const currentPage = queryKey[1]; // Extract current page
    const res = await axios.get(
      `http://localhost:8087/jobs/?provider_details=${companyId}&limit=10&page=${currentPage}`
    );

    if (res.status !== 200) {
      throw new Error("Failed to fetch jobs data"); // Throw error if response is not OK
    }
    setTotalDatas(res.data.searchdatas);
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
        ? [...Array(7)].map((_, index) => (
            <PostCardSkeleton className={cardClassname} key={index} />
          )) // Show loading skeletons
        : data?.pageData?.length >0 ?  data?.pageData?.map((item, index) => (
          <PostCard className={cardClassname} key={index} data={item} />
        )) : <NoPostFound/> }

      {
        data?.length > 10 && <Pagination
        disabled={isLoading} // Disable pagination if loading
        defaultCurrent={1}
        current={currentPage}
        className="w-fit mx-auto"
        total={totalDatas}
        showSizeChanger={false}
        pageSize={10}
        onChange={(e) => handlePageChange(e)}
        prevIcon={
          <button
          disabled={isLoading}
            className={"hidden md:flex "+(totalDatas < 10 &&" !hidden") }
            style={{ border: "none", background: "none" }}
          >
            ← Prev
          </button>
        }
        nextIcon={
          <button
          disabled={isLoading }
            className={"hidden md:flex "+(totalDatas < 10 &&" !hidden")}
            style={{ border: "none", background: "none" }}
          >
            Next →
          </button>
        }
      />
      }
    </>
  );
};

export const FreelanePostContainer = ({ cardClassname }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDatas, setTotalDatas] = useState(20);
  const prevTotal = useRef(totalDatas)

  useEffect(()=>{
    prevTotal.current = totalDatas
  },[totalDatas])

  // Fetch Jobs
  const fetchJobs = async ({ queryKey }) => {
    const currentPage = queryKey[1]; 
    const res = await axios.get(
      `http://localhost:8087/jobs/sample/jobs?page=${currentPage}`
    );

    if (res.status !== 200) {
      throw new Error("Failed to fetch jobs data"); 
    }
    console.log(res.data);
    setTotalDatas(res.data.length);
    return res.data;
  };

  // Using React Query for fetching and caching jobs
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["freeLance", currentPage],
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
      {isLoading ? (
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i, j) => (
          <PostCardSkeleton className={cardClassname} key={j} />
        ))
      ) : data?.pageData?.length > 0 ? (
        data?.pageData?.map((i, j) => (
          <PostCard key={j} className={cardClassname} data={i} />
        ))
      ) : (
        <NoPostFound />
      )}
         
      {
        data?.pageData?.length > 0 && <Pagination
        disabled={isLoading}
        defaultCurrent={1}
        current={currentPage}
        className="w-fit mx-auto"
        total={prevTotal.current}
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
      }
       
    </>
  );
};
