import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LuLoader2 } from "react-icons/lu";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { message } from "antd";
import { IoDocument, IoHourglassOutline } from "react-icons/io5";
import { MdOutlinePersonOff, MdVerifiedUser } from "react-icons/md";
import { FaBan, FaCheck, FaUserFriends, FaUserTie } from "react-icons/fa";
import { FaDiagramProject } from "react-icons/fa6";

export default function FreelancerProfileAdmin() {
  const { freelancer_id: freelancerId } = useParams();
  const [openConfirmModal, setConfirmModal] = useState(false);  
  
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/freelancer/${freelancerId}`);      
      return res.data.accountData;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to fetch user data");
    }
  };

  const {
    data: freelancerData,
    isFetching: freelancerDataFetching,
    isLoading: freelancerDataLoading,
  } = useQuery({
    queryKey: ["freelancer-data"],
    queryFn: fetchUser,
    cacheTime: 300000,
    staleTime: 300000,
    gcTime: 0,
  });  

  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    setIsBlocked(freelancerData?.isBlocked);
  }, [freelancerData]);

  const blockMutation = async () => {
    try {
      const response = await axiosInstance.post("/admin/user/block", {
        accountId: freelancerData?.freelancer_id,
        accountType: "freelancer",
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const unBlockMutation = async () => {
    try {
      const response = await axiosInstance.post("/admin/user/unblock", {
        accountId: freelancerData?.freelancer_id,
        accountType: "freelancer",
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const blockMutate = useMutation({
    mutationKey: ["freelancer","block"],
    mutationFn: blockMutation,
    onError: (err) => {
      toast.error("Something Went Wrong");
    },
    onSuccess: (resData) => {
      setIsBlocked(true);
      message.success("User Blocked");
      setConfirmModal(false);
    },
  });

  const unBlockMutate = useMutation({
    mutationKey: ["freelancer","unblock"],
    mutationFn: unBlockMutation,
    onError: (err) => {
      toast.error("Something Went Wrong");
    },
    onSuccess: (resData) => {
      setIsBlocked(false);
      message.success("User UnBlocked");
      setConfirmModal(false);
    },
  });

  if (freelancerDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <IoHourglassOutline className="animate-spin-slow text-[2rem] text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white flex">
      <div className="grid grid-cols-2 gap-4 w-full">

        <div className="min-h-screen flex flex-col w-full max-h-screen overflow-y-auto custom-scroll my-2 ml-2 max-w-4xl p-4 bg-gray-500 bg-opacity-20 rounded-lg">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-2">

              {/* Profile Image and Basic Info */}
              <div className="flex flex-col items-center justify-center bg-gray-900 bg-opacity-40 p-5 mt-1 rounded-xl shadow-md">
                <img
                  src={freelancerData?.img}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div className="text-lg items-center flex gap-2 my-2 font-semibold relative">
                  <span>{freelancerData?.name}</span>
                  {freelancerData?.isVerified ? 
                  <span>
                      <MdVerifiedUser className="text-green-500" />
                  </span> :
                  <span className="flex items-center justify-center">
                      <MdOutlinePersonOff className="text-xl text-red-500" />
                  </span>}
              </div>
                
                {isBlocked ? (
                    <button
                    className="bg-gray-200 bg-opacity-50 w-[10rem] text-black py-2 px-4 rounded-lg shadow-sm center"
                    disabled={unBlockMutate.isLoading || unBlockMutate.isPending}
                    onClick={() => setConfirmModal(true)}
                    >
                    {unBlockMutate.isLoading || unBlockMutate.isPending ? (
                        <LuLoader2 className="animate-spin text-white" />
                    ) : (
                        <span className="flex items-center gap-2">
                        Unblock <FaBan className=" text-red-500 text-[0.8rem]" />
                        </span>
                    )}
                    </button>
                ) : (
                    <button
                    className="bg-gray-900 w-[10rem] text-white py-2 px-4 rounded-lg shadow-sm center"
                    disabled={blockMutate.isLoading || blockMutate.isPending}
                    onClick={() => setConfirmModal(true)}
                    >
                    {blockMutate.isLoading || blockMutate.isPending ? (
                        <LuLoader2 className="animate-spin text-white" />
                    ) : (
                        <span className="flex items-center gap-2">
                            Block <FaCheck className=" text-white text-[0.7rem]" />
                        </span>                    
                        )}
                    </button>
                )}

                {openConfirmModal ? (
                    <div className="absolute top-[13.5rem] left-[8.5rem] w-[260px] bg-gray-900 border border-gray-700 rounded-lg p-2 z-10">
                    <p className="m-2">Are your sure want to {isBlocked ? "Unblock" : "Block"} ?</p>
                    <div className="flex justify-end">
                        {isBlocked ? (
                        <button
                            className="text-white py-2 px-4 center"
                            disabled={unBlockMutate.isLoading || unBlockMutate.isPending}
                            onClick={() => unBlockMutate.mutate()}
                        >
                            {unBlockMutate.isLoading || unBlockMutate.isPending ? (
                            <><LuLoader2 className="animate-spin text-white" /> Unblock</>                          
                            ) : (
                            "Unblock"
                            )}
                        </button>
                        ) : (
                        <button
                        className="text-white py-2 px-4 center"
                        disabled={blockMutate.isLoading || blockMutate.isPending}
                        onClick={() => blockMutate.mutate()}
                        >
                        {blockMutate.isLoading || blockMutate.isPending ? (
                            <><LuLoader2 className="animate-spin text-white" /> Block</>
                        ) : (
                            "Block"
                            )}
                        </button>
                    )}
                        <button onClick={()=>setConfirmModal(false)}>Cancel</button>
                    </div>
                    </div>
                ) : (
                    <></>
                )}

                <span className="text-xs mt-2"><span className="text-green-500">Last Active:</span> {new Date(freelancerData?.lastActive).toLocaleString()}</span>
              </div>

              {/* Additional Profile Details */}
              <div className="bg-gray-900 bg-opacity-40 p-5 mt-1 rounded-xl shadow-md h-90 overflow-y-auto custom-scroll">
                <div className="flex flex-col lg:flex-col justify-between items-center">
                  <h3 className="text-xl font-semibold uppercase">Profile</h3>
                </div>
                <hr className="my-3" />
                <div className="h-40 overflow-y-auto custom-scroll">
                    <p className="text-sm"><span className="text-teal-300">ID:</span> {freelancerData?.freelancer_id}</p>
                    <p className="text-sm"><span className="text-teal-300">Email:</span> {freelancerData?.email ? freelancerData?.email : "Not mentioned"}</p>
                    <p className="text-sm"><span className="text-teal-300">Mobile:</span> {freelancerData?.mobile ? freelancerData?.mobile : "Not mentioned"}</p>

                    {/* <span className="flex justify-between items-center bg-gray-900 bg-opacity-50  p-3 rounded-lg">
                      <span className="flex gap-3 text-sm items-center">Document<IoDocument /></span>
                      <span className="flex gap-3 text-sm items-center">
                        {
                          freelancerData?.verifyDocuments?.url === undefined ? 
                          <>
                            <span className="text-red-500 text-[0.6rem]">Document Not Available</span>                          </> :
                          <>
                            <a
                              href={freelancerData?.verifyDocuments?.url}
                              className="bg-gray-100 text-gray-900 py-1 px-2 rounded-full text-xs shadow-sm hover:bg-gray-400 hover:text-white"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Document
                            </a>
                          </>
                        }
                      </span>
                    </span> */}

                    <span className="flex justify-between items-center bg-gray-900 bg-opacity-50 mt-2 p-2 rounded-lg">
                      <span className="flex gap-3 text-sm items-center">Projects Posted<FaUserTie /></span>
                      <span className="p-1 center rounded-full shadow-lg h-7 w-7 bg-gray-200 text-black">
                      {freelancerData?.project_details?.projects?.length}
                      </span>
                    </span>
                </div>
              </div>
            </div>

            <span className="flex justify-between items-center bg-gray-900 bg-opacity-50  p-3 rounded-lg">
              <span className="flex gap-3 text-sm items-center">Document<IoDocument /></span>
              <span className="flex gap-3 text-sm items-center">
                {
                  freelancerData?.verifyDocuments?.url === undefined ? 
                  <>
                    <span className="text-red-500 text-[0.6rem]">Document Not Available</span>                          </> :
                  <span className="flex gap-2 items-center">
                    <span className="font-bold">{freelancerData?.verifyDocuments?.docType}</span>
                    <a
                      href={freelancerData?.verifyDocuments?.url}
                      className="bg-gray-100 text-gray-900 py-1 px-2 rounded-full text-xs shadow-sm hover:bg-gray-400 hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document
                    </a>
                  </span>
                }
              </span>
            </span>

            {/* Jobs Section */}
            <div className="overflow-y-auto custom-scroll bg-gray-900 bg-opacity-40 p-5 mt-4 rounded-xl shadow-md">
            <h1 className="text-lg font-semibold uppercase">Projects Posted</h1>
            <hr className="my-3" />
            <div className="overflow-y-auto max-h-[395px] custom-scroll">
                {freelancerData?.projects_info.length > 0 ? (
                    freelancerData.projects_info.map((project, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 mb-4"
                        >
                        <h3 className="text-xl font-semibold text-white">{project?.name}</h3>
                        <p
                            dangerouslySetInnerHTML={{ __html: project?.description }}
                            className="text-sm text-gray-300 mt-2"
                        />
                        <div className="flex justify-between mt-4 text-white text-sm">
                            <div>
                            <p>Cost: {project?.cost?.amount}</p>
                            <p>Due Time: {new Date(project?.dueTime).toLocaleDateString()}</p>
                            <p>Applicants Count: {project?.applied_ids.length}</p>
                            </div>
                        </div>
                        <div className="mt-1 text-gray-300 text-sm">
                            <p className="font-medium">Skills Required:</p>
                            <ul className="list-disc ml-5">
                            {project?.skills?.map((skill, idx) => (
                                <li key={idx}>{skill}</li>
                            ))}
                            </ul>
                        </div>
                        </div>
                    ))
                    ) : (
                    <p className="text-xs text-gray-400">No projects available</p>
                    )}
                </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen flex gap-2 w-full my-2 mr-2 max-w-4xl p-4 bg-gray-500 bg-opacity-20 rounded-lg">
          <div className="flex items-center mx-auto">
            Reports
          </div>
        </div>
      </div>
    </div>
  );
<div className="text-white">Hi</div>
}
