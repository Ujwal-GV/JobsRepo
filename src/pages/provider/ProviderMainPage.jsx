import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useState, useContext } from "react"; // Import useState and useContext
import { FaEye } from "react-icons/fa6";
import { HiUserCircle } from "react-icons/hi";
import ProviderNavbar from "./components/ProviderNavbar";
import JobCard, { JobCardSkeleton } from "../../components/JobCard";
import MainContext from "../../components/MainContext";
import SeachInput from "../../components/SeachInput";
import { useNavigate } from "react-router-dom";
import { JobProvider, useJobContext } from '../../contexts/JobContext';
import { useQuery } from "@tanstack/react-query";

function ProviderMainPage() {
  const navigate = useNavigate();

  const fetchJobs = async () => {
    const res = await axios.get("http://localhost:8087/jobs/?limit=10");
    return res.data;
  };

  const { jobs } = useJobContext(); // Use the JobContext to get jobs

  const { isLoading: jobsDataLoading } = useQuery({
    queryKey: ['jobs'], 
    queryFn: fetchJobs,      
    staleTime: 300000,      
    cacheTime: 300000,      
    onError: () => {
      toast.error("Something went wrong while fetching jobs");
    }
  });
  
  const [postedJobs, setPostedJobs] = useState([]);

  const handlePostJobClick = () => {
    navigate('/provider/post-job');
  };

  const handleProfileClick = () => {
    navigate('/provider/profile');
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

          {/* Posted Jobs List */}
          <div className="my-5 p-4 bg-gray-100 mx-auto w-full rounded-lg lg:w-2/3">
            {/* Header and Post Job Button */}
            <div className="my-5 flex flex-col gap-4 items-center justify-center text-center">
              <h2 className="text-2xl mx-auto font-semibold text-center flex-grow">Jobs Posted by You</h2>
              <button
                onClick={handlePostJobClick}
                className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition duration-200"
              >
                Post a Job
              </button>
            </div>
            
            <hr className="mt-5 mb-2 border-gray" />

            {/* Scrollable Jobs List */}
            <div className="flex flex-col gap-4 h-[620px] overflow-y-auto custom-scroll p-2">
              {jobsDataLoading ? (
                [1, 2, 3, 4, 5].map((d) => (
                  <div key={d} className="flex-1 bg-white w-full flex items-center justify-center h-auto rounded-lg animate-pulse shadow-md">
                    <JobCardSkeleton id={d} />
                  </div>
                ))
              ) : jobs.length === 0 ? (
                <div className="text-center flex flex-col my-auto text-gray-500">
                  No jobs posted by you.
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
                    <div className="flex flex-col">
                      <h3 className="font-bold">{job.title}</h3>
                      <p className="text-sm text-gray-600">Company: {job.companyName}</p>
                      <p className="text-sm text-gray-600">Applicants: {job.applicants}</p>
                    </div>
                    <button
                      className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm flex items-center hover:bg-orange-700 transition"
                      onClick={() => navigate(`/provider/all-jobs`, { state: { job } })}
                    >
                      <FaEye className="mr-1" /> View
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </MainContext>
      </JobProvider>
    </div>
  );
}

export default ProviderMainPage;
