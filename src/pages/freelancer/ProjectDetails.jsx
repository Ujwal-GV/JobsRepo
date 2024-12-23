import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaEye } from 'react-icons/fa6';
import MainContext from "../../components/MainContext";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { JobCardSkeleton } from '../../components/JobCard';
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { MdRefresh } from 'react-icons/md';

const AllPostedJobs = () => {
  const navigate = useNavigate();

  const { id: projectId } = useParams();
  const {profileData} = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [applicants, setApplicants] = useState([]);
  const limit = 3;  // Number of applicants per page
  const [totalData, setTotalData] = useState(0);
  const totalPages = Math.ceil(totalData / limit);
  const [img, setImg] = useState(null);
  const [providerName, setProviderName] = useState("");

  useEffect(()=>{
      if(profileData) {
        setImg(profileData?.img);
        setProviderName(profileData?.name);
      }
    //   queryClient.invalidateQueries(["project_applicants"])
  },[profileData]);

  const fetchProjectDetails = async (projectId, page, limit) => {
    const res = await axiosInstance.get(`/projects/${projectId}`, {
      params: {
        page,
        limit,
      }
    });
    setTotalData(res.data.applied_ids.length);
    return res.data;
  };

  // Using useQuery to fetch jobs
  const {
    data: projectApplicationData,
    isLoading,
    isError,
    error,
    isFetching
  } = useQuery({
    queryKey: ["projectApplication", projectId],
    queryFn: () => fetchProjectDetails(projectId),
    staleTime: 0,
    gcTime: 0,
  });

  // Using useQuery to fetch applicants
  const { 
    isLoading: projectsDataLoading, 
    data: applicantsData, 
    error: applicantsError,
    isFetching: applicantsDataFetching,
    refetch: refetchApplicants,
  } = useQuery({
    queryKey: ['project_applicants', projectId, currentPage],
    queryFn: () => fetchApplicants(projectId, currentPage, limit),
    staleTime: 300000,
    cacheTime: 300000,
    onError: () => {
      toast.error("Something went wrong while fetching applicants");
    },
  });


  // Fetch applicants
  const fetchApplicants = async (projectId, page, limit) => {
    try {
      const response = await axiosInstance.get(`/projects/apply-candidate`, {
        params: {
          id: projectId,
          page,
          limit,
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

  const handleViewClick = (userId) => {
    navigate(`/freelancer/view-candidate/${projectId}/${userId}`);
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
    if (applicantsData) {
      applicantsData.flatMap((applicants) =>  
        setApplicants(applicants.candidates)    
      )
    }
  }, [applicantsData]);

  if (isLoading || isFetching) {
    return <Loading />;
  }
  if (isError) {
      
    toast.error(error.response.data.message);
  }

  const {
    cost,
    name: projectTitle,
    dueTime,
    project_id,
    skills,
    description,
    applied_ids,
  } = projectApplicationData || {};

  return (
    <>
      <div className="w-full flex center py-2 sticky pt-8 bg-slate-100">
        <CustomBreadCrumbs
          items={[
            {
              path: "/freelancer",
              icon: <CiHome />,
              title: "Home",
            },
            { title: "Project Application", icon: <CiUser /> },
          ]}
        />
      </div>
      <div className="w-full lg:w-full flex flex-col lg:flex-row gap-10 min-h-screen bg-gray-100 py-5 px-3 md:py-5 md:px-6 lg:px-10 font-outfit">
        {/* Left Side: Project Details */}
        <div className="w-full lg:w-1/2 p-5 rounded-lg shadow-md h-[48rem] overflow-y-auto custom-scroll relative bg-gray-50">
          {projectApplicationData ? (
            <MainContext>
              <h1 className="text-2xl font-bold mb-5 text-gray-800">Project Details</h1>
              <div className="w-full flex flex-col gap-6">

                {/* Project Info */}
                <div className="w-full rounded-xl h-fit bg-white p-6 shadow-lg font-outfit relative">
                  {/* <img 
                    src={img} 
                    alt={providerName} 
                    className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover absolute top-4 right-4 border-2 border-gray-200" 
                  /> */}
                  <h1 title={projectTitle} className="text-lg md:text-2xl font-bold text-gray-900 mb-1 pr-2 truncate">{projectTitle}</h1>
                  {/* <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-3">{providerName}</h2> */}
                  <h3 className="text-sm md:text-base text-gray-600">Project-Id: {project_id}</h3>
                  <h3 className="text-sm md:text-base text-gray-600 mt-1">Posted by  : {providerName}</h3>
                </div>

                {/* Skills Section */}
                <div className="w-full rounded-xl bg-white p-6 shadow-lg font-outfit">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Required Skills</h1>
                  {skills && skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <div key={index} className="mb-2">
                        <KeyHighlightsListItem value={skill} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No Skills listed</p>
                  )}
                </div>

                <div className="w-full rounded-xl bg-white p-6 shadow-lg font-outfit">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Other Details</h1>
                    <KeyHighlightsListItem
                        title='Cost'
                        value={!cost ? "Not Mentioned" : `INR ${cost?.amount}`}
                        className="mb-5"
                      />

                      <KeyHighlightsListItem
                        title='Due Time'
                        value={dayjs(dueTime).format("DD-MM-YYYY")}
                      />
                </div>

                {/* Project  Description */}
                <div className="bg-white p-6 rounded-xl shadow-lg  max-w-full overflow-hidden">
                    <KeyHighlightsListItem
                      title='Job Description'
                    />
                  <div dangerouslySetInnerHTML={{ __html: description }} className="mt-2 text-justify text-gray-700 overflow-auto whitespace-normal break-words" />
                </div>
              </div>
            </MainContext>
          ) : (
            <div className="w-full flex flex-col gap-3">
              <h1 className="text-xl font-semibold mb-5">Project Details</h1>
              <p className='mx-auto text-gray-600'>No project found</p> 
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
          {projectsDataLoading || applicantsDataFetching ? (
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
                <>
                  {applicants.map((applicant) => (
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
                  ))}
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
                </>
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