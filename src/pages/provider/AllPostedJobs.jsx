import React, { useState, useEffect } from 'react';
import { useJobContext } from '../../contexts/JobContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye } from 'react-icons/fa6';
import MainContext from "../../components/MainContext";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { JobCardSkeleton } from '../../components/JobCard';
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { Pagination } from "antd";

const AllPostedJobs = () => {
  const { jobs } = useJobContext();
  const navigate = useNavigate();
  const { state } = useLocation();
  const job = state?.job;

  const [currentPage, setCurrentPage] = useState(1);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 3;  // Number of applicants per page

  const fetchApplicants = async (job_id, page, limit) => {
    try {
      const response = await axios.get(`http://localhost:8087/jobs/${job_id}`, {
        params: {
          applied_details: true,
          page, // Send current page
          limit, // Send limit (3 per page)
        }
      });

      if (response.data) {
        return response.data;
      } else {
        throw new Error("No applicants found");
      }
    } catch (err) {
      throw new Error("Failed to fetch applicants");
    }
  };

  // Using useQuery to fetch applicants
  const { isLoading: jobsDataLoading, data: applicantsData, error: applicantsError } = useQuery({
    queryKey: ['applicants', "APP-1", currentPage], // Include page in query key
    queryFn: () => fetchApplicants("APP-1", currentPage, limit),
    staleTime: 300000, // Data will remain fresh for 5 minutes
    cacheTime: 300000, // Cache the data for 5 minutes
    onError: () => {
      setError("Something went wrong while fetching applicants");
    },
  });

  const handleViewClick = (applicant) => {
    navigate(`/provider/view-candidate/${applicant.user_id}`, { state: { applicant } });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Set the current page when pagination is changed
  };

  useEffect(() => {
    if (applicantsData && applicantsData.job && applicantsData.job.User_info) {
      const applicants = applicantsData.job.User_info;
      setApplicants(applicants);
    }
  }, [applicantsData]);

  return (
    <div className="w-full lg:w-full flex flex-col lg:flex-row gap-10 min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10 font-outfit">
      {/* Left Side: Jobs List with Scroll */}
      <div className="w-full lg:w-1/2 p-5 rounded-lg shadow-md h-[48rem] overflow-y-auto custom-scroll relative">
        {job ? (
          <MainContext>
          {/* Job Details */}
          <h1 className="text-xl font-semibold mb-5">Job Details</h1>
          <div className="w-full flex flex-col gap-3">
            {/* Company and Job Details */}
            <div className="w-full rounded-xl h-fit bg-white p-5 md:p-5 font-outfit">
              <img 
                src="/Logo.png" 
                alt="Company Logo" 
                className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover mb-4 absolute top-15 right-8" 
              />
              <h1 className="text-xl md:text-2xl font-bold">{job.title}</h1>
              <h2 className="text-xl md:text-2xl font-semibold">{job.companyName}</h2>
              <h3 className="mt-5">Posted by: {job.postedBy}</h3>
              <p className="mt-3">Experience: {job.experience}</p>
              <p>Vacancies: {job.vacancy || "Not mentioned"}</p>
            </div>

            {/* Qualifications */}
            <div className="w-full rounded-xl mt-4 h-fit bg-white p-4 md:p-5 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">Qualifications</h1>
              {job.qualification && job.qualification.length > 0 ? (
                job.qualification.map((qualification, index) => (
                  <div key={index} className="mb-3">
                    <KeyHighlightsListItem value={qualification.value} />
                  </div>
                ))
              ) : (
                <p className="ml-5">No qualifications listed</p>
              )}

              <h1 className="text-xl md:text-2xl font-semibold mb-4">Specializations</h1>
              {job.specification && job.specification.length > 0 ? (
                job.specification.map((specification, index) => (
                  <div key={index} className="mb-3">
                    <KeyHighlightsListItem value={specification.value} />
                  </div>
                ))
              ) : (
                <p className="ml-5">No specializations listed</p>
              )}
            </div>

            {/* Skills */}
            <div className="w-full rounded-xl mt-4 h-fit bg-white p-4 md:p-5 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">Required Skills</h1>
              {job.must_skills && job.must_skills.length > 0 ? (
                job.must_skills.map((mustSkill, index) => (
                  <div key={index} className="mb-3">
                    <KeyHighlightsListItem value={mustSkill.value} />
                  </div>
                ))
              ) : (
                <p className="ml-5">No Skills listed</p>
              )}

              <h1 className="text-xl md:text-2xl font-semibold mb-4">Other Skills</h1>
              {job.other_skills && job.other_skills.length > 0 ? (
                job.other_skills.map((otherSkills, index) => (
                  <div key={index} className="mb-3">
                    <KeyHighlightsListItem value={otherSkills.value} />
                  </div>
                ))
              ) : (
                <p className="ml-5">No Skills listed</p>
              )}
            </div>

            {/* More Details */}
            <div className="w-full rounded-xl mt-4 h-fit bg-white p-4 md:p-5 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">More Details</h1>
              <ul className="mt-3">
                <li className="mb-4">
                  <KeyHighlightsListItem title="Location" value={job.location || "Not disclosed"} />
                </li>
                <li className="mb-4">
                  <KeyHighlightsListItem title="Department" value={job.department || "Not specified"} />
                </li>
                <li className="mb-4">
                  <KeyHighlightsListItem title="Role" value={job.job_role || "Not specified"} />
                </li>
                <li className="mb-4">
                  <KeyHighlightsListItem title="Employment Type" value={job.type} />
                </li>
                <li className="mb-4">
                  <KeyHighlightsListItem title="Package" value={`${job.salary}` ? `${job.salary} ${job.currency || 'INR'}` : "Not Disclosed"} />
                </li>
              </ul>
            </div>

            {/* Job Description */}
            <div className="bg-white p-4 rounded-lg mt-4">
              <strong>Job Description:</strong>
              <div dangerouslySetInnerHTML={{ __html: job.description }} className="mt-2 text-justify" />
            </div>
          </div>
        </MainContext>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <h1 className="text-xl font-semibold mb-5">Job Details</h1>
            <p className='mx-auto'>No jobs found</p> 
          </div>
        )}
      </div>

      {/* Right Side: Applicants View */}
      <div className="w-full lg:w-1/2 bg-gray-100 p-5 rounded-lg shadow-md h-[48rem]">
        <h1 className="text-xl font-semibold mb-5">Applicants</h1>

        {jobsDataLoading ? (
          [1, 2, 3].map((d) => (
            <div key={d} className="flex-1 bg-white mb-2 w-full flex items-center justify-center h-auto rounded-lg animate-pulse shadow-md gap-2">
              <JobCardSkeleton id={d} />
            </div>
          ))
        ) : (
          <div className="grid h-auto grid-cols-1 gap-2 text-sm">
          {applicants && applicants.length > 0 ? (
              applicants.map((applicant) => (
                <div key={applicant.user_id} className="p-4 bg-white rounded-lg shadow-md relative">
                  <h2 className="font-semibold">{applicant.name}</h2>
                  <div className="w-[60px] h-[60px] flex center absolute right-4 top-4 rounded-lg bg-gray-200">
                    <img 
                      src={applicant.profile_details.profileImg}
                      alt="Profile Image" 
                      className="w-full h-full rounded-lg object-fill"
                    />
                  </div>
                  <p>Qualification: {applicant.profile_details.qualification || "Not mentioned"}</p>
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
                  <hr className='mt-2 mb-2' />
                  
                  <button
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm flex items-center hover:bg-orange-700"
                    onClick={() => handleViewClick(applicant)}
                  >
                    <FaEye className="mr-2" /> View Profile
                  </button>
                </div>
              ))
            ) : (
              <div className="w-full flex flex-col gap-3">
                <h1 className="text-xl font-semibold mb-5">Job Details</h1>
                <p className='mx-auto'>No applicants found</p> 
              </div>
            )}
          </div>
        )}
        {/* Pagination */}
        <div className='mt-4 center'>
          <Pagination total={20} pageSize={limit} current={currentPage} onChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
};

export default AllPostedJobs;