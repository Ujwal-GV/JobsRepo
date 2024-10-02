import React from "react";
import { useLocation } from "react-router-dom";
import MainContext from "../../components/MainContext";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { useNavigate } from "react-router-dom";

const JobDetails = () => {
  const { state } = useLocation();
  // console.log(state);
  
  const job = state?.job;

  if (!job) {
    return <p>Job not found!</p>;
  }

  const VerticalBar = () => {
    return <div className="w-0 h-5 border-r border-black"></div>;
  };

  const navigate = useNavigate();

  return (
    <MainContext>
      {/* Wrapper for the entire content */}
      <div className="w-full min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10 flex flex-col gap-10">
        
        {/* Top Section: Company and Person Details */}      
        {/* Left Section */}
        <div className="w-full lg:w-[55%] job-apply-section relative">
          {/* Company and Person Details */}
          <div className="w-full rounded-xl h-fit bg-white p-5 md:p-5 font-outfit">
            <img 
              src="/Logo.png" 
              alt="Company Logo" 
              className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover mb-4 absolute top-4 right-4" 
            />
            <h1 className="text-[1.3rem] md:text-2xl font-bold">
              {job.title}
            </h1>
            <h1 className="text-[1.3rem] md:text-2xl font-semibold">
              {job.companyName}
            </h1>
            <h3 className="font-light mt-5">
              Posted by: {job.providerName}
            </h3>
            <div className="flex gap-2 mt-3">
              <span>Experience: {job.experience}</span>
              <VerticalBar />
            </div>
            <hr className="mt-10 mb-2" />
            <div className="flex justify-between items-center">
              <div>
                <span>Applicants: {job.applicants || 0}</span>
              </div>
            </div>
          </div>

          {/* Key Highlights */}
          <div className="w-full rounded-xl mt-8 h-fit bg-white p-2 md:p-10">
            <h1 className="text-xl md:text-2xl font-semibold mb-4">
              Key Highlights
            </h1>
            <ul className="mt-3">
              <KeyHighlightsListItem
                key={"1"}
                title="Location"
                value={job.location}
              />
              <KeyHighlightsListItem
                key={"1-1"}
                title="Industry"
                value={job.industry}
              />
              <KeyHighlightsListItem key={"1-2"} title="Posted On" value={job.postedOn || "Just Now"} />
            </ul>
          </div>
        </div>

        {/* Right Section: About Company */}
        <div className="w-full lg:w-[55%] mt-5 md:mt-0 flex-1 flex flex-col gap-2 h-fit bg-white rounded-lg py-5 px-4 md:p-5">
        <div className="mb-2">
          <strong>Job Description:</strong>
          <div
            className="mt-2 p-4 text-justify"
            dangerouslySetInnerHTML={{ __html: job.jobDescription }}
          />
        </div>
        {/* <div className="flex center gap-3">
          <button
            type="button"
            className="btn-orange-outline px-3 py-1 flex center gap-1"
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </button>
        </div> */}
          {/* <h1 className="text-xl md:text-2xl font-outfit text-orange-600">
            About Company
          </h1>
          <textarea
            placeholder="Details about the company will be displayed here."
            className="w-full h-40 border rounded-md p-2"
            readOnly
          >
            {job.jobDescription || "No description available."}
          </textarea> */}
        </div>
      </div>
    </MainContext>
  );
};

export default JobDetails;
