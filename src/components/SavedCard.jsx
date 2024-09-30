import React  from "react";
import { MdDelete } from "react-icons/md";

const SavedCard = ({ data }) => {
  const {
    isNew = "",
    img = "",
    title = "",
    company = "",
    location = "",
    postedBy = "",
    applicationStatus=[
        {
            title:"Applied",
            status:"finish",
        },
        {
            title :"Viewed",
            status:'wait'
        }
      ]
  } = data;

// Trigger the effect when collapse state changes

  return (
    <div
      className="w-full md:max-w-[70%] relative md:mx-auto rounded-xl h-fit p-2 border border-slate-300  primary-shadow-hover  font-outfit"
    >
      <div className="w-full flex items-center justify-between px-2">
        <img src={img} alt="" className="w-10 h-10 md:h-12 md:w-12 border-gray rounded-lg p-1" />
        <div className="flex center gap-3 md:gap-1"> 
           <button className="w-fit h-fit p-1 px-2 btn-orange " onClick={()=>alert("Navigate TO Job Post")}>Apply</button>
            <MdDelete className="w-5 h-5 cursor-pointer  text-orange-600 rounded-full " onClick={()=>alert("Delete Saved Application")}/>
        </div>
      </div>
      <div className="flex flex-col mt-2">
        <h1 className="">{title}</h1>
        <h2 className="font-extralight capitalize">{company}</h2>
      </div>
    </div>
  );
};

export default SavedCard
