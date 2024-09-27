import React, { useState } from "react";
import MainContext from "../../components/MainContext";
import { FaCheckCircle, FaEye, FaTrash } from "react-icons/fa"; // Importing icons for buttons
import { jobData } from "../../../assets/dummyDatas/Data";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";

const VerticalBar = () => {
  return <div className="w-0 h-5 border-r border-black"></div>;
};

const JobApplicationProviderView = () => {
  const [saved, setSaved] = useState(false);
  const [jobs, setJobs] = useState(jobData);
  
  const handleSaveClick = () => {
    setSaved((prev) => !prev);
  };

  const handleDeleteClick = (id) => {
    const updatedJobs = jobs.filter((job) => job.id !== id);
    setJobs(updatedJobs);
  };

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
              <div className="flex justify-between items-center">
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
              </div>
            </div>

            {/* Key Highlights */}
            <div className="w-full rounded-xl mt-8 h-fit bg-white p-2 md:p-10">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">
                Key Highlights
              </h1>
              <ul className="mt-3">
                <KeyHighlightsListItem key={"1"} title="Location" value="Bangalore" />
                <KeyHighlightsListItem key={"1-1"} title="Industry" value="IT Services" />
                <KeyHighlightsListItem key={"1-2"} title="Posted On" value="1 Week Ago" />
              </ul>
            </div>
          </div>

          {/* Right Section: About Company */}
          <div className="w-full lg:w-[45%] mt-5 md:mt-0 flex-1 flex flex-col gap-2 h-fit bg-white rounded-lg p-2 md:p-5">
            <h1 className="text-xl md:text-2xl font-outfit text-orange-600">
              About Company
            </h1>
            <p className="font-outfit">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
              praesentium eveniet ratione saepe aliquid illo exercitationem, porro
              commodi ipsum asperiores omnis quisquam accusamus distinctio ipsa,
              facere, nisi laudantium.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates 
              temporibus, optio quasi eum molestias harum consequuntur accusamus ab. 
              Magni dignissimos delectus aspernatur sit nostrum quidem officia officiis 
              nesciunt eius eveniet.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, nulla fugiat? 
              Vero, iusto iste. Et commodi esse fuga aspernatur optio provident sapiente sunt 
              ducimus iste, cum distinctio ut accusamus error, officiis voluptates veniam 
              cumque hic ex voluptatem animi repellendus laborum vel, ad enim. Eum debitis
               ullam sit similique dignissimos animi.
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
        <div className="w-full rounded-xl h-fit bg-white p-2 md:p-10">
          <h1 className="text-xl md:text-2xl font-semibold mb-4">
            Jobs Posted by You
          </h1>
          {/* Check if jobs exist else render the No jobs content */}
          {jobs.length === 0 ? (
            <p className="text-center text-gray-500">No jobs have been posted by you.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-sm mt-2">Applicants: {job.applicants}</p>
                  </div>
                  <div className="flex gap-2">
                    {/* View Applicants Button */}
                    <button className="px-3 py-2 bg-black text-white rounded-lg text-sm flex items-center">
                      <FaEye className="mr-1 hidden sm:inline" />
                      <span className="hidden sm:inline">View Applicants</span>
                      <span className="inline sm:hidden"><FaEye /></span>
                    </button>
                    
                    {/* Delete Application Button */}
                    <button 
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm flex items-center"
                      onClick={() => handleDeleteClick(job.id)}
                    >
                      <FaTrash className="mr-1 hidden sm:inline" />
                      <span className="hidden sm:inline">Delete Application</span>
                      <span className="inline sm:hidden"><FaTrash /></span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainContext>
  );
};

export default JobApplicationProviderView;
