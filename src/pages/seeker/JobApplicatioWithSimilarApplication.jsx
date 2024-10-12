import React, { useState } from "react";
import MainContext from "../../components/MainContext";
import { FaCheckCircle } from "react-icons/fa";
import JobSuggestionCard from "../../components/JobSuggestionCard";
import { jobData } from "../../../assets/dummyDatas/Data";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { IoIosPeople, IoIosBriefcase } from "react-icons/io";
import { LiaRupeeSignSolid } from "react-icons/lia";
import ReadMore from "../../components/ReadMore";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading";
import toast from "react-hot-toast";

const VerticalBar = () => {
  return <div className="w-0 h-5 border-r border-black"></div>;
};

const JobApplicatioWithSimilarApplication = () => {
  const { id: jobApplicationId } = useParams();

  const fetchJobDetails = async (jobId) => {
    const res = await axiosInstance.get(`/jobs/${jobId}`);
    return res.data;
  };

  const {
    data: jobApplicationData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["jobApplication", jobApplicationId],
    queryFn: () => fetchJobDetails(jobApplicationId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    onError: (err) => {
      console.error("Error fetching job details:", err.message);
      toast.error("Failed to fetch job details");
    },
  });

  const [saved, setSaved] = useState(false);

  const handleSaveClick = () => {
    setSaved((prev) => !prev);
  };

  const description =
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis ipsum, officia animi iste, porro quos totam quas officiis cupiditate quae et expedita debitis. Fugit dolores possimus sequi illo odio aut quos perferendis neque quod voluptatum, eaque consequuntur, quisquam impedit delectus vel, in nisi nostrum. Hic reiciendis neque iure aliquid voluptatibus ipsa maiores ipsum distinctio, totam esse nesciunt. Aut assumenda quos provident cum quidem blanditiis repellat. Labore aliquid doloribus repellendus, corporis minima totam sit corrupti, tempora aliquam id temporibus molestiae veritatis expedita consectetur a suscipit. Modi aut nisi sequi error temporibus eum, ipsam tempora qui voluptas quasi autem aspernatur magnam reiciendis.";

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    toast.error(error.response.data.message);
  }

  console.log(jobApplicationData);

  const {
    title: jobTitle,
    package: salary,
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
    job_role
  } = jobApplicationData.job;
  const {
    company_name,
    img,
    description: company_description,
  } = jobApplicationData.company;

  return (
    <MainContext>
      <div className="w-full min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10  !pb-2 ">
        <div className="bg-white p-1 flex justify-between md:gap-3 lg:gap-10 flex-col lg:flex-row">
          <div className="w-full  lg:w-[55%] job-apply-section">
            <div className="w-full rounded-xl  h-fit bg-white p-2 md:p-10 font-outfit relative">
              <img
                className="border border-gray-100  absolute top-2 right-2 md:top-10 md:right-10 w-16 h-16 rounded-lg"
                src={img?.url}
                alt={company_name}
              />
              <h1 className="text-[1.3rem] md:text-2xl font-semibold max-w-[80%] overflow-hidden text-ellipsis text-nowrap">
                {jobTitle}
              </h1>
              <h3 className="font-light mt-5">{company_name}</h3>
              <div className="flex gap-2 text-sm">
                <span className="flex center gap-1 text-sm ">
                  <IoIosBriefcase /> {!salary.disclosed ? "Not Disclosed" : <>{salary.min} - {salary.max} </>}
                </span>
                {experience && (
                  <>
                    <VerticalBar />
                    <span className="text-sm">Experience : {experience.min} - {experience.max} yrs</span>
                  </>
                )}
              </div>
              <div className="mt-1 text-sm">
                <span>Vancancies : {vacancy}</span>
              </div>
              <hr className="mt-3 mb-2" />
              <div className="flex justify-between items-center">
                <div>
                  <span className="flex center gap-1">
                    <IoIosPeople /> Applicants : {applied_ids?.length}
                  </span>
                </div>
                <div className="flex center gap-3">
                  <button className="btn-orange px-3 py-1 tracking-widest">
                    Apply
                  </button>
                  <button
                    className="btn-orange-outline px-3 py-1 flex center gap-1"
                    onClick={handleSaveClick}
                  >
                    {saved ? (
                      <>
                        <FaCheckCircle className="text-orange-600" />
                        Saved
                      </>
                    ) : (
                      <>Save</>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full rounded-xl mt-8  h-fit bg-slate-50  p-2 md:p-10">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">
                Key Highlights
              </h1>
              <div className="high-light-content font-outfit">
                <p>{job_description}</p>
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
                  {must_skills.length > 0 && (
                    <KeyHighlightsListItem
                      className={
                        "flex-col mb-2 text-sm md:flex-row md:text-[1rem]"
                      }
                      valueClasses={"ms-4 md:ms-1"}
                      key={"must_skills"}
                      title="Required Skills"
                      value={must_skills.join(" , ")}
                    />
                  )}

                  {other_skills.length > 0 && (
                    <KeyHighlightsListItem
                      className={
                        "flex-col mb-2 text-sm md:flex-row md:text-[1rem]"
                      }
                      valueClasses={"ms-4 md:ms-1"}
                      key={"other_skills"}
                      title="Other Skills"
                      value={other_skills.join(" , ")}
                    />
                  )}
                  {specification.length > 0 && (
                    <KeyHighlightsListItem
                      className={
                        "flex-col mb-2 text-sm md:flex-row md:text-[1rem]"
                      }
                      valueClasses={"ms-4 md:ms-1"}
                      key={"specification"}
                      title="Specification"
                      value={specification.join(" , ")}
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

                  {location.length > 0 && (
                    <KeyHighlightsListItem
                      className={
                        "flex-col mb-2 text-sm md:flex-row md:text-[1rem]"
                      }
                      valueClasses={"ms-4 md:ms-1"}
                      key={"location"}
                      title="Location"
                      value={location.join(" , ")}
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
              <div className="font-outfit">
                <ReadMore content={company_description} maxLength={250} />
              </div>
            </div>
          </div>
          <div className="w-full  lg:w-[45%] mt-5 md:mt-0 flex-1 flex flex-col gap-2  h-fit job-apply-suggestion-section bg-white rounded-lg p-2 md:p-5">
            <h1 className="text-xl md:text-2xl font-outfit text-orange-600">
              Similar jobs you might like :
            </h1>
            {jobData.map((data) => (
              <JobSuggestionCard data={data} key={data.id} />
            ))}
          </div>
        </div>
      </div>
    </MainContext>
  );
};

export default JobApplicatioWithSimilarApplication;
