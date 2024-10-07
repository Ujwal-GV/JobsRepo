import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useState, useContext } from "react"; // Import useState and useContext
import { FaArrowRight } from "react-icons/fa";
import { HiUserCircle } from "react-icons/hi";
import Navbar from "../../components/Navbar";
import JobCard, { JobCardSkeleton } from "../../components/JobCard";
import MainContext from "../../components/MainContext";
import SeachInput from "../../components/SeachInput";
import AdvancedSwiper from "../../components/AdvanceSwiper";
import { useNavigate } from "react-router-dom";
import { JobProvider, useJobContext } from '../../contexts/JobContext';
import { SwiperSlide } from "swiper/react";
import { IoLocationOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";


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

function ProviderMainPage() {
  const navigate = useNavigate();

  const fetchJobs = async () => {
    const res = await axios.get("http://localhost:8087/jobs/?limit=10");
    return res.data;
  };

  
  // Call the useJobContext hook inside the component
  const { jobs } = useJobContext(); // Use the JobContext to get jobs

  const { isLoading: jobsDataLoading } = useQuery({
    queryKey: ['jobs'], // Unique key for this query
    queryFn: fetchJobs,      // The function that fetches the jobs data
    staleTime: 300000,       // Data will remain fresh for 5 minutes (300,000 ms)
    cacheTime: 300000,       // Cache the data for 5 minutes
    onError: () => {
      toast.error("Something went wrong while fetching jobs");
    }
  });
  
  // State to manage posted jobs
  const [postedJobs, setPostedJobs] = useState([]);

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
            title="Jobs posted by you"
            onViewClick={() => navigate("/provider/all-jobs")}
          >
            <AdvancedSwiper key={"jobs"}>
            {jobsDataLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => (
                <SwiperSlide key={d}>
                  <JobCardSkeleton id={d} />
                </SwiperSlide>
              ))
            ) : jobs.length === 0 ? (
                <div className="text-center w-full">
                  <p className="text-gray-500">
                    No jobs posted by you
                  </p>
                </div>
            ) : (
              jobs.map((item) => (
                <SwiperSlide key={item.id}>
                  <JobCard key={item.id} data={item} />
                </SwiperSlide>
              )))}
          </AdvancedSwiper>
          </SwiperWrapper>
        </MainContext>
      </JobProvider>
    </div>
  );
}

export default ProviderMainPage;
