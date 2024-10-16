import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useState, useEffect, useContext } from "react"; // Import useState and useEffect
import { FaEye } from "react-icons/fa6";
import { HiUserCircle } from "react-icons/hi";
import ProviderNavbar from "./components/ProviderNavbar";
import JobCard, { JobCardSkeleton } from "../../components/JobCard";
import SeachInput from "../../components/SeachInput";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

function ProviderMainPage() {
  const { profileData } = useContext(AuthContext);
  const [companyId, setCompanyId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Set companyId from profileData when it changes
  useEffect(() => {
    if (profileData) {
      setCompanyId(profileData?.company_id);
    }
  }, [profileData]);

  const fetchJobs = async () => {
    if (!companyId) {
      throw new Error("Company ID is not available");
    }
    const res = await axios.get(`http://localhost:8087/provider/${companyId}`);
    console.log("Jobs_Fetch", res.data);
    return res.data;
  };

  const { data: jobsData, isLoading: jobsDataLoading, error, refetch } = useQuery({
    queryKey: ['jobs', companyId], // Include companyId in the query key
    queryFn: fetchJobs,      
    staleTime: 300000,      
    cacheTime: 300000,      
    enabled: !!companyId, // Only run the query if companyId is available
    onError: () => {
      console.error("Error fetching jobs");
    }
  });

  // Extract jobs from the fetched data
  const jobs = jobsData?.accountData?.Applications_info || [];

  const handlePostJobClick = () => {
    navigate('/provider/post-job');
  };

  const handleProfileClick = () => {
    navigate('/provider/profile');
  };

  // Refetch data when the component mounts or when the location changes
  useEffect(() => {
    refetch();
  }, [location, refetch]);

  return (
    <div className="w-full min-h-screen relative max-w-[1800px] bg-white mx-auto">
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
        ) : error ? (
          <div className="text-center flex flex-col my-auto text-gray-500">
            Error fetching jobs
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center flex flex-col my-auto text-gray-500">
            No jobs posted by you.
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="font-bold">{job.title}</h3>
                <p className="text-sm text-gray-600">Company: {job.provider_details}</p>
                <p className="text-sm text-gray-600">Applicants: {job.applied_ids.length}</p>
              </div>
              <button
                className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm flex items-center hover:bg-orange-700 transition"
                onClick={() => 
                  {console.log("Job Data:", job)
                    navigate(`/provider/all-jobs/${job?.job_id}`)
                  // navigate(/provider/all-jobs, { state: { jobId: job?.job_id } })
                }}
                  >
                <FaEye className="mr-1" /> View
              </button>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
}

export default ProviderMainPage;