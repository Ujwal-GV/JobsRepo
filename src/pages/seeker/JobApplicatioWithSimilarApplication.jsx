import React, { useContext, useEffect, useState } from "react";
import MainContext from "../../components/MainContext";
import { FaCheckCircle } from "react-icons/fa";
import JobSuggestionCard from "../../components/JobSuggestionCard";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { IoIosPeople, IoIosBriefcase } from "react-icons/io";
import ReadMore from "../../components/ReadMore";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance, getError } from "../../utils/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "../Loading";
import toast from "react-hot-toast";
import { LuLoader2 } from "react-icons/lu";
import { AuthContext } from "../../contexts/AuthContext";
import { Steps } from "antd";
import { useGetProfileData } from "./queries/ProfileQuery";
import { CustomSkeleton } from "./CompanyAllPosts";
import SomethingWentWrong from "../../components/SomethingWentWrong";

const VerticalBar = () => {
  return <div className="w-0 h-5 border-r border-black"></div>;
};

const JobApplicatioWithSimilarApplication = () => {
  const { id: jobApplicationId, applied: jobApplied } = useParams();
  const { profileData } = useContext(AuthContext);
  const [user_id, setUser_id] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState([]);

  useEffect(() => {
    if (profileData && profileData !== null) {
      if (
        profileData?.application_applied_info?.jobs?.find(
          (id) => id.jobId === jobApplicationId
        )
      ) {
        setApplied(true);
      }

      if (profileData?.saved_ids?.jobs?.find((id) => id === jobApplicationId)) {
        setSaved(true);
      }
      setUser_id(profileData?.user_id);
    }
  }, [profileData]);

  const navigate = useNavigate();

  const fetchJobDetails = async (jobId) => {
    const res = await axiosInstance.get(`/jobs/${jobId}`, {
      params: { similar_jobs: true },
    });
    const { saved_ids, applied_ids } = res.data.job;
    if (saved_ids?.find((id) => id === profileData?.user_id)) {
      setSaved(true);
    }
    if (applied_ids?.find((ids) => ids.userId === profileData?.user_id)) {
      setApplied(true);
    }
    return res.data;
  };

  const {
    data: jobApplicationData,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess
  } = useQuery({
    queryKey: ["jobApplication", jobApplicationId],
    queryFn: () => fetchJobDetails(jobApplicationId),
    staleTime: 0,
    gcTime: 0,
  });

  const getApplicationStatus = async () => {
    const res = await axiosInstance.post("/jobs/user/status", {
      applicationId: jobApplicationId,
      user_Id: user_id,
    });

    if (res.data?.applicationStatus) {
      
      let modifyStatus =[]

      if(res.data?.applicationStatus?.status?.length === 1)
      {
         modifyStatus =  res.data?.applicationStatus?.status?.map((s) => {
          return { title: s  ,status: "finish"};
        });
        modifyStatus.push({title:"Viewed" ,status: "wait"})
      } 
      else{
        modifyStatus = res.data?.applicationStatus?.status?.map((s) => {
          return { title: s ,status: "finish" };
        });
      }
      
      console.log(modifyStatus)

      setApplicationStatus((prev) => {
        return [ ...modifyStatus ]
      });
    }
    return res.data;
  };

  const {
    data: ApplicationStatusData,
    error: ApplicationStatusError,
    isLoading: ApplicationStatusLoading,
    isFetching: ApplicationStatusFetching,
  } = useQuery({
    queryKey: ["application-status", jobApplicationId],
    queryFn: getApplicationStatus,
    staleTime: 1000 * 60,
    gcTime: 0,
    enabled: user_id !== null ? true : false,
  });

  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const savedPost = async (jobId) => {
    const res = await axiosInstance.post("/user/job/save", { jobId: jobId });
    return res.data;
  };

  const unsavedPost = async (jobId) => {
    const res = await axiosInstance.post("/user/job/unsave", { jobId: jobId });
    return res.data;
  };

  const applyForPost = async (jobId) => {
    const res = await axiosInstance.post("/user/job/apply", {
      applicationId: jobId,
    });
    return res.data;
  };

  const savepostMutation = useMutation({
    mutationKey: ["save-post"],
    mutationFn: savedPost,
    onSuccess: () => {
      toast.success("Post Saved");
      setSaved(true);
    },
    onError: (error) => {
      console.log(error);
      const { message } = getError(error); // Error handling function
      if (message) {
        toast.error(message);
      } else {
        toast.error("Something Went Wrong");
      }
    },
  });

  const unsavePostMutation = useMutation({
    mutationFn: unsavedPost,
    mutationKey: ["unsave-post"],
    onSuccess: () => {
      toast.success("Post removed Successfully");
      setSaved(false);
    },
    onError: (error) => {
      const { message } = getError(error);
      if (message) {
        toast.error(message);
      } else {
        toast.error("Something Went Wrong");
      }
    },
  });

  const jobApplyMutation = useMutation({
    mutationFn: applyForPost,
    mutationKey: ["apply-post"],
    onSuccess: () => {
      toast.success("Applied Successfully");
      setApplied(true);
    },
    onError: () => {
      const { message } = getError(error);
      if (message) {
        toast.error(message);
      } else {
        toast.error("Something Went Wrong");
      }
    },
  });

  const handleSaveBtnClick = () => {
    if (profileData?.user_id) {
      if (!saved) {
        savepostMutation.mutate(job_id);
      } else {
        unsavePostMutation.mutate(job_id);
      }
    } else {
      navigate("/login");
    }
  };

  const handleApplyClick = () => {
    if (profileData?.user_id) {
      jobApplyMutation.mutate(job_id);
    } else {
      navigate("/login");
    }
  };

  if (isLoading || isFetching) {
    return <Loading />;
  }
  if (isError || error) {
    return <SomethingWentWrong />
  }

  const {
    title: jobTitle,
    package: salary,
    job_id,
    experience,
    vacancy,
    applied_ids,
    description: job_description,
    qualification,
    type,
    must_skills,
    other_skills,
    specification,
    location,
    job_role,
  } = jobApplicationData?.job || {};


  const {
    company_name,
    img,
    description: company_description,
  } = jobApplicationData?.company || {};


  console.log(jobApplicationData?.company)

  if (jobApplicationData && isSuccess) {
    return (
      <MainContext>
        <div className="w-full min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10  !pb-2 ">
          <div className="bg-white p-1 flex justify-between md:gap-3 lg:gap-10 flex-col lg:flex-row">
            <div className="w-full  lg:w-[55%] job-apply-section">
              <div className="w-full rounded-xl  h-fit bg-white p-2 md:p-10 font-outfit relative">
                <img
                  className="border border-gray-100  absolute top-2 right-2 md:top-10 md:right-10 w-12 h-12 md:w-16 md:h-16 rounded-lg"
                  src={img?.url || "https://wheretocart.com/assets/images/business-image/business-default.jpg"}
                  alt={company_name}
                />
                <h1 className="text-[1.1rem] md:text-2xl font-semibold max-w-[80%] overflow-hidden text-ellipsis text-nowrap">
                  {jobTitle}
                </h1>
                <h3 className="text-sm font-light mt-1 max-w-[80%] overflow-hidden text-ellipsis text-nowrap">
                  {company_name}
                </h3>
                <div className="flex gap-2 text-sm">
                  <span className="flex center gap-1 text-sm ">
                    <IoIosBriefcase />{" "}
                    {!salary?.disclosed ? (
                      "Not Disclosed"
                    ) : (
                      <>
                        {salary?.min} - {salary?.max}
                      </>
                    )}
                  </span>
                  {experience && (
                    <>
                      <VerticalBar />
                      <span className="text-sm">
                        Experience : {experience?.min} - {experience?.max} yrs
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-1 text-sm">
                  <span>Vancancies : {vacancy}</span>
                </div>
                <hr className="mt-3 mb-2" />
                <div className="flex justify-between items-center">
                  <div>
                    <span className="flex center gap-1 text-sm">
                      <IoIosPeople /> Applicants : {applied_ids?.length}
                    </span>
                  </div>
                  {!jobApplied ? (
                    <div className="flex center gap-3">
                      <button
                        disabled={applied || jobApplyMutation.isPending}
                        type="button"
                        className="btn-orange px-3 py-1 tracking-widest"
                        onClick={() => handleApplyClick()}
                      >
                        {jobApplyMutation.isPending ? (
                          <LuLoader2 className="animate-spin-slow text-white  " />
                        ) : applied ? (
                          <span className="flex center gap-1">
                            <FaCheckCircle className="text-white" />
                            Applied
                          </span>
                        ) : (
                          "Apply"
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={
                          savepostMutation.isPending ||
                          unsavePostMutation?.isPending
                        }
                        className="btn-orange-outline px-3 py-1 flex center gap-1"
                        onClick={handleSaveBtnClick}
                      >
                        {savepostMutation.isPending ||
                        unsavePostMutation.isPending ? (
                          <LuLoader2 className="animate-spin-slow text-orange-600 " />
                        ) : saved ? (
                          <>
                            <FaCheckCircle className="text-orange-600" />
                            Saved
                          </>
                        ) : (
                          <>Save</>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div
                      className="p-1 border rounded-full"
                      style={{
                        borderColor: "green",
                        background: "#E2F7C5",
                        color: "green",
                      }}
                    >
                      Applied
                    </div>
                  )}
                </div>

                {/* Application Status */}

                {jobApplied && (
                  <div className="flex flex-col p-3 md:p-3 justify-start items-start mt-2">
                    <h1 className="text-orange-600 text-[1.1rem]">
                      Application Status
                    </h1>

                    {ApplicationStatusLoading || ApplicationStatusFetching ? (
                      <div className="w-full h-[100px] ">
                        <CustomSkeleton width="90%" height="100px" />
                      </div>
                    ) : isError ? (
                      <div className="w-full h-[100px] flex center border border-gray-100 rounded-lg">
                        <span className="text-[0.8rem] text-gray-500">
                          Unable get Status
                        </span>
                      </div>
                    ) : (
                      <Steps
                        className="font-outfit mt-4"
                        progressDot
                        size="small"
                        direction="horizontal"
                        current={applicationStatus?.length}
                        items={applicationStatus}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="w-full rounded-xl mt-8  h-fit bg-slate-50  p-2 md:p-10">
                <h1 className="text-xl md:text-2xl font-semibold mb-4">
                  Key Highlights
                </h1>
                <div className="high-light-content font-outfit">

                  <p dangerouslySetInnerHTML={{ __html: job_description }}></p>
                  <ul className="mt-3">
                    {qualification && (
                      <KeyHighlightsListItem
                        className={
                          "flex-col mb-2 text-sm md:flex-row md:text-[1rem]"
                        }
                        valueClasses={"ms-4 md:ms-1"}
                        key={"qualification"}
                        title="Qualification"
                        value={qualification.join(" / ")}
                      />
                    )}
                    {must_skills?.length > 0 && (
                      <KeyHighlightsListItem
                        className={
                          "flex-col mb-2 text-sm md:flex-row md:text-[1rem]"
                        }
                        valueClasses={"ms-4 md:ms-1"}
                        key={"must_skills"}
                        title="Required Skills"
                        value={must_skills?.join(" , ")}
                      />
                    )}

                    {other_skills?.length > 0 && (
                      <KeyHighlightsListItem
                        className={
                          "flex-col mb-2 text-sm md:flex-row md:text-[1rem]"
                        }
                        valueClasses={"ms-4 md:ms-1"}
                        key={"other_skills"}
                        title="Other Skills"
                        value={other_skills?.join(" , ")}
                      />
                    )}
                    {specification?.length > 0 && (
                      <KeyHighlightsListItem
                        className={
                          "flex-col mb-2 text-sm md:flex-row md:text-[1rem]"
                        }
                        valueClasses={"ms-4 md:ms-1"}
                        key={"specification"}
                        title="Specification"
                        value={specification?.join(" , ")}
                      />
                    )}
                    {type && (
                      <KeyHighlightsListItem
                        className={" text-sm md:text-[1rem] mb-2"}
                        key={"Employment Type"}
                        title="Employment Type"
                        value={type}
                      />
                    )}

                    {location?.length > 0 && (
                      <KeyHighlightsListItem
                        className={
                          "flex-col mb-2 text-sm md:flex-row md:text-[1rem]"
                        }
                        valueClasses={"ms-4 md:ms-1"}
                        key={"location"}
                        title="Location"
                        value={location?.join(" , ")}
                      />
                    )}
                    {job_role && (
                      <KeyHighlightsListItem
                        className={
                          "flex-col mb-2 text-sm md:flex-row md:text-[1rem]"
                        }
                        valueClasses={"ms-4 md:ms-1"}
                        key={"Jobrole"}
                        title="Job Role"
                        value={job_role}
                      />
                    )}
                  </ul>
                </div>
              </div>
              <div className="w-full rounded-xl mt-8  h-fit bg-white p-2 md:p-10">
                <h1 className="text-xl md:text-2xl font-semibold mb-4">
                  About Company
                </h1>
                <div className="font-outfit text-sm md:text-[1rem]">
                  {company_description && (
                    <ReadMore content={company_description} maxLength={250} />
                  )}
                </div>
              </div>
            </div>
            <div className="w-full  lg:w-[45%] mt-5 md:mt-0 flex-1 flex flex-col gap-2  h-fit job-apply-suggestion-section bg-white rounded-lg p-2 md:p-5">
              <h1 className="text-xl md:text-2xl font-outfit text-orange-600">
                Similar jobs you might like :
              </h1>
              {jobApplicationData?.similarData?.length > 0 ? (
                jobApplicationData?.similarData?.map((data) => (
                  <JobSuggestionCard data={data} key={data.id} />
                ))
              ) : (
                <h1 className="w-full text-center">No Similar jobs Found</h1>
              )}
            </div>
          </div>
        </div>
      </MainContext>
    );
  }
};

export default JobApplicatioWithSimilarApplication;
