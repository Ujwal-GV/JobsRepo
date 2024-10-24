import { useState, useEffect, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { axiosInstance } from "../../utils/axiosInstance";
import JobCard, { JobCardSkeleton } from "../../components/JobCard";
import SeachInput from "../../components/SeachInput";
import { FaEye } from "react-icons/fa6";
import { IoTrash } from "react-icons/io5";
import toast from "react-hot-toast";
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { LuLoader2 } from "react-icons/lu";

function ProviderMainPage() {
  const { profileData } = useContext(AuthContext);
  const [companyId, setCompanyId] = useState(null);
  const navigate = useNavigate();
  const [deletedJobs, setDeletedJobs] = useState({});
  const queryClient = useQueryClient();

  useEffect(() => {
    if (profileData) {
      setCompanyId(profileData?.company_id);
    }
  }, [profileData]);

  const fetchJobs = async () => {
    if (!companyId) throw new Error("Company ID is not available");
    const res = await axiosInstance.get(`/provider/${companyId}`);
    return res.data;
  };

  const { data: jobsData, isLoading: jobsDataLoading, error, refetch } = useQuery({
    queryKey: ['jobs', companyId],
    queryFn: fetchJobs,
    staleTime: 30000,
    cacheTime: 30000,
    enabled: !!companyId,
  });

  const jobs = jobsData?.accountData?.Applications_info || [];

  const handlePostJobClick = () => {
    navigate('/provider/post-job');
  };

  const deleteJob = async (jobId) => {
    const response = await axiosInstance.delete(`/jobs/${jobId}`);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: (data, variables) => {
      toast.success("Job post deleted successfully!");
      setDeletedJobs((prev) => ({ ...prev, [variables]: true }));
      queryClient.invalidateQueries(['jobs', companyId]);
    },
    onError: (error) => {
      toast.error("Error deleting job post: " + error.message);
    },
  });

  const handlePostDelete = (jobId) => {
    mutation.mutate(jobId);
  };

  useEffect(() => {
    if (location) {
      refetch();
    }
  }, [location, refetch]);

  return (
    <div className="w-full min-h-screen relative max-w-[1800px] bg-white mx-auto">
      <div className="h-[600px] w-full bg-slate-50 relative py-10">
        {/* Blue bubble */}
        <div className="orange-bubble absolute top-[100px] left-[100px]" />
        <div className="w-[250px] mx-auto md:w-[300px] lg:w-[500px]">
          <SeachInput placeholder="Search posted job......" />
        </div>
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

      {/* <JobSearchCard /> */}

      {/* Posted Jobs List */}
      <div className="my-5 p-4 bg-gray-100 mx-auto w-full rounded-lg lg:w-2/3">
        <div className="my-5 flex flex-col gap-4 items-center justify-center text-center relative">
          <h2 className="text-2xl mx-auto font-semibold text-center flex-grow">Jobs Posted by You</h2>
          <button
            onClick={handlePostJobClick}
            className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition duration-200"
          >
            Post a Job
          </button>
          {!error && !jobsDataLoading && 
          (<button
            title="View"
            // className="px-3 py-2 shadow-lg bg-black text-white rounded-lg text-sm flex items-center hover:bg-gray-800 transition duration-200"
            className="absolute right-2 bottom-[-1rem] center underline text-sm"
            onClick={() => navigate(`/provider/jobs-posted/${companyId}`)}
          >
            <FaEye className="mr-1 text-sm" />
            All Jobs
          </button>)}
        </div>
        <hr className="mt-5 mb-2 border-gray" />
        <div className="flex flex-col gap-4 h-[620px] overflow-y-auto custom-scroll p-2">
        {jobsDataLoading ? (
          [1, 2, 3, 4, 5].map((d) => (
            <div key={d} className="flex-1 bg-white w-full flex items-center justify-center h-auto rounded-lg animate-pulse shadow-md">
              <JobCardSkeleton id={d} />
            </div>
          ))
        ) : error ? (
          <div className="text-center flex flex-col items-center gap-4 mx-auto my-auto text-gray-500">
            <span><FaExclamationCircle className="text-2xl text-red-500" /></span>
            <span>Please login to post and view job details</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center flex flex-col my-auto text-gray-500">
            No jobs posted by you.
          </div>
        ) : (
          jobs.map((job) => (
            <div className="flex flex-col bg-white p-5 rounded-lg lg:flex-row justify-between items-start lg:items-center" key={job.job_id}>
              {/* Job Details */}
              <div className="flex flex-col">
                <h3 className="font-bold">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-0">Company: {job?.provider_details}</p>
                <p className="text-sm text-gray-600 mb-0">App-ID: {job?.job_id}</p>
                <p className="text-sm text-gray-600">Applicants: {job?.applied_ids.length}</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-row gap-2 mt-2 lg:mt-0 lg:ml-4">
                <button
                  title="View"
                  className="px-3 py-2 shadow-lg bg-black text-white rounded-lg text-sm flex items-center hover:bg-gray-800 transition duration-200"
                  onClick={() => navigate(`/provider/all-jobs/${job?.job_id}`)}
                >
                  <FaEye className="mr-1" />
                  View
                </button>

                <button
                  title="Delete"
                  className="px-3 py-2 shadow-lg bg-white text-black rounded-lg text-sm flex items-center border border-gray-500 hover:bg-gray-300 transition duration-200"
                  onClick={() => handlePostDelete(job?.job_id)}
                >
                  <IoTrash className="mr-1" />
                  {
                    mutation.isLoading && mutation.variables === job.job_id && (
                      <LuLoader2 className="animate-spin-slow" />
                    )
                  }
                  {
                    deletedJobs[job.job_id] ? (
                      <FaCheckCircle className="text-black" />
                    ) : (
                      "Delete"
                    )
                  }
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
}

export default ProviderMainPage;