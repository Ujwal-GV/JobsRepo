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
import moment from 'moment/moment';
import dayjs from 'dayjs';
import { FaCheck, FaCheckCircle, FaCross } from 'react-icons/fa';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdRefresh } from 'react-icons/md';
import { useMutation } from "@tanstack/react-query"; 


const AllPostedJobs = () => {
  const navigate = useNavigate();

  const { id: jobApplicationId } = useParams();
  const {profileData} = useContext(AuthContext);  

  const [currentPage, setCurrentPage] = useState(1);
  const [applicants, setApplicants] = useState([]);
  const limit = 12;  // Number of applicants per page
  const [totalData, setTotalData] = useState(0);
  const totalPages = Math.ceil(totalData / limit);

  const [reportClicked, setReportClicked] = useState(false);

  const [reportReason, setReportReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

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
    error: applicantsError,
    refetch: refetchApplicants,
    isFetching: applicantsFetching
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
        setTotalData(response.data.job.applied_ids.length);
        
        return response.data;
      } else {
        throw new Error("No applicants found");
      }
    } catch (err) {
      throw new Error("Failed to fetch applicants");
    }
  };

  const { 
    mutate: reportUser, 
    isLoading: isReporting, 
    isPending: isReportingPending 
  } = useMutation({
    mutationKey: ["report-user"],
    mutationFn: async (data) => {
      const res = await axiosInstance.post('/reports/user', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Report submitted successfully");
      setReportClicked(false);
      setReportReason('');
      setOtherReason('');
      closeModal();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });


  const handleViewClick = (userId) => {
    navigate(`/provider/view-candidate/${jobApplicationId}/${userId}`);
  };

  const handlePageChange = (val) => {
    if (val <= totalPages && val > 0) {
      setCurrentPage(val);
    }
  };  

  const handleRefreshCandidates = () => {
    refetchApplicants();
  }

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
    toast.error(error.response.data.message);
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
    createdAt,
  } = jobApplicationData?.job || {};

  const {
    company_name,
    img,
  } = jobApplicationData?.company || {};

  const postedDate = dayjs(createdAt).isValid() ? dayjs(createdAt).format("DD MMM YYYY") : "Invlalid format";
  // console.log("P",postedDate);
  
  const deadLine = dayjs(createdAt).add(1, 'M');
  // console.log("D", deadLine);

  const remainingDays = dayjs(deadLine).diff(dayjs(), 'day');
  // console.log("R", remainingDays);

  const handleCandidateOption = () => {
    setReportClicked(!reportClicked);
  }

  const handleReportAction = (user_id) => {
    const reportData = {
      reportedBy: profileData.company_id,
      reportedTo: user_id,
      content: reportReason === 'Other' ? otherReason : reportReason,
    };
  
    if (!reportData.content) {
      toast.error("Please select a reason for reporting.");
      return;
    }

    reportUser(reportData);
  };
  

  const closeModal = () => {
    setReportClicked(false);
    setReportReason("");
    setOtherReason("");
  };

  const handleShortlistButton = () => {
    navigate(`/provider/shortlist/${jobApplicationId}`);
  }

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
              <div className="flex flex-col items-center justify-between lg:flex-row mb-2">
                <h1 className="text-2xl font-bold mt-2 text-gray-800">Job Details</h1>
                <button 
                  className='bg-orange-600 lg:p-2 px-1 py-2 rounded-lg hover:bg-orange-700 hover:shadow-lg text-white'
                  onClick={handleShortlistButton}
                >
                  Shortlisted Candidates
                </button>
              </div>
              <div className="w-full flex flex-col gap-6">

                {/* Company and Job Info */}
                <div className="w-full rounded-xl h-fit bg-white p-6 shadow-lg font-outfit relative">
                  {/* <img 
                    src={img?.url} 
                    alt={company_name} 
                    className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover absolute top-4 right-4 border-2 border-gray-200" 
                  /> */}
                  <h1 title={jobTitle} className="text-lg md:text-3xl font-bold text-gray-900 mb-1 pr-2 truncate">{jobTitle}</h1>
                  <h2 className="text-md md:text-xl font-semibold text-gray-700 mb-3">{company_name}</h2>
                  <h3 className="text-sm md:text-base text-gray-600">Job-Id: {job_id}</h3>
                  <h3 className="text-sm md:text-base text-gray-600 mt-1">Posted by: {postedBy}</h3>
                  {experience && (
                    <p className="text-sm md:text-base text-gray-600 mt-2">Experience: {experience?.min} - {experience?.max} years</p>
                  )}
                  <p className="text-sm md:text-base text-gray-600 mt-2">Vacancies: {vacancy || "Not mentioned"}</p>
                  {/* <p className="text-sm md:text-base text-gray-600 mt-2">Posted: {moment(createdAt).fromNow()}</p> */}
                  
                  {/* <div className='w-full p-2 bg-gray-200 text-black rounded-lg text-sm hover:bg-gray-300 transition-colors duration-200 ease-in-out shadow-md'>
                    <p className="text-sm md:text-base text-gray-600"><b>Posted On:</b> {postedDate}</p>
                    <p className="text-sm md:text-base text-gray-600 mt-2">Apply By: {deadLine}</p>
                    <p className="text-sm md:text-base text-gray-600"><b>Remaining Days:</b> {remainingDays}</p>
                  </div> */}

                </div>

                {/* Qualifications Section */}
                <div className="w-full rounded-xl bg-white p-6 shadow-lg font-outfit">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Qualifications</h1>
                  {qualification && qualification.length > 0 ? (
                    qualification.map((qualification, index) => (
                      <div key={index} className="mb-2 text-sm lg:text-md md:text-md">
                        <KeyHighlightsListItem marginBottom={1} value={qualification} />
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
                      <div key={index} className="mb-2 text-sm lg:text-md md:text-md">
                        <KeyHighlightsListItem marginBottom={1} value={specification} />
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
                      <div key={index} className="mb-2 text-sm lg:text-md md:text-md">
                        <KeyHighlightsListItem marginBottom={1} value={mustSkill} />
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
                      <div key={index} className="mb-2 text-sm lg:text-md md:text-md">
                        <KeyHighlightsListItem marginBottom={1} value={otherSkill} />
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
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-full overflow-hidden">
                  <strong className="text-lg font-semibold">Job Description:</strong>
                  <div dangerouslySetInnerHTML={{ __html: job_description }} className="mt-2 text-justify text-gray-700 overflow-auto whitespace-normal break-words" />
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
        <div className="w-full lg:w-1/2 bg-gray-100 p-5 rounded-lg shadow-md h-[48rem] overflow-y-auto custom-scroll flex flex-col relative">
          <h1 className="text-2xl font-bold mb-5 text-gray-800">Applicants</h1>
          <button
            onClick={handleRefreshCandidates}
            className="absolute mb-4 px-2 py-2 right-6 text-gray-800 rounded-full flex items-center gap-2 hover:bg-gray-200 transition-all"
          >
            <MdRefresh className="text-xl" />
          </button>
          {jobsDataLoading || applicantsFetching ? (
            [1, 2, 3].map((d) => (
              <div className="w-full flex flex-col items-center">
                {[1, 2, 3].map((d) => (
                  <div key={d} className="flex grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 bg-gray-200 pr-6 mx-2 w-full flex items-center justify-center h-auto rounded-lg animate-pulse shadow-lg gap-2">
                    <JobCardSkeleton id={d} />
                    <JobCardSkeleton id={d} />
                    <JobCardSkeleton id={d} />
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-4 text-sm">
              {applicants && applicants.length > 0 ? (
                <>                
                  {applicants.map((applicant) => (
                    <div key={applicant.user_id} className="p-4 bg-white rounded-lg shadow-lg relative">
                      <div className="w-[50px] h-[50px] rounded-full bg-gray-200 overflow-hidden shadow-md">
                      <BiDotsVerticalRounded 
                        onClick={handleCandidateOption}
                        className='absolute right-3 border-2 border-gray-400 rounded-full text-2xl text-gray-400 cursor-pointer hover:bg-gray-600 hover:text-white hover:border-gray-600'
                      />
                      {reportClicked && (
                          <div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                            onClick={closeModal}
                          >
                            <div
                              className="bg-white lg:text-md md:text-md mx-4 p-4 rounded-lg shadow-lg max-w-sm w-[80%]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <h3 className="text-lg center font-semibold text-gray-800 mb-4">Report User</h3>
                              <hr className='w-[90%] mx-auto mb-2' />
                              <p className="text-sm text-gray-600 mb-4">
                                Please select a reason for reporting this user.
                              </p>
                              {[
                                "Inappropriate behavior", 
                                "Spam or fraud", 
                                "Harassment",
                                "Unprofessional Behavior",
                                "Offensive Content",
                                "Other"
                              ].map((reason) => (
                                <div className="mb-2" key={reason}>
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="reportReason"
                                      value={reason}
                                      checked={reportReason === reason}
                                      onChange={(e) => setReportReason(e.target.value)}
                                      className="form-radio text-red-600"
                                    />
                                    <span className="text-gray-600">{reason}</span>
                                  </label>
                                </div>
                              ))}
                              {reportReason === "Other" && (
                                <div className="mt-2">
                                  <textarea
                                    placeholder="Describe the issue..."
                                    value={otherReason}
                                    onChange={(e) => setOtherReason(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                  />
                                </div>
                              )}
                              <div className="mt-4 flex justify-end gap-4">
                                <button
                                  onClick={() => handleReportAction(applicant.user_id)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm flex items-center justify-center hover:bg-red-700 transition-colors duration-200 ease-in-out shadow-md"
                                  disabled={isReporting || isReportingPending}
                                >
                                  {isReporting || isReportingPending ? "Reporting..." : "Report"}
                                </button>
                                <button
                                  onClick={closeModal}
                                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg text-sm flex items-center justify-center hover:bg-gray-400 transition-colors duration-200 ease-in-out shadow-md"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        <img
                          src={applicant?.profile_details?.profileImg ? applicant.profile_details.profileImg : "img"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h2 className="font-semibold text-sm lg:text-lg truncate lg:text-md text-gray-800">{applicant.name}</h2>

                      {applicant?.education_details?.qualification ? (
                        <>
                          {(() => {
                              const qualificationsArray = applicant?.education_details?.qualification.split(',').map(q => q.trim());
                              const jobArray = jobApplicationData?.job?.qualification;

                              const matchedOnes = qualificationsArray.filter(q =>
                              jobArray.includes(q)
                              ).length;

                              const totalQualifications = jobArray.length;

                              return matchedOnes > 0 ? (
                                <span className="flex items-center space-x-1">
                                  <FaCheckCircle size="20px" color='light-green' className="rounded-full p-[3px] text-green-500 mb-3" />
                                  <p className="text-xs text-gray-600">Qualification matched</p>
                                </span>
                              ) : (
                                <span className="flex items-center space-x-1">
                                  <AiFillCloseCircle size="20px" color='light-red' className="rounded-full p-[2px] text-red-500 mb-3" />
                                  <p className="text-xs text-gray-600">No Qualification matched</p>
                                </span>
                              );
                            })()}
                        </>
                      ) : (
                        <p className="text-xs text-gray-500">No qualifications listed</p>
                      )}

                      {applicant?.profile_details?.skills ? (
                        <>
                          {(() => {
                            const jobSkillsSet = new Set([
                              ...(jobApplicationData?.job?.must_skills || []),
                              ...(jobApplicationData?.job?.other_skills || [])
                            ]);

                            const uniqueJobSkills = Array.from(jobSkillsSet);

                            const matchedSkills = applicant.profile_details.skills.filter(skill =>
                              uniqueJobSkills.includes(skill)
                            );

                            const totalSkills = uniqueJobSkills.length;
                            const matchedSkillsCount = matchedSkills.length;

                            return matchedSkillsCount > 0 ? (
                              <span className="flex items-center space-x-1">
                                <FaCheckCircle size="20px" color='light-green' className="rounded-full p-[3px] text-green-500 mb-3" />
                                <p className="text-xs text-gray-600">
                                  {`${matchedSkillsCount} out of ${totalSkills} skills matched`}
                                </p>
                              </span>
                            ) : (
                                  <span className="flex items-center space-x-1">
                                    <AiFillCloseCircle size="20px" color='light-red' className="rounded-full p-[2px] text-red-500 mb-3" />                                    
                                    <p className="text-xs text-gray-600">No skills matched</p>
                                  </span>
                                );
                          })()}
                        </>
                      ) : (
                        <p className="text-xs text-gray-500">No skills listed</p>
                      )}

                      <hr className="mt-1 mb-2 border-gray-200" />
                      <span className='center'>
                        <button
                          className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm flex items-center justify-center hover:bg-orange-700 transition-colors duration-200 ease-in-out shadow-md"
                          onClick={() => handleViewClick(applicant.user_id)}
                        >
                          <FaEye className="mr-2" /> View Profile
                        </button>
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <p className="text-lg text-gray-500">No applicants found</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-4 flex justify-center">
            <Pagination
              disabled={isLoading || isFetching}
              pageSize={limit}
              total={totalData}
              defaultCurrent={1}
              current={currentPage}
              onChange={(page) => handlePageChange(page)}
              className="pagination"
              showSizeChanger={false}
              prevIcon={
                <button
                  disabled={isLoading || isFetching || currentPage === 1}
                  className={"hidden md:flex " + (currentPage === 1 && " !hidden")}
                  style={{ border: "none", background: "none" }}
                >
                  ← Prev
                </button>
              }
              nextIcon={
                <button
                  disabled={isLoading || isFetching || currentPage >= totalPages}
                  className={
                    "hidden md:flex " + 
                    (currentPage < totalPages ? "" : "!hidden")
                  }
                  style={{ border: "none", background: "none" }}
                >
                  Next →
                </button>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPostedJobs;
