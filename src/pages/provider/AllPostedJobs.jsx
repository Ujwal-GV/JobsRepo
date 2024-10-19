import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaEye } from 'react-icons/fa6';
import MainContext from "../../components/MainContext";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { JobCardSkeleton } from '../../components/JobCard';
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { Pagination } from "antd";
import Loading from '../Loading';
import toast from 'react-hot-toast';
import { axiosInstance, getError } from "../../utils/axiosInstance";
import { AuthContext } from '../../contexts/AuthContext';
import { IoIosBriefcase } from 'react-icons/io';
import CustomBreadCrumbs from '../../components/CustomBreadCrumbs';
import { CiHome, CiUser } from 'react-icons/ci';

const AllPostedJobs = () => {
  const navigate = useNavigate();

  const { id: jobApplicationId } = useParams();
  const {profileData} = useContext(AuthContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [applicants, setApplicants] = useState([]);
  const limit = 3;  // Number of applicants per page

  useEffect(()=>{
      if(profileData?.application_applied_info?.jobs?.find((id)=>id.jobId === jobApplicationId)) {
        setApplied(true)
      }
      if(profileData?.saved_ids?.jobs?.find((id)=>id === jobApplicationId)) {
        setSaved(true)
      }
  },[profileData])

  const fetchJobDetails = async (jobId, page, limit) => {
    const res = await axiosInstance.get(`/jobs/${jobId}`, {
      params: {
        applied_details: true,
        page,
        limit,
      }
    });
    console.log("Job Response:", res.data);
    return res.data;
  };

  // Using useQuery to fetch jobs
  const {
    data: jobApplicationData,
    isLoading,
    isError,
    error,
    isFetching
  } = useQuery({
    queryKey: ["jobApplication", jobApplicationId],
    queryFn: () => fetchJobDetails(jobApplicationId),
    staleTime: 0,
    gcTime: 0,
  });

  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  // Using useQuery to fetch applicants
  const { 
    isLoading: jobsDataLoading, 
    data: applicantsData, 
    error: applicantsError 
  } = useQuery({
    queryKey: ['applicants', jobApplicationId, currentPage],
    queryFn: () => fetchApplicants(jobApplicationId, currentPage, limit),
    staleTime: 300000,
    cacheTime: 300000,
    onError: () => {
      toast.error("Something went wrong while fetching applicants");
    },
  });


  // Fetch applicants
  const fetchApplicants = async (jobId, page, limit) => {
    try {
      const response = await axiosInstance.get(`/jobs/${jobId}`, {
        params: {
          applied_details: true,
          page,
          limit,
        }
      });

      if (response.data) {
        console.log("Applicants_Response:", response.data.job);
        return response.data;
      } else {
        throw new Error("No applicants found");
      }
    } catch (err) {
      throw new Error("Failed to fetch applicants");
    }
  };

  const handleViewClick = (userId) => {
    navigate(`/provider/view-candidate/${userId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (applicantsData && applicantsData.job && applicantsData.job.User_info) {
      const applicants = applicantsData.job.User_info;
      setApplicants(applicants);
    }
  }, [applicantsData]);

  if (isLoading || isFetching) {
    return <Loading />;
  }
  if (isError) {
    console.log(error);
    
    // toast.error(error.response.data.message);
  }

  const {
    title: jobTitle,
    package: salary,
    job_id,
    experience,
    vacancy,
    description: job_description,
    qualification,
    type,
    must_skills,
    other_skills,
    specification,
    location,
    job_role,
    postedBy,
  } = jobApplicationData?.job || {};

  const {
    company_name,
    img,
  } = jobApplicationData?.company || {};

  return (
    <>
      <div className="w-full flex center py-2 sticky pt-8 bg-slate-100">
        <CustomBreadCrumbs
          items={[
            {
              path: "/provider",
              icon: <CiHome />,
              title: "Home",
            },
            { title: "Job Application", icon: <CiUser /> },
          ]}
        />
      </div>
      <div className="w-full lg:w-full flex flex-col lg:flex-row gap-10 min-h-screen bg-gray-100 py-5 px-3 md:py-5 md:px-6 lg:px-10 font-outfit">
        {/* Left Side: Job Details */}
        <div className="w-full lg:w-1/2 p-5 rounded-lg shadow-md h-[48rem] overflow-y-auto custom-scroll relative bg-gray-50">
          {jobApplicationData ? (
            <MainContext>
              <h1 className="text-2xl font-bold mb-5 text-gray-800">Job Details</h1>
              <div className="w-full flex flex-col gap-6">

                {/* Company and Job Info */}
                <div className="w-full rounded-xl h-fit bg-white p-6 shadow-lg font-outfit relative">
                  <img 
                    src={img?.url} 
                    alt={company_name} 
                    className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover absolute top-4 right-4 border-2 border-gray-200" 
                  />
                  <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">{jobTitle}</h1>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-3">{company_name}</h2>
                  <h3 className="text-sm md:text-base text-gray-600">Job-Id: {job_id}</h3>
                  <h3 className="text-sm md:text-base text-gray-600 mt-1">Posted by: {postedBy}</h3>
                  {experience && (
                    <p className="text-sm md:text-base text-gray-600 mt-2">Experience: {experience?.min} - {experience?.max} years</p>
                  )}
                  <p className="text-sm md:text-base text-gray-600 mt-2">Vacancies: {vacancy || "Not mentioned"}</p>
                </div>

                {/* Qualifications Section */}
                <div className="w-full rounded-xl bg-white p-6 shadow-lg font-outfit">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Qualifications</h1>
                  {qualification && qualification.length > 0 ? (
                    qualification.map((qualification, index) => (
                      <div key={index} className="mb-2">
                        <KeyHighlightsListItem value={qualification} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No qualifications listed</p>
                  )}
                </div>

                {/* Specializations Section */}
                <div className="w-full rounded-xl bg-white p-6 shadow-lg font-outfit">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Specializations</h1>
                  {specification && specification.length > 0 ? (
                    specification.map((specification, index) => (
                      <div key={index} className="mb-2">
                        <KeyHighlightsListItem value={specification} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No Specializations listed</p>
                  )}
                </div>

                {/* Required Skills Section */}
                <div className="w-full rounded-xl bg-white p-6 shadow-lg font-outfit">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Required Skills</h1>
                  {must_skills && must_skills.length > 0 ? (
                    must_skills.map((mustSkill, index) => (
                      <div key={index} className="mb-2">
                        <KeyHighlightsListItem value={mustSkill} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No Skills listed</p>
                  )}
                </div>

                {/* Other Skills Section */}
                <div className="w-full rounded-xl bg-white p-6 shadow-lg font-outfit">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Other Skills</h1>
                  {other_skills && other_skills.length > 0 ? (
                    other_skills.map((otherSkill, index) => (
                      <div key={index} className="mb-2">
                        <KeyHighlightsListItem value={otherSkill} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No Skills listed</p>
                  )}
                </div>

                {/* More Details */}
                <div className="w-full rounded-xl bg-white p-6 shadow-lg font-outfit">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">More Details</h1>
                  <ul className="text-sm md:text-base text-gray-600">
                    <li className="mb-4">
                      {location?.length > 0 && (
                        <KeyHighlightsListItem
                          className="flex-row mb-2"
                          key={"location"}
                          title="Location"
                          value={location?.join(", ")}
                        />
                      )}
                    </li>
                    <li className="mb-4">
                      <KeyHighlightsListItem title="Role" value={job_role || "Not specified"} />
                    </li>
                    <li className="mb-4">
                      <KeyHighlightsListItem title="Employment Type" value={type} />
                    </li>
                    <li className="mb-4">
                      <KeyHighlightsListItem
                        title='Salary'
                        value={!salary?.disclosed ? "Not Disclosed" : `${salary?.min} - ${salary?.max} LPA`}
                      />
                    </li>
                  </ul>
                </div>

                {/* Job Description */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <strong className="text-lg font-semibold">Job Description:</strong>
                  <div dangerouslySetInnerHTML={{ __html: job_description }} className="mt-2 text-justify text-gray-700" />
                </div>
              </div>
            </MainContext>
          ) : (
            <div className="w-full flex flex-col gap-3">
              <h1 className="text-xl font-semibold mb-5">Job Details</h1>
              <p className='mx-auto text-gray-600'>No job found</p> 
            </div>
          )}
        </div>

        {/* Right Side: Applicants View */}
        <div className="w-full lg:w-1/2 bg-gray-100 p-5 rounded-lg shadow-md h-[48rem] overflow-y-auto custom-scroll">
          <h1 className="text-2xl font-bold mb-5 text-gray-800">Applicants</h1>
          {jobsDataLoading ? (
            [1, 2, 3].map((d) => (
              <div
                key={d}
                className="flex-1 bg-gray-200 mb-2 w-full flex items-center justify-center h-auto rounded-lg animate-pulse shadow-lg gap-2"
              >
                <JobCardSkeleton id={d} />
              </div>
            ))
          ) : (
            <div className="grid h-auto grid-cols-1 gap-4 text-sm">
              {applicants && applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <>
                    <div key={applicant.user_id} className="p-4 bg-white rounded-lg shadow-lg relative">
                    <h2 className="font-semibold text-lg text-gray-800">{applicant.name}</h2>
                    <div className="w-[60px] h-[60px] absolute right-4 top-4 rounded-full bg-gray-200 overflow-hidden shadow-md">
                      <img
                        src={applicant.profile_details.profileImg}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-gray-600 mt-1">Qualification: {applicant.education_details.qualification || "Not mentioned"}</p>
                    <div className="mt-3 mb-2">
                      <h4 className="font-semibold text-gray-700">Skills:</h4>
                      {applicant.profile_details.skills && applicant.profile_details.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {applicant.profile_details.skills.map((skill, index) => (
                            <span key={index} className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No skills added</p>
                      )}
                    </div>
                    <hr className="mt-3 mb-3 border-gray-200" />
                    <button
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm flex items-center justify-center hover:bg-orange-700 transition-colors duration-200 ease-in-out shadow-md"
                      onClick={() => handleViewClick(applicant.user_id)}
                    >
                      <FaEye className="mr-2" /> View Profile
                    </button>
                  </div>
                   {/* Pagination */}
                  <div className="mt-4 flex justify-center">
                    <Pagination
                      total={20}
                      pageSize={limit}
                      current={currentPage}
                      onChange={handlePageChange}
                      className="pagination"
                    />
                  </div>
                  </>
                ))
              ) : (
                <div className="w-full flex flex-col items-center">
                  <p className="text-lg text-gray-500">No applicants found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllPostedJobs;