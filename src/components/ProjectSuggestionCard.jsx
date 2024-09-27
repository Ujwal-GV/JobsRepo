import React from "react";
import NewBadge from "./badges/NewBadge";

const ProjectSuggestionCard = ({ data }) => {
  const {
    isNew = "",
    img = "",
    name = "",
    companyName="",
    companyUrl = "",
    cost="",
    postedBy = "",
  } = data;
  return (
    <div onClick={()=>alert(data.id)} className="w-full  h-[150px]flex flex-col items-start p-2 md:p-5 bg-white border-gray rounded-2xl relative cursor-pointer primary-shadow-hover">
      {isNew && (
        <div className="absolute top-2 right-2">
          <NewBadge />
        </div>
      )}
      <img
        src={companyUrl}
        alt=""
        className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] absolute top-10 right-5 lg:right-10  rounded-lg border-gray job-card-img"
      />
      <h3 className="w-full text-[0.9rem] font-semibold text-ellipsis text-nowrap overflow-hidden mt-3 ">
        {name}
      </h3>
      <h2 className=" max-w-[90%] overflow-hidden text-ellipsis text-nowrap text-gray-600 font-roboto">
        {companyName}
      </h2>
      <h1 className="mt-2 flex justify-start items-center  gap-1">
        Price : {
            cost
        }
      </h1>
      <h1 className="text-end text-sm mt-2 text-slate-400">{postedBy}</h1>
    </div>
  );
};

export default ProjectSuggestionCard;
