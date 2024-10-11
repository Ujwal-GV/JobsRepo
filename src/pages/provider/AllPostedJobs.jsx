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

  const fetchApplicants = async (job_id) => {
    try {
      const response = await axios.get(`http://localhost:8087/jobs/${job_id}`, {
        params: {
          applied_details: true,
          page: "1",
          limit: "2",
        }
      });

      // console.log("API_DATA",response.data);
      

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
    queryKey: ['applicants', "APP-2"],
    queryFn: () => fetchApplicants("APP-2"),
    staleTime: 300000, // Data will remain fresh for 5 minutes
    cacheTime: 300000, // Cache the data for 5 minutes
    onError: () => {
      setError("Something went wrong while fetching applicants");
    },
  });

  // applicantsData.job.forEach(job => {
  //     console.log("Hi",job);
  //     setApplicants(applicantsData.job.User_info);
  //     setLoading(false);
  //   });
  // console.log("Data",applicantsData);

  const handleViewClick = (applicant) => {
    navigate(`/provider/view-candidate/${applicant.user_id}`, { state: { applicant } });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (applicantsData && applicantsData.job && applicantsData.job.User_info) {
      const applicants = applicantsData.job.User_info;
      // console.log("Applicants",applicants);
      setApplicants(applicants);
    }
  }, [applicantsData]);


  return (
    <div className="w-full lg:w-full flex flex-col lg:flex-row gap-10 min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10 font-outfit">
      {/* Left Side: Jobs List with Scroll */}
      <div className="w-full lg:w-1/2 p-5 rounded-lg shadow-md h-[75vh] overflow-y-auto custom-scroll relative">
        <MainContext>
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
              <h3 className="mt-5">Posted by: {job.providerName}</h3>
              <p className="mt-3">Experience: {job.experience}</p>
              <p>Vacancies: {job.vacancies || "Not mentioned"}</p>
            </div>

            {/* Qualifications */}
            <div className="w-full rounded-xl mt-4 h-fit bg-white p-4 md:p-5 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">Qualifications</h1>
              {job.qualifications && job.qualifications.length > 0 ? (
                job.qualifications.map((qualification, index) => (
                  <div key={index} className="mb-3">
                    <KeyHighlightsListItem value={qualification.value} />
                  </div>
                ))
              ) : (
                <p className="ml-5">No qualifications listed</p>
              )}

              <h1 className="text-xl md:text-2xl font-semibold mb-4">Specializations</h1>
              {job.specializations && job.specializations.length > 0 ? (
                job.specializations.map((specialization, index) => (
                  <div key={index} className="mb-3">
                    <KeyHighlightsListItem value={specialization.value} />
                  </div>
                ))
              ) : (
                <p className="ml-5">No specializations listed</p>
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
                  <KeyHighlightsListItem title="Role" value={job.jobRole || "Not specified"} />
                </li>
                <li className="mb-4">
                  <KeyHighlightsListItem title="Employment Type" value={job.employmentType} />
                </li>
                <li className="mb-4">
                  <KeyHighlightsListItem title="Package" value={`${job.package} ${job.currency || 'INR'}`} />
                </li>
              </ul>
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

        {jobsDataLoading ? (
          [1, 2, 3, 4, 5].map((d) => (
            <div key={d} className="flex-1 bg-white w-full flex items-center justify-center h-auto rounded-lg animate-pulse shadow-md">
              <JobCardSkeleton id={d} />
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1 gap-4 text-sm">
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
                  {console.log("APP",applicant)}
                  
                  <button
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm flex items-center hover:bg-orange-700"
                    onClick={() => handleViewClick(applicant)}
                  >
                    <FaEye className="mr-2" /> View Profile
                  </button>
                </div>
              ))
            ) : (
              <p>No applicants found</p>
            )}
          </div>
        )}
       <div className='mt-4 center'>
        <Pagination total={10} current={1} onChange={handlePageChange} />
       </div>
      </div>
    </div>
  );
};

export default AllPostedJobs;
