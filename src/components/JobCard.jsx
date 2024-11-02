import React from "react";
import NewBadge from "./badges/NewBadge";
import { IoLocationOutline } from "react-icons/io5";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { daysSince } from "../utils/CommonUtils";
import CustomBadge from "./badges/CustomBadge";

const JobCard = ({ data }) => {

  const navigate=useNavigate();

  const {
    id,
    title,
    company,
    location,
    postedBy,
    provider_info,
    job_id,
    createdAt
  } = data;

  const postedSince= daysSince(createdAt)

  return (
    <div
      key={id}
      className="job-card relative w-[180px] md:w-[200px]  h-[160px] md:h-[180px]  bg-white border-gray  rounded-lg m-3 p-3 cursor-pointer duration-800 "
      onClick={() => navigate(`/user/job-post/${job_id}`)}
    >
      {postedSince >=0 ? (
        <div className="absolute top-2 right-2">
          {
            postedSince <=1 ? <NewBadge /> : <CustomBadge text={postedSince+" days ago"} bgcolor="white" text_color="blue"/>
          }
        </div>
      ) : <></>}
      <img
        src={provider_info?.img?.url}
        alt={provider_info?.company_name}
        className=" w-[30%] md:w-[38%] h-[30%] md:h-[38%] rounded-lg border-gray job-card-img"
      />
      <h3 className="w-full text-[0.9rem] font-semibold text-ellipsis text-nowrap overflow-hidden mt-3 ">
        {title}
      </h3>
      <h2 className=" max-w-[90%] overflow-hidden text-ellipsis text-nowrap text-gray-600 font-roboto">
        {provider_info?.companyName}
      </h2>
      {
        location ? <div className="mt-2 flex justify-start items-center  gap-1">
        <IoLocationOutline />
        <span className=" font-extralight text-sm w-full overflow-hidden text-ellipsis text-nowrap">
          {location?.length > 1 ? location[0]+".."  : location}
        </span>
      </div> :<></>
      }
      <h1 className="text-end text-sm mt-2 text-slate-400">{postedBy}</h1>
    </div>
  );
};

export default JobCard;

export const JobCardSkeleton = ({ id }) => {
  return (
    <div
      key={id}
      className="w-full md:w-full job-card relative w-[180px] md:w-[200px]  h-[160px] md:h-[180px]  bg-white border-gray  rounded-lg m-3 p-3 cursor-pointer duration-800 "
    >
      <Skeleton className="w-[30%] md:w-[38%] h-[30%] md:h-[38%] rounded-lg border-gray job-card-img" />
      <h3 className="w-full text-[0.9rem] font-semibold text-ellipsis text-nowrap overflow-hidden mt-3 ">
        <Skeleton className="w-full h-3" />
      </h3>
      <h2 className=" max-w-[90%] overflow-hidden text-ellipsis text-nowrap text-gray-600 font-roboto">
        <Skeleton className="w-full h-3" />
      </h2>
      <div className="mt-2 flex justify-start items-center  gap-1">
        <Skeleton className="w-full h-3" />
      </div>
      <h1 className="text-end text-sm mt-2 text-slate-400">
        <Skeleton className="w-full h-3" />
      </h1>
    </div>
  );
};
