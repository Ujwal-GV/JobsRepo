import React from 'react'
import { MdTask } from "react-icons/md";
const ProjectCard = ({data}) => {
    const { name="", cost="", companyUrl="" } = data;
    return (
      <div className='primary-shadow-hover relative w-[200px] h-[200px] bg-white border-gray flex flex-col center rounded-lg m-3 p-3 duration-800 font-outfit'>
        <div className='w-10 h-10 rounded-md overflow-hidden border-gray'>
            <img src={companyUrl} alt=""  className='w-full h-full'/>
        </div>
        <h1 className='text-xl font-medium text-nowrap overflow-hidden text-ellipsis max-w-[90%]'>{name}</h1>
        <h6>Price : {cost}</h6>
        <button className='btn-orange px-3 py-1 mt-9' onClick={()=>alert(name)}>View</button>
      </div>
    );
  };
export default ProjectCard
