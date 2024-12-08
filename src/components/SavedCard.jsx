import React, { useContext, useEffect, useState } from "react";
import { IoMdBriefcase } from "react-icons/io";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import CustomBadge from "./badges/CustomBadge";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { LuLoader2 } from "react-icons/lu";
import toast from "react-hot-toast";
import { CustomSkeleton } from "../pages/seeker/CompanyAllPosts";

const SavedCard = ({ data  ,onDelete =()=>{} }) => {
  const [appliedIds, setAppliedIds] = useState([]);


  const unsavedPost = async (jobId) => {
    const res = await axiosInstance.post("/user/job/unsave", { jobId: jobId });
    return res.data;
  };

  const unsavePostMutation = useMutation({
    mutationFn: unsavedPost,
    mutationKey: ["unsave-post"],
    onSuccess: () => {
      toast.success("Post removed Successfully");
      onDelete(saved_app_info?.job_id)
    },
    onError: (error) => {
      const { message } = getError(error);
      if (message) {
        toast.error(message);
      } else {
        toast.error("Something Went Wrong");
      }
    },
  });

  const {
    saved_app_info = {},
    companyData = {},
  } = data || {};


  

  const { profileData } = useContext(AuthContext);

  useEffect(() => {
    if (profileData && profileData !== null) {
      const ids = profileData?.application_applied_info?.jobs;
      setAppliedIds((prev) => [...ids]);
    }
  }, [profileData]);


  const navigate = useNavigate();

  return (
    <div
      className="w-full md:max-w-full relative md:mx-auto rounded-xl h-[140px] p-2 border border-slate-300  primary-shadow-hover  font-outfit flex flex-col gap-1  justify-between items-center cursor-pointer"
      onClick={(e) => {
        navigate(`/user/job-post/${saved_app_info?.job_id}`);
      }}
    >
      <div className="flex justify-between gap-1 items-center w-full flex-1 px-4">
        <div className="flex flex-1 flex-col">
          <h5 className="text-[1rem]">
            {saved_app_info?.title?.length > 30
              ? saved_app_info?.title?.slice(0, 30) + "..."
              : saved_app_info?.title}
          </h5>
          <h6 className="text-[0.9rem] font-light">
            {companyData?.company_name?.length > 30
              ? companyData?.company_name?.slice(0, 30) + "..."
              : companyData?.company_name}
          </h6>
          <span className="text-[0.8rem] flex justify-start items-center">
            <LiaRupeeSignSolid />{" "}
            {saved_app_info?.package?.disclosed ? (
              <>
                {saved_app_info?.package?.min +
                  " - " +
                  saved_app_info?.package?.max}
              </>
            ) : (
              "Not Disclosed"
            )}
          </span>
          {saved_app_info?.experience && (
            <span className="text-[0.8rem] flex justify-start items-center gap-1">
              <IoMdBriefcase />{" "}
              {saved_app_info?.experience?.min +
                " - " +
                saved_app_info?.experience?.max +
                " yrs"}{" "}
            </span>
          )}
        </div>
        <div className="p-1 border border-gray-100 rounded-lg">
          <img
            src={companyData?.img?.url}
            className="h-[60px] w-[60px] p-1 text-[0.5rem] "
            alt={companyData?.company_name}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 items-center w-full text-[0.8rem]">
        {appliedIds?.find(
          (idData) => idData?.jobId === saved_app_info?.job_id
        ) && (
          <CustomBadge text="Applied" bgcolor="#E2F7C5" text_color="green" />
        )}
        <button
          className="p-1 bg-orange-600 rounded-full text-white flex center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            unsavePostMutation.mutate(saved_app_info?.job_id);
          }}
        >
          {unsavePostMutation.isPending && (
            <LuLoader2 className="animate-spin-slow text-white  " />
          )}
          Delete
        </button>
      </div>
    </div>
  );
};

export default SavedCard;



export const SavedCardSkeleton = ()=>{
  return (<div
    className="w-full md:max-w-full relative md:mx-auto rounded-xl h-[140px] p-2 border border-slate-300  primary-shadow-hover  font-outfit flex flex-col gap-1  justify-between items-center ">
    <div className="flex justify-between gap-1 items-center w-full flex-1 px-4">
      <div className="flex flex-1 flex-col">
         <CustomSkeleton width="70%" height="20px"/>
        
        <CustomSkeleton width="40%" height="10px"/>
        
        <CustomSkeleton width="40%" height="10px"/>
        
        <CustomSkeleton width="40%" height="10px"/>
        
      </div>
      <div className="p-1 border border-gray-100 rounded-lg">
      <CustomSkeleton width="60px" height="60px"/>
      </div>
    </div>
    
  </div>)
}
