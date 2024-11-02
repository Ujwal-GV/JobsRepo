import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard, { JobCardSkeleton } from "../../../components/JobCard";
import { useQuery } from "@tanstack/react-query";
import SomethingWentWrong from "../../../components/SomethingWentWrong";
import MainContext from "../../../components/MainContext";
import { FaSearch } from "react-icons/fa";

const JobSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State to handle the search input
  const navigate = useNavigate();

  // Function to fetch job data (you can replace this with the actual API call)
  const fetchJobs = async () => {
    // Replace this with actual API call
    const res = await fetch('/api/jobs'); 
    return res.json();
  };

  // Using useQuery to handle job data fetching with react-query
  const { data: jobsData, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    staleTime: 30000,
    cacheTime: 30000,
  });

  // Filter jobs based on searchQuery
  const filteredJobs = jobsData?.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full relative max-w-[1800px] bg-white mx-auto py-5">
      <MainContext>
        <div className="px-4 md:px-10">
          {/* Search Bar */}
          <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm mb-5">
            <input
              type="text"
              className="w-full bg-transparent outline-none px-2 text-gray-600"
              placeholder="Search for jobs by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="text-gray-400 text-lg ml-2" />
          </div>

          {/* Job Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map((d) => (
                <JobCardSkeleton key={d} id={d} />
              ))
            ) : error ? (
              <SomethingWentWrong message="Unable to fetch jobs. Please try again later." />
            ) : filteredJobs?.length > 0 ? (
              filteredJobs?.map((job) => (
                <JobCard key={job.id} data={job} />
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                <h1>No jobs found matching your search criteria.</h1>
              </div>
            )}
          </div>

          {/* Navigate back to the main job page */}
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate("/find-jobs")}
              className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition duration-200"
            >
              Back to Job Search
            </button>
          </div>
        </div>
      </MainContext>
    </div>
  );
};

export default JobSearchPage;
