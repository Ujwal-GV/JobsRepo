import React from "react";
import img from "../../assets/images/p4.png";
import NewBadge from "./badges/NewBadge";
import { IoLocationOutline } from "react-icons/io5";
import Skeleton from "react-loading-skeleton";

const JobCard = ({data}) => {

  const {id , title ,company,location,postedBy,provider_info,isNew} = data;
  return (
    <div key={id} className="job-card relative w-[180px] md:w-[200px]  h-[160px] md:h-[180px]  bg-white border-gray  rounded-lg m-3 p-3 cursor-pointer duration-800 ">
      {
        isNew && <div className="absolute top-2 right-2">
        <NewBadge />
      </div>
      }
      <img
        src={provider_info?.img?.url}
        alt=""
        className=" w-[30%] md:w-[38%] h-[30%] md:h-[38%] rounded-lg border-gray job-card-img"
      />
      <h3 className="w-full text-[0.9rem] font-semibold text-ellipsis text-nowrap overflow-hidden mt-3 ">
        {title}
      </h3>
      <h2 className=" max-w-[90%] overflow-hidden text-ellipsis text-nowrap text-gray-600 font-roboto">
        {provider_info?.companyName}
      </h2>
      <div className="mt-2 flex justify-start items-center  gap-1">
        <IoLocationOutline />
        <span className=" font-extralight text-sm w-full overflow-hidden text-ellipsis text-nowrap">
          {location ? location : "Remote"}
        </span>
      </div>
      <h1 className="text-end text-sm mt-2 text-slate-400">{postedBy}</h1>
    </div>
  );
};

export default JobCard;


export const JobCardSkeleton =({id})=>{

  return (
    <div key={id} className="w-full md:w-full job-card relative w-[180px] md:w-[200px]  h-[160px] md:h-[180px]  bg-white border-gray  rounded-lg m-3 p-3 cursor-pointer duration-800 ">
      <Skeleton className="w-[30%] md:w-[38%] h-[30%] md:h-[38%] rounded-lg border-gray job-card-img"/>
      <h3 className="w-full text-[0.9rem] font-semibold text-ellipsis text-nowrap overflow-hidden mt-3 ">
        <Skeleton className="w-full h-3"/>
      </h3>
      <h2 className=" max-w-[90%] overflow-hidden text-ellipsis text-nowrap text-gray-600 font-roboto">
      <Skeleton className="w-full h-3"/>
      </h2>
      <div className="mt-2 flex justify-start items-center  gap-1">
      <Skeleton className="w-full h-3"/>
      </div>
      <h1 className="text-end text-sm mt-2 text-slate-400"><Skeleton className="w-full h-3"/></h1>
    </div>
  );

}
