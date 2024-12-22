import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LuLoader2 } from "react-icons/lu";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { message } from "antd";
import { IoHourglassOutline } from "react-icons/io5";
import { MdBlock, MdOutlinePerson, MdOutlinePersonOff, MdVerified, MdVerifiedUser } from "react-icons/md";
import { FaBan, FaCheck, FaSave, FaUserTie } from "react-icons/fa";

export default function SeekerProfileAdmin() {
  const { user_id: userId } = useParams();

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/user/${userId}`);
      return res.data;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to fetch user data");
    }
  };

  const {
    data: userData,
    isFetching: userDataFetching,
    isLoading: userDataLoading,
  } = useQuery({
    queryKey: ["seeker-data"],
    queryFn: fetchUser,
    cacheTime: 300000,
    staleTime: 300000,
    gcTime: 0,
  });

  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (userData) setIsBlocked(userData.isBlocked);
  }, [userData]);

  const blockMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/admin/user/block", {
        accountId: userId,
        accountType: "user",
      });
    },
    onError: () => message.error("Something went wrong"),
    onSuccess: () => {
      setIsBlocked(true);
      message.success("User blocked");
    },
  });

  const unBlockMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/admin/user/unblock", {
        accountId: userId,
        accountType: "user",
      });
    },
    onError: () => message.error("Something went wrong"),
    onSuccess: () => {
      setIsBlocked(false);
      message.success("User unblocked");
    },
  });

  if (userDataLoading) {
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
                  src={userData?.profile_details?.profileImg}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div className="text-lg items-center flex gap-2 my-2 font-semibold">
                  <span>{userData?.name}</span>
                  {userData?.isVerified ? 
                    <span>
                      <MdVerifiedUser className="text-green-500" />
                    </span> :
                    <span className="flex items-center justify-center">
                      <MdOutlinePersonOff className="text-xl text-red-500 relative" />
                    </span>}
                </div>
                {/* <span className="text-xs mb-2">Last Active: {new Date(userData?.lastActive).toLocaleString()}</span> */}
                {isBlocked ? (
                  <button
                    className="bg-gray-200 bg-opacity-50 w-[10rem] text-black py-2 px-4 rounded-lg shadow-sm center"
                    disabled={unBlockMutation.isLoading || unBlockMutation.isPending}
                    onClick={() => unBlockMutation.mutate()}
                  >
                    {unBlockMutation.isLoading || unBlockMutation.isPending ? (
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
                    disabled={blockMutation.isLoading || blockMutation.isPending}
                    onClick={() => blockMutation.mutate()}
                  >
                    {blockMutation.isLoading || blockMutation.isPending ? (
                      <LuLoader2 className="animate-spin text-white" />
                    ) : (
                        <span className="flex items-center gap-2">
                            Block <FaCheck className=" text-white text-[0.7rem]" />
                        </span>                    
                      )}
                  </button>
                )}
                <span className="text-xs mt-2"><span className="text-green-500">Last Active:</span> {new Date(userData?.lastActive).toLocaleString()}</span>
              </div>

              {/* Additional Profile Details */}
              <div className="bg-gray-900 bg-opacity-40 p-5 mt-1 rounded-xl shadow-md h-90 overflow-y-auto custom-scroll">
                <div className="flex flex-col lg:flex-col justify-between items-center">
                  <h3 className="text-xl font-semibold uppercase">Profile</h3>
                  <a
                    href={userData?.profile_details?.resume?.url}
                    className="bg-gray-100 text-gray-900 py-2 px-3 rounded-full text-sm shadow-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                </div>
                <hr className="my-3" />
                <div className="h-40 overflow-y-auto custom-scroll">
                  <p className="text-sm">Email: {userData?.email ? userData?.email : "Not mentioned"}</p>
                  <p className="text-sm">Gender: {userData?.profile_details?.gender ? userData?.profile_details?.gender : "Not mentioned"}</p>
                  <p className="text-sm">Mobile: {userData?.mobile ? userData?.mobile : "Not mentioned"}</p>
                  <p className="text-sm text-justify">About: {userData?.profile_details?.summary ? userData?.profile_details?.summary : "Not mentioned"}</p>
                </div>
              </div>
            </div>

            {/* Applied and Saved application count */}
            <div className="grid grid-cols-2 gap-2 rounded-xl">
              <div className="flex justify-between items-center bg-gray-900 bg-opacity-50  p-3 rounded-lg">
                <span className="flex gap-3 text-sm items-center">Applied Jobs<FaUserTie /></span>
                <span className="p-1 center rounded-full shadow-lg h-7 w-7 bg-gray-200 text-black">
                  {userData?.application_applied_info?.jobs?.length}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-900 bg-opacity-50  p-3 rounded-lg">
                <span className="flex gap-3 text-sm items-center">Saved Jobs<FaSave /></span>
                <span className="p-1 center rounded-full shadow-lg h-7 w-7 bg-gray-200 text-black">
                  {userData?.application_applied_info?.projects?.length}
                </span>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-gray-900 bg-opacity-50 p-5 mt-4 rounded-xl shadow-md">
              <h1 className="text-lg font-semibold uppercase">Skills</h1>
              <hr className="my-3" />
              <div className="flex flex-wrap gap-2">
                {userData?.profile_details?.skills?.length > 0 ? (
                  userData.profile_details.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-900 px-3 py-1 rounded-full text-sm shadow-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs">No skills added</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-400 bg-opacity-20 p-5 mt-4 rounded-xl shadow-md">
                <h1 className="text-lg font-semibold uppercase">Education</h1>
                <hr className="my-3" />
                {userData?.education_details ? (
                  <div className="text-sm bg-gray-800 p-3 rounded-lg">
                    <p>
                      Institute: {userData.education_details.institute_name} -{" "}
                      {userData.education_details.specification}
                    </p>
                    <p>
                      Qualification:{" "}
                      {userData.education_details.qualification}
                    </p>
                    <p>Percentage: {userData.education_details.percentage}</p>
                    <p>
                      Year of Passout:{" "}
                      {userData.education_details.yearOfPassout}
                    </p>
                  </div>
                ) : (
                  <p>No Qualification listed</p>
                )}
              </div>

              {/* Internship */}
              <div className="bg-gray-400 bg-opacity-20 p-5 mt-4 rounded-xl shadow-md">
                <h1 className="text-lg font-semibold uppercase">Internship</h1>
                <hr className="my-3" />
                {userData?.internship_details?.length > 0 ? (
                  <div className="h-[9rem] text-sm overflow-y-auto custom-scroll">
                    {userData.internship_details.map((internship, index) => (
                      <div key={index} className="p-3 bg-gray-800 my-2 rounded-lg shadow-lg">
                        <p>
                          <span className="font-medium">Company Name:</span>{" "}
                          {internship.company_name}
                        </p>
                        <p>
                          <span className="font-medium">Duration:</span>{" "}
                          {dayjs(internship.end_month).diff(
                            internship.start_month,
                            "month"
                          )}{" "}
                          months
                        </p>
                        <p>
                          <span className="font-medium">Project:</span>{" "}
                          {internship.project}
                        </p>                      
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs">No Internships added</p>
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
}
