import React, { useState } from "react";
import MainContext from "../../components/MainContext";
import { FaCheckCircle, FaEye, FaTrash } from "react-icons/fa";
import { jobData } from "../../../assets/dummyDatas/Data";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { CiSearch } from "react-icons/ci";
import AdvancedSwiper from "../../components/AdvanceSwiper";
import { SwiperSlide } from "swiper/react";
import JobCard from "../../components/JobCard";
import { useNavigate } from "react-router-dom";

export const VerticalBar = ({className}) => {
  return <div className={"w-0 h-5 border-r border-black " +className}></div>;
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
        <SwiperSlide key={data.id}>
          <JobCard data={data} />
        </SwiperSlide>
      ))}
    </AdvancedSwiper>
  );

const CompanyPage = () => {


  const navigate = useNavigate();

  return (
    <MainContext>
      {/* Wrapper for the entire content */}
      <div className="w-full min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10 flex flex-col gap-10">
        {/* Top Section: Company and Person Details */}
        <div className="w-full lg:w-full flex flex-col lg:flex-row gap-10">
          {/* Left Section */}
          <div className="w-full lg:w-[55%] job-apply-section relative">
            {/* Company and Person Details */}
            <div className="w-full rounded-xl h-fit bg-white p-2 md:p-10 font-outfit">
              <img
                src="Logo.png"
                alt="Company Logo"
                className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover mb-4 absolute top-4 right-4"
              />
              <h1 className="text-[1.3rem] md:text-2xl font-semibold">
                Company Name
              </h1>
              <h3 className="font-light mt-5">Posted by: Provider Name</h3>
              <div className="flex gap-2 mt-3">
                <span>Experience</span>
                <VerticalBar />
                <span>Posted Jobs: 5</span>
              </div>
              <hr className="mt-10 mb-2" />
              {/* <div className="flex justify-between items-center">
                <div>
                  <span>Applicants: {20}</span>
                </div>
                <div className="flex center gap-3">
                  <button
                    className="btn-orange-outline px-3 py-1 flex center gap-1"
                    onClick={handleSaveClick}
                  >
                    {saved ? (
                      <FaCheckCircle className="text-orange-600" />
                    ) : (
                      <></>
                    )}
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
              </div> */}
            </div>

            {/* Key Highlights */}
            {/* <div className="w-full rounded-xl mt-8 h-fit bg-white p-2 md:p-10">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">
                Key Highlights
              </h1>
              <ul className="mt-3">
                <KeyHighlightsListItem key={"1"} title="Location" value="Bangalore" />
                <KeyHighlightsListItem key={"1-1"} title="Industry" value="IT Services" />
                <KeyHighlightsListItem key={"1-2"} title="Posted On" value="1 Week Ago" />
              </ul>
            </div> */}
          </div>

          {/* Right Section: About Company */}
          <div className="w-full lg:w-[45%] mt-5 md:mt-0 flex-1 flex flex-col gap-2 h-fit bg-white rounded-lg p-2 md:p-5">
            <h1 className="text-xl md:text-2xl font-outfit text-orange-600">
              About Company
            </h1>
            <p className="font-outfit">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
              praesentium eveniet ratione saepe aliquid illo exercitationem,
              porro commodi ipsum asperiores omnis quisquam accusamus distinctio
              ipsa, lorem50
            </p>

            {/* Company Details */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Company Details</h2>
              <ul className="list-disc list-inside mt-3">
                <li>Company Name: Example Corp</li>
                <li>Location: New York, USA</li>
                <li>Industry: Software Development</li>
                <li>Employees: 500+</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Jobs Posted by You */}
        <div className="w-full rounded-xl h-fit bg-white p-2 md:p-10 flex flex-col">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold mb-4 flex justify-between items-center">
              All Post
              <span className="text-sm text-orange-600 cursor-pointer hover:underline" onClick={()=>navigate("allpostedContent")}>
                View All
              </span>
            </h1>
            <JobsPostedByCompany jobsPostedByCompany={jobData} />
          </div>
         
          {/* Business Posts */}

          <div className="border-t border-gray-100 pt-4">
            <h1 className="text-xl md:text-2xl font-semibold mb-4 flex justify-between items-center">
              Business Post
              <span className="text-sm text-orange-600 cursor-pointer hover:underline">
                View All
              </span>
            </h1>
            <JobsPostedByCompany jobsPostedByCompany={jobData} />
          </div>
          <div></div>
        </div>
      </div>
    </MainContext>
  );
};

export default CompanyPage;
