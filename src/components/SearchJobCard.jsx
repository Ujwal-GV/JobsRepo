import React, { useContext, useEffect, useState } from "react";
import NewBadge from "./badges/NewBadge";
import { IoLocationOutline, IoBriefcaseOutline } from "react-icons/io5";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import CustomBadge from "./badges/CustomBadge";
import { AuthContext } from "../contexts/AuthContext";

const SearchJobCard = ({ data }) => {
  const navigate = useNavigate();

  const { profileData } = useContext(AuthContext);


  const [userId,setUserId] = useState('');

  useEffect(()=>{
       if(profileData && profileData!==null)
       {
        setUserId(profileData?.user_id)
       }
  },[profileData])


  const {
    title = "",
    location = [],
    postedBy = "",
    package: salary,
    provider_info,
    experience,
    applied_ids,
  } = data;
  return (
    <div
      onClick={() => navigate(`/user/job-post/${data.job_id}`)}
      className="w-full mx-auto md:w-[80%] h-fit flex flex-col items-start p-2 md:p-5 bg-white border-gray rounded-2xl relative cursor-pointer primary-shadow-hover "
    >
      {applied_ids && applied_ids?.length > 0 ? (
        applied_ids?.find((uid) => uid.userId === userId) ? (
          <div className="absolute top-1 right-1">
            <CustomBadge bgcolor="#E2F7C5" text_color="green" text="Applied" />
          </div>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
      <img
        src={provider_info?.img?.url}
        alt={provider_info?.company_name}
        className="w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] absolute top-10 right-5 lg:right-10  rounded-lg p-1 border-gray job-card-img"
      />
      <h3 className="w-full text-[0.9rem] font-semibold text-ellipsis text-nowrap overflow-hidden mt-3 ">
        {title}
      </h3>
      <h2 className=" max-w-[90%] overflow-hidden text-ellipsis text-nowrap text-gray-600 font-roboto">
        {provider_info?.company_name}
      </h2>
      <div className="mt-2 flex justify-start items-center  gap-1">
        <IoLocationOutline />
        <span className=" font-extralight text-sm max-w-[90%] md:max-w-[80%] overflow-hidden text-ellipsis text-nowrap">
          {location.join(",")}
        </span>
      </div>
      <div className="flex items-start justify-start flex-col sm:flex-row">
        <div className="mt-2 flex justify-start items-center  gap-1">
          <IoBriefcaseOutline />
          <span className=" font-extralight text-sm  overflow-hidden text-ellipsis text-nowrap">
            {!salary?.disclosed ? (
              "Not Disclosed"
            ) : (
              <>
                {salary.min} - {salary.max}
              </>
            )}
          </span>
        </div>
        {experience && (
          <div className="mt-2 flex justify-start items-center  gap-1 md:ms-2 md:border-s border-black md:ps-2">
            <span className="text-sm">Experience</span>
            <span className=" font-extralight text-sm  overflow-hidden text-ellipsis text-nowrap">
              {experience && (
                <>
                  {experience?.min} - {experience.max} yrs
                </>
              )}
            </span>
          </div>
        )}
      </div>
      <h1 className="text-end text-sm mt-2 text-slate-400">
        posted by {postedBy}
      </h1>
    </div>
  );
};

export default SearchJobCard;

export const SearchJobCardSkeleton = () => {
  return (
    <div className="w-full mx-auto md:w-[80%] h-[150px] flex gap-1 justify-between items-center bg-white p-2 md:p-5 rounded-2xl relative">
      <div className="relative w-[60%] h-full flex flex-col items-start justify-center">
        <div className="w-full h-4 relative">
          <Skeleton
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </div>
        <div className="w-full h-4 relative mt-1">
          <Skeleton
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </div>
        <div className="w-full h-4 relative mt-1">
          <Skeleton
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </div>
      </div>
      <div className="relative w-[20%] h-full flex center ">
        <div className="w-[40px] h-[40px] lg:w-[80px] lg:h-[80px] relative">
          <Skeleton
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </div>
      </div>
    </div>
  );
};
