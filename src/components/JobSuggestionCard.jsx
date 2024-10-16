import React from "react";
import NewBadge from "./badges/NewBadge";
import { IoLocationOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const JobSuggestionCard = ({ data }) => {
  const {
    isNew = "",
    title = "",
    location = "",
    provider_info = {},
  } = data;


  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/user/job-post/${data?.job_id}`) }
      className="w-full  h-[170px] flex flex-col items-start p-2 md:p-5 bg-white border-gray rounded-2xl relative cursor-pointer primary-shadow-hover"
    >
      {isNew && (
        <div className="absolute top-2 right-2">
          <NewBadge />
        </div>
      )}
      <img
        src={provider_info?.img?.url}
        alt={provider_info?.company_name}
        className="w-[40px] h-[40px] lg:w-[60px] lg:h-[60px] absolute top-10 right-5 lg:right-10  rounded-lg p-1 border-gray job-card-img"
      />
      <h3 className="w-full text-[1rem] font-semibold text-ellipsis text-nowrap overflow-hidden mt-3 ">
        {title}
      </h3>
      <h2 className=" max-w-[90%] text-[0.9rem] overflow-hidden text-ellipsis text-nowrap text-gray-600">
        {provider_info?.company_name}
      </h2>
      <div className="mt-1 flex justify-start items-center  gap-1">
        <IoLocationOutline />
        <span className=" font-extralight text-sm max-w-[90%] md:max-w-[80%] overflow-hidden text-ellipsis text-nowrap">
          {location}
        </span>
      </div>
    </div>
  );
};

export default JobSuggestionCard;
