import React, { useEffect, useRef, useState } from "react";
import { Pagination } from "antd";
import { CiLocationOn } from "react-icons/ci";
import { VerticalBar } from "./CompanyPage";
import { LiaRupeeSignSolid } from "react-icons/lia";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import ReadMore from "../../components/ReadMore";

export const CustomSkeleton = ({ width = "100%", height = "100%" }) => (
  <Skeleton width={width} height={height} duration={1}  className="rounded-lg"/>
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
  const navigate = useNavigate();

  const {
    title,
    location,
    must_skills,
    other_skills, 
    package: salary,
    description,
    experience,
    job_id,
  } = data;


  const skills= new Set();

  must_skills.forEach(element => {
    skills.add(element)
  });
  other_skills.forEach(element => {
    skills.add(element)
  });
  

  return (
    <div
      className={
        "mx-auto w-[95%] md:w-[80%] rounded-lg p-3 md:p-4 h-fit border border-slate-300 mb-2 cursor-pointer primary-shadow-hover " +
        className
      }
      onClick={() => navigate(`/user/job-post/${job_id}`)}
    >
      <h1 className="w-[90%] overflow-hidden text-ellipsis text-nowrap text-xl font-semibold">
        {title}
      </h1>
      <div className="w-full flex justify-start items-start gap-2 my-3">
        <span className="w-fit block"> Skills : </span>
        <div className="flex-1 w-full flex text-wrap overflow-hidden text-ellipsis max-h-9 ">
          {
            [...skills].join(" , ")
          }
        </div>
      </div>
      <div className="mt-1 flex flex-row justify-start items-center gap-1 text-gray-500 text-xs md:text-sm">
        <span className="flex center">
          <CiLocationOn /> {location?.slice(0, 2).join(" , ")}
        </span>
        <VerticalBar className={"!border-slate-500 h-3 md:h-5"} />
        <span className="flex center">
          <LiaRupeeSignSolid />{" "}
          {!salary.disclosed ? (
            "Not Disclosed"
          ) : (
            <>
              {salary.min} - {salary.max}
            </>
          )}
        </span>
        <VerticalBar className={"!border-slate-500 h-3 md:h-5"} />
        <span className="flex center">
          Experience:{" "}
          {experience && (
            <>
              {experience.min} - {experience.max} yrs
            </>
          )}
        </span>
      </div>
    </div>
  );
};

const ProjectCard = ({ data, className }) => {
  const navigate = useNavigate();

  const { name, description, cost } = data;
  return (
    <div
      className={
        "mx-auto w-[95%] md:w-[80%] rounded-lg p-3 md:p-4 h-fit border border-slate-300 mb-2 cursor-pointer primary-shadow-hover " +
        className
      }
      onClick={() => navigate(`/user/job-post/${job_id}`)}
    >
      <h1 className="w-[90%] overflow-hidden text-ellipsis text-nowrap text-xl font-semibold">
        {name}
      </h1>
      <div className="w-full flex justify-start items-start gap-2 my-3">
        <div className="flex-1 w-full flex text-wrap overflow-hidden text-ellipsis max-h-9 ">
          {description && <ReadMore content={description} maxLength={200} />}
        </div>
      </div>
      <div className="mt-1 flex flex-row justify-start items-center gap-1 text-gray-500 text-xs md:text-sm">
        <span className="flex center">
          {cost?.amount ? (
            <span className="flex center gap-[1px]">
              <LiaRupeeSignSolid /> {cost?.amount}
            </span>
          ) : (
            <></>
          )}
        </span>
      </div>
    </div>
  );
};

export const JobPostContainer = ({ cardClassname, companyId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDatas, setTotalDatas] = useState(20); // Set total data state

  // Fetch Jobs
  const fetchJobs = async ({ queryKey }) => {
    const currentPage = queryKey[1]; // Extract current page
    const res = await axiosInstance(`/jobs/?provider_details=${companyId}&limit=10&page=${currentPage}`);
    setTotalDatas(res.data.searchdatas);
    return res.data;
  };

  // Using React Query for fetching and caching jobs
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jobs", currentPage, companyId],
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
        [...Array(5)].map((_, index) => (
          <PostCardSkeleton className={cardClassname} key={index} />
        )) // Show loading skeletons
      ) : data?.pageData?.length > 0 ? (
        data?.pageData?.map((item, index) => (
          <PostCard className={cardClassname} key={index} data={item} />
        ))
      ) : (
        <NoPostFound />
      )}

      {data?.length > 10 && (
        <Pagination
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
              className={"hidden md:flex " + (currentPage == 1  && " !hidden")}
              style={{ border: "none", background: "none" }}
            >
              ← Prev
            </button>
          }
          nextIcon={
            <button
              disabled={isLoading}
              className={"hidden md:flex " + (currentPage >= Math.ceil(totalDatas / pageSize) && " !hidden")}
              style={{ border: "none", background: "none" }}
            >
              Next →
            </button>
          }
        />
      )}
    </>
  );
};

export const FreelanePostContainer = ({ cardClassname, companyId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDatas, setTotalDatas] = useState(20);

  // Fetch Jobs
  const fetchJobs = async () => {
    const res = await axiosInstance.get(`/projects/?providerId=${companyId}&page=1&limit=10`);
    if (res.data) {
      setTotalDatas(res.data.totalResults);
    }
    return res.data.pageData;
  };

  // Using React Query for fetching and caching jobs
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["freeLance", currentPage, companyId],
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
        [...Array(5)].map((i, j) => (
          <PostCardSkeleton className={cardClassname} key={j} />
        ))
      ) : data?.length > 0 ? (
        data?.map((i, j) => (
          <ProjectCard key={j} className={cardClassname} data={i} />
        ))
      ) : (
        <NoPostFound />
      )}

      {data?.length > 0 && (
        <Pagination
          disabled={isLoading}
          defaultCurrent={1}
          current={currentPage}
          className="w-fit mx-auto"
          total={totalDatas}
          showSizeChanger={false}
          pageSize={10}
          onChange={(e) => handlePageChange(e)}
          prevIcon={
            <button
              className={"hidden md:flex " + (currentPage == 1 && " !hidden")}
              style={{ border: "none", background: "none" }}
            >
              ← Prev
            </button>
          }
          nextIcon={
            <button
              className={"hidden md:flex " + ((currentPage >= Math.ceil(totalDatas / pageSize)) && " !hidden")}
              style={{ border: "none", background: "none" }}
            >
              Next →
            </button>
          }
        />
      )}
    </>
  );
};
