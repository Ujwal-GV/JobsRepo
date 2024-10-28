import React from 'react'
import { MdTask } from "react-icons/md";
const ProjectCard = ({data}) => {
    const { name="", cost:{amount=""}, skills="" } = data;
    const url = "https://wheretocart.com/assets/images/business-image/business-default.jpg";
    return (
      <div className='primary-shadow-hover relative w-[180px] h-[160px] bg-white border-gray flex flex-col center rounded-lg m-3 p-3 duration-800 font-outfit'>
        <div className='w-10 h-10 rounded-md overflow-hidden border-gray'>
            <img src={url} alt=""  className='w-full h-full'/>
        </div>
        <h1 className='text-[0.9rem] md:text-[0.99rem] mt-1  font-medium text-nowrap overflow-hidden text-ellipsis max-w-[90%]'>{name}</h1>
        <h6 className='text-[0.7rem] md:text-[0.8rem]'>Price : INR {amount}</h6>
        <button className='btn-orange px-3 py-1 mt-4' onClick={()=>alert(name)}>View</button>
      </div>
    );
  };
export default ProjectCard
