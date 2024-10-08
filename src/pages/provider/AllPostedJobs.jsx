import React, { useState, useEffect } from 'react';
import { useJobContext } from '../../contexts/JobContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye } from 'react-icons/fa6'
import MainContext from "../../components/MainContext";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { JobCardSkeleton } from '../../components/JobCard';
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';


const AllPostedJobs = () => {
  const { jobs } = useJobContext();
  const navigate = useNavigate();
  const { state } = useLocation();
  const job = state?.job;

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplicants = async () => {
    if (!job) {
      throw new Error("Job not found");
    }

    try {
      const response = await axios.get(`http://localhost:8087/jobs/APP-1`, {
        params: 
        {
          applied_details: true,
        }
      });

      // console.log(response.data);
      
      if (!response) {
        throw new Error("Failed to fetch applicants");
      }
      
      response.data.job.forEach(job => {
        console.log("Hi",job);
        setApplicants(job.User_info);
        setLoading(false);
      });
      
    } catch (err) {
      setLoading(false);
    }
  };

  const { isLoading: jobsDataLoading } = useQuery({
    queryKey: ['applicants'], // Unique key for this query
    queryFn: fetchApplicants, // The function that fetches the applicants data
    staleTime: 300000, // Data will remain fresh for 5 minutes (300,000 ms)
    cacheTime: 300000, // Cache the data for 5 minutes
    onError: () => {
      toast.error("Something went wrong while fetching applicants");
    },
  });

  const handleViewClick = (job) => {
    navigate(`/provider/post-job/${job.id}`, { state: { job } });
  };

  return (
    <div className="w-full lg:w-full flex flex-col lg:flex-row gap-10 min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10 font-outfit">
      {/* Left Side: Jobs List with Scroll */}
      <div className="w-full lg:w-1/2 p-5 rounded-lg shadow-md h-[75vh] overflow-y-auto custom-scroll relative">
        <MainContext>
          <div className="w-full flex flex-col gap-3">
            {/* Company and Job Details */}
            <div className="w-full rounded-xl h-fit bg-white p-5 md:p-5 font-outfit">
              <img 
                src="/Logo.png" 
                alt="Company Logo" 
                className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover mb-4 absolute top-8 right-8" 
              />
              <h1 className="text-xl md:text-2xl font-bold">{job.title}</h1>
              <h2 className="text-xl md:text-2xl font-semibold">{job.companyName}</h2>
              <h3 className="mt-5">Posted by: {job.providerName}</h3>
              <p className="mt-3">Experience: {job.experience}</p>
              <p>Vacancies: {job.vacancies || "Not mentioned"}</p>
            </div>

            {/* More Details */}
            <div className="w-full rounded-xl mt-4 h-fit bg-white p-4 md:p-5 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">
                More Details
              </h1>
              <ul className="mt-3">
              <li className="mb-4">
                  <KeyHighlightsListItem
                    key={"1"}
                    title="Location"
                    value={job.location ? job.location : "Not disclosed"}
                  />
                </li>

                <li className="mb-4">
                  <KeyHighlightsListItem
                    key={"1-1"}
                    title="Department"
                    value={job.department ? job.department : "Not specified"}
                  />
                </li>
                <li className="mb-4">
                  <KeyHighlightsListItem
                    key={"1-2"}
                    title="Role"
                    value={job.jobRole ? job.jobRole : "Not specified"}
                  />
                </li>
                
                <li className="mb-4">
                  <KeyHighlightsListItem 
                    key={"1-3"} 
                    title="Employment Type"
                    value={job.employmentType} 
                  />
                </li>
                <li className="mb-4">
                  <KeyHighlightsListItem 
                    key={"1-4"} 
                    title="Package"
                    value={`${job.package}` ? `${job.package} ${job.currency || 'INR'}` : 'Not Disclosed'} 
                  />
                </li>
              </ul>
            </div>

            {/* Qualifications */}
            <div className="w-full rounded-xl mt-4 h-fit bg-white p-4 md:p-5 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">
                Required Skills
              </h1>
              {job.skills && job.skills.length > 0 ? (
                job.skills.map((skill, index) => (
                  <div className="mb-2">
                    <KeyHighlightsListItem
                      key={index}
                      title={null}
                      value={skill.value}
                    />
                  </div>
                ))
              ) : (
                <p className="ml-5">No skills listed</p>
              )}

              <h1 className="text-xl md:text-2xl font-semibold mb-2 mt-8">
                Optional Skills
              </h1>
              {job.optionalSkills && job.optionalSkills.length > 0 ? (
                job.optionalSkills.map((optionalSkill, index) => (
                  <div className="mb-2">
                    <KeyHighlightsListItem
                      key={index}
                      title={null}
                      value={optionalSkill.value}
                    />
                  </div>
                ))
              ) : (
                <p className="ml-5">No skills listed</p>
              )}
            </div>

            {/* Job Description */}
            <div className="bg-white p-4 rounded-lg mt-4">
              <strong>Job Description:</strong>
              <div dangerouslySetInnerHTML={{ __html: job.jobDescription }} className="mt-2 text-justify" />
            </div>
          </div>
        </MainContext>
      </div>

      {/* Right Side: Applicants View */}
      <div className="w-full lg:w-1/2 bg-gray-100 p-5 rounded-lg shadow-md h-[75vh]">
        <h1 className="text-xl font-semibold mb-5">Applicants</h1>
        {/* Placeholder for applicants */}
        {jobsDataLoading ? (
          [1, 2, 3, 4, 5].map((d) => (
            <div key={d} className="flex-1 bg-white w-full flex items-center justify-center h-auto rounded-lg animate-pulse shadow-md">
              <JobCardSkeleton id={d} />
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {applicants.length > 0 ? (
              applicants.map((applicant) => (
                <div key={applicant.user_id} className="p-4 bg-white rounded-lg shadow-md relative">
                  <h2 className="font-semibold">{applicant.name}</h2>
                  <div className="w-[60px] h-[60px] flex center absolute right-2 top-4 rounded-lg bg-gray-200">
                    <img 
                      src={applicant.profile_details.profileImg}
                      alt="Profile Image" 
                      className="w-full h-full rounded-lg object-fill"
                  />
                  </div>
                  {/* Qualification */}
                  <p>
                    Qualification: {applicant.profile_details.qualification ? applicant.profile_details.qualification : "Not mentioned"}
                  </p>
                  
                  {/* Skills */}
                  <div className="mt-2 mb-2">
                    <h4 className="font-semibold">Skills:</h4>
                    {applicant.profile_details.skills && applicant.profile_details.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {applicant.profile_details.skills.map((skill, index) => (
                          <span key={index} className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No skills added</p>
                    )}
                  </div>
                  {console.log("here",applicant)}
                  
                  <hr className='mt-2 mb-2' />
                  <button
                      className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm flex items-center hover:bg-orange-700 transition"
                      onClick={() => navigate(`/provider/view-candidate`, { state: { applicant } })}
                    >
                      <FaEye className="mr-1" /> View
                    </button>
                </div>
                
              ))
            ) : (
              <p>No applicants found for this job.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPostedJobs;
