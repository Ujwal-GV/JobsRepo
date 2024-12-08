import React from "react";
import NewBadge from "./badges/NewBadge";
import { useNavigate } from "react-router-dom";
import CustomBadge from "./badges/CustomBadge";
import { daysLeft, formatTimestampToDate } from "../utils/CommonUtils";

const ProjectSuggestionCard = ({ data }) => {
  const { name, provider_info, cost, dueTime } = data;

  const daysLeftCount = daysLeft(dueTime);
  const navigate = useNavigate();


  return (
    <div
      onClick={daysLeftCount >=0 ? () => {
        navigate(`/user/project-apply/${data.project_id}`);
      } : ()=>{}}
      className="w-full  h-[150px]flex flex-col items-start p-2 md:p-5 bg-white border-gray rounded-2xl relative cursor-pointer primary-shadow-hover"
    >
      <div className="absolute top-1 right-1">
        {daysLeftCount >= 0 ? (
          <CustomBadge
            text={"Due " + formatTimestampToDate(data?.dueTime)}
            bgcolor="white"
            text_color="green"
          />
        ) : (
          <CustomBadge
            text={"Over"}
            bgcolor="white"
            text_color="red"
          />
        )}
      </div>

      <img
        src={provider_info?.img}
        alt="profile"
        className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] absolute top-10 right-5 lg:right-10  rounded-lg border-gray job-card-img text-img"
      />
      <h3 className="w-full text-[0.9rem] font-semibold text-ellipsis text-nowrap overflow-hidden mt-3 ">
        {name}
      </h3>
      <h2 className=" max-w-[90%] overflow-hidden text-ellipsis text-nowrap text-gray-600 font-roboto">
        {provider_info?.name}
      </h2>
      <h1 className="mt-2 flex justify-start items-center  gap-1">
        Price : {cost.amount}
      </h1>
      {/* <h1 className="text-end text-sm mt-2 text-slate-400">{postedBy}</h1> */}
    </div>
  );
};

export default ProjectSuggestionCard;
