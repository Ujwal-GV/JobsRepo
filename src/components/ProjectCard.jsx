import React from "react";
import { daysLeft} from "../utils/CommonUtils";
import CustomBadge from "./badges/CustomBadge";
import { useNavigate } from "react-router-dom";
const ProjectCard = ({ data }) => {
  const { name = "", cost = {}, provider_info = {} } = data;

  const dayLeft = daysLeft(data.dueTime);

  const navigate = useNavigate()

  return (
    <div className="primary-shadow-hover w-[180px] h-[160px] bg-white border-gray flex flex-col center rounded-lg m-3 p-3 duration-800 font-outfit relative">
      <div className="absolute top-1 right-1">
        {dayLeft >= 0 ? (
          <CustomBadge
            text={dayLeft + "d left"}
            bgcolor="white"
            text_color="green"
          />
        ) : (
          <CustomBadge text={"over"} bgcolor="white" text_color="red" />
        )}
      </div>
      <div className="w-12 h-10 rounded-md overflow-hidden border-gray">
        <img
          src={provider_info?.img}
          alt={"project"}
          className="w-full h-full p-[1px] text-[0.5rem]"
        />
      </div>
      <h1 className="text-[0.9rem] md:text-[0.99rem] mt-1  font-medium text-nowrap overflow-hidden text-ellipsis max-w-[90%]">
        {name}
      </h1>
      <h6 className="text-[0.7rem] md:text-[0.8rem] w-full flex center max-w-[80%] mx-auto overflow-hidden text-ellipsis">
        Price : {cost?.amount}
      </h6>
      <button
        className="btn-orange px-3 py-1 mt-4"
        onClick={() => navigate(`/user/project-apply/${data.project_id}`)}
        disabled={dayLeft<0}
      >
        View
      </button>
    </div>
  );
};
export default ProjectCard;
