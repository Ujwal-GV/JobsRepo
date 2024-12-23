import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LuLoader2 } from "react-icons/lu";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { message } from "antd";
import { IoHourglassOutline } from "react-icons/io5";
import { MdOutlinePersonOff, MdRefresh, MdVerifiedUser } from "react-icons/md";
import { FaBan, FaCheck, FaUserFriends, FaUserTie } from "react-icons/fa";
import { FaDiagramProject } from "react-icons/fa6";

export default function ProviderProfileAdmin() {
  const { company_id: companyId } = useParams();
  
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/provider/${companyId}`);
      return res.data.accountData;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to fetch user data");
    }
  };

  const {
    data: companyData,
    isFetching: companyDataFetching,
    isLoading: companyDataLoading,
  } = useQuery({
    queryKey: ["provider-data"],
    queryFn: fetchUser,
    cacheTime: 300000,
    staleTime: 300000,
    gcTime: 0,
  });

  const fetchProviderReports = async() => {
    const res = await axiosInstance.get(`/reports/report-count/${companyId}`);    
    return res.data;
  };

  const {
    data: reportsData,
    isLoading: reportsDataLoading,
    isFetching: reportsDataFetching,
    isError: reportsDataError,
    refetch: refreshData,
  } = useQuery({
    queryKey: ['provider-reports-data'],
    queryFn: fetchProviderReports,
    staleTime: 300000,
    cacheTime: 300000,
  });

  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    setIsBlocked(companyData?.isBlocked);
  }, [companyData]);

  const blockMutation = async () => {
    try {
      const response = await axiosInstance.post("/admin/user/block", {
        accountId: companyData?.company_id,
        accountType: "provider",
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const unBlockMutation = async () => {
    try {
      const response = await axiosInstance.post("/admin/user/unblock", {
        accountId: companyData?.company_id,
        accountType: "provider",
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const blockMutate = useMutation({
    mutationKey: ["provider","block"],
    mutationFn: blockMutation,
    onError: (err) => {
      toast.error("Something Went Wrong");
    },
    onSuccess: (resData) => {
      setIsBlocked(true);
      message.success("User Blocked");
    },
  });

  const unBlockMutate = useMutation({
    mutationKey: ["provider","unblock"],
    mutationFn: unBlockMutation,
    onError: (err) => {
      toast.error("Something Went Wrong");
    },
    onSuccess: (resData) => {
      setIsBlocked(false);
      message.success("User Unblocked");
    },
  });

  if (companyDataLoading || companyDataFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <IoHourglassOutline className="animate-spin-slow text-[2rem] text-white" />
      </div>
    );
  }

  const handleRefresh = () => {
    refreshData();
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
                  src={companyData?.img?.url}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div className="text-lg items-center flex gap-2 my-2 font-semibold">
                    <span>{companyData?.company_name}</span>
                    {companyData?.isVerified ? 
                    <span>
                        <MdVerifiedUser className="text-green-500" />
                    </span> :
                    <span className="flex items-center justify-center">
                        <MdOutlinePersonOff className="text-xl text-red-500 relative" />
                    </span>}
                </div>
                {isBlocked ? (
                  <button
                    className="bg-gray-200 bg-opacity-50 w-[10rem] text-black py-2 px-4 rounded-lg shadow-sm center"
                    disabled={unBlockMutate.isLoading || unBlockMutate.isPending}
                    onClick={() => unBlockMutate.mutate()}
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
                    onClick={() => blockMutate.mutate()}
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
                <span className="text-xs mt-2"><span className="text-green-500">Last Active:</span> {new Date(companyData?.lastActive).toLocaleString()}</span>
              </div>

              {/* Additional Profile Details */}
              <div className="bg-gray-900 bg-opacity-40 p-5 mt-1 rounded-xl shadow-md h-90 overflow-y-auto custom-scroll">
                <div className="flex flex-col lg:flex-col justify-between items-center">
                  <h3 className="text-xl font-semibold uppercase">Profile</h3>
                </div>
                <hr className="my-3" />
                <div className="h-40 overflow-y-auto custom-scroll">
                    <p className="text-sm">Email: {companyData?.email ? companyData?.email : "Not mentioned"}</p>
                    
                    <div className="flex">
                        <p className="text-sm mr-2">Company Links:</p>
                        {companyData?.company_links.length > 0 ? (
                        companyData.company_links.map((link, index) => (
                            <span key={link._id}>
                            <a href={link?.url} className="text-sm mr-2">
                                <span className="text-blue-400">{link.title}</span>
                            </a>
                            {index < companyData.company_links.length - 1 && " "}
                            </span>
                        ))
                        ) : (
                        <span className="text-sm">Not mentioned</span>
                        )}
                    </div>

                    <p className="text-sm">Location: {companyData?.location ? companyData?.location : "Not mentioned"}</p>
                    <p className="text-sm">Mobile: {companyData?.mobile ? companyData?.mobile : "Not mentioned"}</p>
                    <p className="text-sm text-justify">About: {companyData?.description ? companyData?.description : "Not mentioned"}</p>
                    </div>
              </div>
            </div>

            {/* Jobs Count and Followers count */}
            <div className="grid grid-cols-2 gap-2 rounded-xl">
              <div className="flex justify-between items-center bg-gray-900 bg-opacity-50  p-3 rounded-lg">
                <span className="flex gap-3 text-sm items-center">Jobs Posted<FaUserTie /></span>
                <span className="p-1 center rounded-full shadow-lg h-7 w-7 bg-gray-200 text-black">
                  {companyData?.job_details?.jobs?.length}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-900 bg-opacity-50  p-3 rounded-lg">
                <span className="flex gap-3 text-sm items-center">Projects Posted<FaDiagramProject /></span>
                <span className="p-1 center rounded-full shadow-lg h-7 w-7 bg-gray-200 text-black">
                  {companyData?.project_details?.projects?.length}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-900 bg-opacity-50  p-3 rounded-lg">
              <span className="flex gap-3 text-sm items-center">Followers<FaUserFriends /></span>
              <span className="p-1 center rounded-full shadow-lg h-7 w-7 bg-gray-200 text-black">
                  {companyData?.followers.length}
                </span>
              </div>
            </div>

            {/* Jobs Section */}
            <div className="overflow-y-auto custom-scroll bg-gray-900 bg-opacity-40 p-5 mt-4 rounded-xl shadow-md">
            <h1 className="text-lg font-semibold uppercase">Jobs Posted</h1>
            <hr className="my-3" />
            <div className="overflow-y-auto max-h-[395px] custom-scroll">
                {companyData?.Applications_info.length > 0 ? (
                    companyData.Applications_info.map((job, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 mb-4"
                        >
                        <h3 className="text-xl font-semibold text-white">{job?.title}</h3>
                        <p
                            dangerouslySetInnerHTML={{ __html: job?.description }}
                            className="text-sm text-gray-300 mt-2"
                        />
                        <div className="flex justify-between mt-4 text-white text-sm">
                            <div>
                            <p>Vacancy: {job?.vacancy}</p>
                            <p>
                                Experience: {job?.experience?.min} - {job?.experience?.max} years
                            </p>
                            <p>Location: {job?.location.join(", ")}</p>
                            <p>Type: {job?.type}</p>
                            <p>Applicants Count: {job?.applied_ids.length}</p>
                            </div>
                        </div>
                        <div className="mt-1 text-gray-300 text-sm">
                            <p className="font-medium">Skills Required:</p>
                            <ul className="list-disc ml-5">
                            {job?.must_skills?.map((skill, idx) => (
                                <li key={idx}>{skill}</li>
                            ))}
                            </ul>
                        </div>
                        </div>
                    ))
                    ) : (
                    <p className="text-xs text-gray-400">No jobs available</p>
                    )}
                </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="min-h-screen flex flex-col gap-4 w-full my-2 mr-2 max-w-4xl p-4 bg-gray-500 bg-opacity-20 rounded-lg">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold text-white uppercase">Reports</h2>
            <button onClick={handleRefresh}><MdRefresh className="text-[2.2rem] text-white p-2 hover:bg-gray-500 hover:rounded-full" /></button>
          </div>
          <hr />
          
          {reportsDataLoading || reportsDataFetching ? (
            <div className="flex items-center justify-center text-white">
              <IoHourglassOutline className="animate-spin-slow text-[2rem]" />
            </div>
          ) : reportsData?.length > 0 ? (
            reportsData.map((report, index) => (
              <div key={report._id} className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700">
                <h3 className="text-md font-semibold text-white mb-1">
                  Report ID: {report.report_id}
                </h3>
                <hr className="my-2" />
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Reported By:</span> {report.reportedBy}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Content:</span> {report.content}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Post ID:</span> {report.postId}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Created At:</span>{" "}
                  {dayjs(report.createdAt).format("DD MMM YYYY, h:mm A")}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-gray-600 hover:bg-gray-500 text-white text-xs px-4 py-2 rounded-lg"
                    onClick={() => alert(`Reviewing report: ${report.report_id}`)}
                  >
                    Review
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-500 text-white text-xs px-4 py-2 rounded-lg"
                    onClick={() => alert(`Deleting report: ${report.report_id}`)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No reports available.</p>
          )}
        </div>

      </div>
    </div>
  );
}
