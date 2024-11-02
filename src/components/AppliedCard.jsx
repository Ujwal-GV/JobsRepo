import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdBriefcase } from "react-icons/io";
import { LiaRupeeSignSolid } from "react-icons/lia";

const AppliedCard = ({ data   }) => {
  

  const {
    jobData = {},
    companyData = {},
  } = data || {};


  const navigate = useNavigate();

  return (
    <div
      className="w-full md:max-w-full relative md:mx-auto rounded-xl h-[140px] p-2 border border-slate-300  primary-shadow-hover  font-outfit flex flex-col gap-1  justify-between items-center cursor-pointer"
      onClick={(e) => {
        navigate(`/user/job-post/${jobData?.job_id}/${true}`);
      }}
    >
      <div className="flex justify-between gap-1 items-center w-full flex-1 px-4">
        <div className="flex flex-1 flex-col">
          <h5 className="text-[1rem]">
            {jobData?.title?.length > 30
              ? jobData?.title?.slice(0, 30) + "..."
              : jobData?.title}
          </h5>
          <h6 className="text-[0.9rem] font-light">
            {companyData?.company_name?.length > 30
              ? companyData?.company_name?.slice(0, 30) + "..."
              : companyData?.company_name}
          </h6>
          <span className="text-[0.8rem] flex justify-start items-center">
            <LiaRupeeSignSolid />{" "}
            {jobData?.package?.disclosed ? (
              <>
                {jobData?.package?.min +
                  " - " +
                  jobData?.package?.max}
              </>
            ) : (
              "Not Disclosed"
            )}
          </span>
          {jobData?.experience && (
            <span className="text-[0.8rem] flex justify-start items-center gap-1">
              <IoMdBriefcase />{" "}
              {jobData?.experience?.min +
                " - " +
                jobData?.experience?.max +
                " yrs"}{" "}
            </span>
          )}
        </div>
        <div className="p-1 border border-gray-100 rounded-lg">
          <img
            src={companyData?.img?.url}
            className="h-[60px] w-[60px] p-1 text-[0.5rem] "
            alt={companyData?.company_name}
          />
        </div>
      </div>
      
    </div>
  );
};

export default AppliedCard;




