import React, { useState } from "react";
import MainContext from "../../components/MainContext";
import { jobData } from "../../../assets/dummyDatas/Data";
import { CiSearch } from "react-icons/ci";
import AdvancedSwiper from "../../components/AdvanceSwiper";
import { SwiperSlide } from "swiper/react";
import JobCard from "../../components/JobCard";
import {  useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../Loading";
import { HiPlus } from "react-icons/hi";
import { Rate } from "antd";
import { FreelanePostContainer, JobPostContainer } from "./CompanyAllPosts";

export const VerticalBar = ({ className }) => {
  return <div className={"w-0 h-5 border-r border-black " + className}></div>;
};

export const NoPostFound = () => (
  <div className="mx-auto text-[1rem] md:text-2xl flex center gap-2">
    <CiSearch className=" text-orange-600" />
    <span className="md:text-[1.5rem] font-fredoka">No Post found</span>
  </div>
);

const JobsPostedByCompany = ({ jobsPostedByCompany = [] }) =>
  jobsPostedByCompany.length === 0 ? (
    <NoPostFound />
  ) : (
    <AdvancedSwiper>
      {jobsPostedByCompany.map((data) => (
        <SwiperSlide key={data.id} className="mx-2">
          <JobCard data={data} />
        </SwiperSlide>
      ))}
    </AdvancedSwiper>
  );

const CompanyPage = () => {
  const { id:companyId } = useParams();
  const PostedSections = [" Job Posts", "Freelance Post"];
  const [posttype, setPostType] = useState(0);

  const fetchCompanyData = async () => {
    const res = await axios.get(`http://localhost:8087/provider/${companyId}`);
    return res.data;
  };

  const navigate = useNavigate();

  const { data, isLoading: companyDataLoading } = useQuery({
    queryKey: ["companyData", companyId], // Unique key for this query
    queryFn: fetchCompanyData, // The function that fetches the jobs data
    staleTime: 300000, // Data will remain fresh for 5 minutes (300,000 ms)
    cacheTime: 300000, // Cache the data for 5 minutes
    onError: () => {
      toast.error("Something went wrong while fetching jobs");
    },
  });

  if (companyDataLoading) {
    return <Loading />;
  }

  const { company_name, img, company_links, email, location, description } =
    data.accountData;

  return (
    <MainContext>
      {/* Wrapper for the entire content */}
      <div className="w-full min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10 flex flex-col gap-10">
        {/* Top Section: Company and Person Details */}
        <div className="w-full  mx-auto gap-10 bg-white grid grid-cols-1 lg:grid-cols-2">
          <div>
            {/* Company deatils with logo */}
            <div className="w-full job-apply-section relative">
              {/* Company and Person Details */}
              <div className="w-full rounded-none h-fit bg-white p-2 md:p-10 font-outfit">
                <img
                  src={img ? img.url : ""}
                  alt="Company Logo"
                  className="w-16 h-16 md:w-24 md:h-24  object-cover mb-4 absolute top-4 right-4 lg:top-8 lg:right-8"
                />
                <h1 className="text-[1.3rem] md:text-2xl font-semibold">
                  {company_name}{" "}
                  <span className="text-sm">
                    <Rate count={1} disabled value={1} />
                    {4.5}
                  </span>
                </h1>
                <h3 className="font-light mt-5">
                  Website :{" "}
                  <a className="text-blue-600 cursor-pointer">
                    {company_links[0].url}
                  </a>
                </h3>
                <div className="flex gap-2 mt-3">
                  <button className="py-2 px-4 bg-orange-600 text-white flex center gap-1 rounded-2xl">
                    {" "}
                    <HiPlus /> Follow
                  </button>
                </div>
                <hr className="mt-10 mb-2" />
              </div>
            </div>

            {/*  About Company */}
            <div className="w-full  mt-5 md:mt-0 flex-1 flex flex-col gap-2 h-fit bg-white rounded-lg p-2 md:p-5">
              <h1 className="text-xl md:text-2xl font-outfit text-orange-600">
                {`About ${company_name}`}
              </h1>
              <p className="font-outfit">{description}</p>

              {/* Company Details */}
              <div className="mt-4">
                <h2 className="text-lg font-semibold">More Details</h2>
                <ul className="list-disc list-inside mt-3">
                  <li>
                    <span className="font-semibold">Email :</span> {email}
                  </li>
                  <li>
                    <span className="font-semibold">Location :</span> {location}
                  </li>
                  <li>
                    <span className="font-semibold">Type : </span> Software
                    Development
                  </li>
                  <li>Employees: 500+</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="px-2 md:px-5 mb-4">
            <div className="flex  justify-start items-center gap-2 py-5">
              {PostedSections.map((data, idx) => {
                return (
                  <div
                  key={idx}
                    onClick={() => setPostType(idx)}
                    className={
                      "rounded-full  cursor-pointer center gap-1 bg-slate-50 h-10 border hover:border-gray-950  px-3 text-sm " +
                      (posttype === idx && "border-gray-950")
                    }
                  >
                    {data}
                  </div>
                );
              })}
            </div>

            {posttype === 0 ? (
              <JobPostContainer cardClassname={" mx-auto lg:!mx-0 "} companyId={companyId}/>
            ) : (
              <FreelanePostContainer cardClassname={" mx-auto lg:!mx-0 "} />
            )}
          </div>
        </div>

        {/* Jobs Posted by You */}
        <div className="w-full rounded-xl h-fit bg-white p-2 md:p-10 flex flex-col">
          {/* Business Posts */}

          <div className="border-t border-gray-100 pt-4">
            <h1 className="text-xl md:text-2xl font-semibold mb-4 flex justify-between items-center">
              Business Post
              <span className="text-sm text-orange-600 cursor-pointer hover:underline">
                View All
              </span>
            </h1>
            <h1>All Post in grid design</h1>
          </div>
          <div></div>
        </div>
      </div>
    </MainContext>
  );
};

export default CompanyPage;
