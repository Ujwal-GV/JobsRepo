import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useState, useContext } from "react"; // Import useState and useContext
import { FaArrowRight } from "react-icons/fa";
import { HiUserCircle } from "react-icons/hi";
import Navbar from "../../components/Navbar";
import MainContext from "../../components/MainContext";
import SeachInput from "../../components/SeachInput";
import AdvancedSwiper from "../../components/AdvanceSwiper";
import { useNavigate } from "react-router-dom";
import { JobProvider, useJobContext } from '../../contexts/JobContext';
import { SwiperSlide } from "swiper/react";
import { IoLocationOutline } from "react-icons/io5";

const SwiperWrapper = ({ title = "", onViewClick = () => {}, children }) => {
  return (
    <div className="my-5 w-full p-3">
      <div className="job-slider md:border w-full rounded-2xl h-full shadow-black p-1 md:p-5">
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
        <div className="mt-5 md:py-3">{children}</div>
      </div>
    </div>
  );
};

const SwipeCard = ({ job }) => {
  return (
    <div className="job-card relative w-[180px] md:w-[200px]  h-[160px] md:h-[180px]  bg-white border-gray  rounded-lg m-3 p-3 cursor-pointer duration-800 ">
      <h2 className="w-full text-[1 rem] font-semibold text-ellipsis text-nowrap overflow-hidden mt-3">{job.title}</h2> 
      <p className=" max-w-[90%] overflow-hidden text-ellipsis text-nowrap text-gray-600 font-roboto">{job.companyName}</p>
      <div className="flex">
      <IoLocationOutline />
      <p className="text-sm text-gray-500">{job.location ? job.location : "Remote"}</p>
      </div>
        <span className="text-end text-sm mt-2 text-slate-00">Posted on: {job.postedDate}</span>
    </div>
  );
};


function ProviderMainPage() {
  const navigate = useNavigate();
  
  // State to manage posted jobs
  const [postedJobs, setPostedJobs] = useState([]);

  // Call the useJobContext hook inside the component
  const { jobs } = useJobContext(); // Use the JobContext to get jobs

  const handlePostJobClick = () => {
    navigate('/provider/post-job');
  };

  const handleProfileClick = () => {
    navigate('/provider/profile');
  };

  // Function to simulate posting a job (you can replace this with your actual job posting logic)
  const postJob = (jobDetails) => {
    setPostedJobs((prevJobs) => [...prevJobs, jobDetails]);
  };

  return (
    <div className="w-full min-h-screen relative max-w-[1800px] bg-white mx-auto">
      <JobProvider>
        <MainContext>
          <div className="h-[600px] w-full bg-slate-50 relative py-10">
            {/* Blue bubble */}
            <div className="orange-bubble absolute top-[100px] left-[100px]" />
            {/* Search input */}
            <div className="w-[250px] mx-auto md:w-[300px] lg:w-[500px]">
              <SeachInput placeholder="Search posted job......" />
            </div>
            {/* Prime header */}
            <div className="mt-10 mx-auto w-fit font-outfit">
              <h1 className="text-center text-xl md:text-5xl font-semibold">
                Welcome, Job Provider!
              </h1>
              <h1 className="mt-6 text-center text-xl md:text-5xl font-semibold text-orange-500">
                Post a Job
              </h1>
            </div>
            <div className="orangle-circle absolute right-5 md:right-16 lg:right-[200px] top-[200px]" />
            <div className="blue-circle absolute left-5 md:left-16 lg:left-[200px] bottom-[200px] shadow-sm" />
            {/* Profile icon */}
            <HiUserCircle
              className="w-[250px] mx-auto md:w-[300px] lg:w-[500px] text-4xl cursor-pointer text-orange-600 hover:text-black" title="Profile"
              onClick={handleProfileClick}
            />
          </div>

          {/* Post Job Button */}
          <div className="my-5 text-center">
            <button
              onClick={handlePostJobClick}
              className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition duration-200"
            >
              Post a Job
            </button>
          </div>

          {/* Posted Jobs Slider */}
          <SwiperWrapper
            key={"jobs"}
            title="Your Posted Jobs"
            onViewClick={() => navigate('/provider/all-jobs')}
          >
            <AdvancedSwiper>
              {jobs.length === 0 ? (
                <SwiperSlide>
                  <div className="font-outfit center">No jobs posted yet.</div>
                </SwiperSlide>
              ) : (
                jobs.map((job) => (
                  <SwiperSlide key={job.id}>
                    <SwipeCard job={job} key={job.id} />
                  </SwiperSlide>
                ))
              )}
            </AdvancedSwiper>
          </SwiperWrapper>
        </MainContext>
      </JobProvider>
    </div>
  );
}

export default ProviderMainPage;
