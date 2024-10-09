import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MainContext from "../components/MainContext";
import SeachInput from "../components/SeachInput";
import { FaArrowRight } from "react-icons/fa";
import AdvancedSwiper from "../components/AdvanceSwiper";
import {
  companyData,
  jobData,
  projectData,
} from "../../assets/dummyDatas/Data";
import { SwiperSlide } from "swiper/react";
import JobCard, { JobCardSkeleton } from "../components/JobCard";
import CompanyCard, { CompanyCardSkeleton } from "../components/CompanyCard";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const SwiperWrapper = ({ title = "", onViewClick = () => {}, children }) => {
  return (
    <div className="my-5 w-full p-3">
      <div className="job-slider md:border w-full rounded-2xl h-full  shadow-black p-1 md:p-5">
        <h1 className="text-xl md:text-2xl font-semibold flex items-center justify-between gap-2">
          <span className="flex center text-[1rem] md:text-[1.2rem] ms-1 font-outfit">
            {title} <FaArrowRight className="ms-2" />
          </span>
          <span
            className="text-orange-600 text-sm cursor-pointer hover:underline font-outfit me-1"
            onClick={onViewClick}
          >
            View All
          </span>
        </h1>
        <div className="mt-5  md:py-3">{children}</div>
      </div>
    </div>
  );
};

function MainPage() {


  const navigate = useNavigate();

  const fetchJobs = async () => {
    const res = await axios.get("http://localhost:8087/jobs/?limit=10");
    return res.data;
  };

  const fetchCompanies = async () => {
    const res = await axios.get("http://localhost:8087/provider/allcompany?limit=10");
    return res.data;
  };

  const { data: jobsData, isLoading: jobsDataLoading } = useQuery({
    queryKey: ['jobsData'], // Unique key for this query
    queryFn: fetchJobs,      // The function that fetches the jobs data
    staleTime: 300000,       // Data will remain fresh for 5 minutes (300,000 ms)
    cacheTime: 300000,       // Cache the data for 5 minutes
    onError: () => {
      toast.error("Something went wrong while fetching jobs");
    }
  });

  const { data: companiesData, isLoading: companyDataLoading } = useQuery({
    queryKey: ['companyData'], // Unique key for this query
    queryFn: fetchCompanies,      // The function that fetches the jobs data
    staleTime: 300000,       // Data will remain fresh for 5 minutes (300,000 ms)
    cacheTime: 300000,       // Cache the data for 5 minutes
    onError: () => {
      toast.error("Something went wrong while fetching jobs");
    }
  });

  return (
    <div className="w-full min-h-screen relative max-w-[1800px] bg-white mx-auto">
      <MainContext>
        <div className="h-[600px] w-full bg-slate-50 relative py-10">
          {/* blue bubble */}
          <div className="orange-bubble absolute top-[100px] left-[100px]" />
          {/* search input */}
          <div className="w-[250px] mx-auto md:w-[300px] lg:w-[500px]">
            <SeachInput placeholder="Search a job / project....." />
          </div>
          {/* prime header  */}
          <div className="mt-10 mx-auto w-fit font-outfit">
            <h1 className="text-center text-xl md:text-5xl font-semibold">
              Find jobs that matches your
            </h1>
            <h1 className="mt-6 text-center text-xl md:text-5xl font-semibold text-orange-500">
              Preferences
            </h1>
          </div>
          <div className="orangle-circle absolute right-5 md:right-16  lg:right-[200px]  top-[200px]" />
          <div className="blue-circle absolute left-5 md:left-16 lg:left-[200px] bottom-[200px] shadow-sm " />
        </div>

        {/* Jobs Slider */}
        <SwiperWrapper
          key={"jobs"}
          title="Recomended jobs for you"
          onViewClick={() => navigate("find-jobs")}
        >
          <AdvancedSwiper key={"jobs"}>
            {jobsDataLoading
              ? [1,2,3,4,5,6,7,8,9,0].map((d) => (
                  <SwiperSlide key={d}>
                    <JobCardSkeleton id={d} />
                  </SwiperSlide>
                ))
              : jobsData.map((item) => (
                  <SwiperSlide key={item.id}>
                    <JobCard key={item.id} data={item} />
                  </SwiperSlide>
                ))}
          </AdvancedSwiper>
        </SwiperWrapper>

        {/* Company Slider */}

        <SwiperWrapper
          key={"company"}
          title="Explore jobs in top companies"
          onViewClick={() => alert("comapny  List")}
        >
          <AdvancedSwiper>
            {
               
               companyDataLoading ? 
               
               [1,2,3,4,5,6,7,8,9,0].map((data) => (
                <SwiperSlide key={data}>
                  <CompanyCardSkeleton  id={data} />
                </SwiperSlide>
              ))
               : 

              ( companiesData.map((data) => (
                <SwiperSlide key={data.id}>
                  <CompanyCard data={data} />
                </SwiperSlide>
              )))

            }
          </AdvancedSwiper>
        </SwiperWrapper>

        <SwiperWrapper
          key={"projects"}
          title="Suggested projects"
          onViewClick={() => alert("Project  List")}
        >
          <AdvancedSwiper>
            {projectData.map((data) => (
              <SwiperSlide key={data.id}>
                <ProjectCard key={data.id} data={data} />
              </SwiperSlide>
            ))}
          </AdvancedSwiper>
        </SwiperWrapper>
      </MainContext>
    </div>
  );
}

export default MainPage;
