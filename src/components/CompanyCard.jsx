import React from "react";

const CompanyCard = ({data}) => {
    const {img="" , title=" " ,id=""} = data;
  return (
    <div onClick={()=>alert(id)} key={id} className="company-card relative w-[180px] md:w-[200px] h-[160px] md:h-[180px] bg-white border-gray flex flex-col center  rounded-lg m-3 p-3 cursor-pointer duration-800 ">
        <img src={img} alt="" className="w-[40%] h-[40%] mx-auto border border-gray-400 rounded-lg" />
        <h5 className="max-w-[80%] overflow-hidden text-nowrap text-ellipsis mt-5">{title}</h5>
        <h1 className="text-orange-600 text-[1rem] font-medium font-fredoka">View jobs</h1>
    </div>
  )
}

export default CompanyCard
