import React from "react";
import Skeleton from "react-loading-skeleton";

const CompanyCard = ({ data }) => {
  const { img, company_name = " ", _id = "", company_id } = data;
  return (
    <div
      onClick={() =>{window.open(`/user/company/${company_id}`, '_blank');}}
      key={_id}
      className="company-card relative w-[180px] md:w-[200px] h-[160px] md:h-[180px] bg-white border-gray flex flex-col center  rounded-lg m-3 p-3 cursor-pointer duration-800 "
    >
      <img
        src={img?.url}
        loading="lazy"
        alt=""
        className="w-[40%] h-[40%] mx-auto border border-gray-400 rounded-lg p-1"
      />
      <h5 className="max-w-[80%] text-center text-nowrap mt-5">
        {company_name}
      </h5>
      <h1 className="text-orange-600 text-[1rem] font-medium font-fredoka">
        View jobs
      </h1>
    </div>
  );
};

export default CompanyCard;

export const CompanyCardSkeleton = ({id}) => {
  return (
    <div
      key={id}
      className="company-card relative w-[180px] md:w-[200px] h-[160px] md:h-[180px] bg-white border-gray flex flex-col center  rounded-lg m-3 p-3 cursor-pointer duration-800 "
    >
     
      <Skeleton width={150} height={90}/>
      <Skeleton width={60} height={20} className="mt-3"/>
        
    </div>
  );
};
