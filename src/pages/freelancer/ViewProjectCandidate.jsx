import React, { useContext, useState, useEffect } from "react";
import MainContext from "../../components/MainContext";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoIosMale } from "react-icons/io";
import { message } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { axiosInstance } from "../../utils/axiosInstance";
import CustomBreadCrumbs from "../../components/CustomBreadCrumbs";
import { CiHome, CiUser } from "react-icons/ci";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Steps } from "antd";

// Fetch initial status
// const fetchInitialStatus = async (userId, jobId) => {
//     const res = await axiosInstance.post(`/jobs/user/status`, {
//         applicationId: jobId,
//         user_Id: userId,
//     });
//     return res.data.applicationStatus.status || [];
// };

// Fetch applicant data
const fetchApplicantData = async (userId) => {
    const res = await axiosInstance.get(`/user/${userId}`);
    return res.data;
};

const ViewProjectCandidate = () => {
    const { user_id: userId, project_id: projectId } = useParams();
    const { profileData } = useContext(AuthContext);
    const [status, setStatus] = useState([]);
    const queryClient = useQueryClient();

    // Fetch initial status and update on mount
    // useEffect(() => {
    //     const fetchStatus = async () => {
    //         const initialStatuses = await fetchInitialStatus(userId, jobId);
    //         setStatus(initialStatuses);

    //         if(!initialStatuses.includes("Profile Viewed")) {
    //             await updateStatus("Profile Viewed");
    //         }
    //     };
    //     fetchStatus();
    // }, [userId, jobId]);

    // Automatically poll for updates every 5 seconds
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         fetchInitialStatus(userId, jobId).then(setStatus);
    //     }, 5000); // Poll every 5 seconds

    //     return () => clearInterval(interval); // Clean up the interval on unmount
    // }, [userId, jobId]);

    // Fetch applicant data
    const { data: applicant, isLoading: isLoadingApplicant } = useQuery({
        queryKey: ["applicant", userId],
        queryFn: () => fetchApplicantData(userId),
        staleTime: 1000 * 60,
        enabled: !profileData || profileData.user_id !== userId,
        initialData: profileData && profileData.user_id === userId ? profileData : undefined,
    });

    // Update status mutation
    // const updateStatus = async (newStatus) => {
    //     const response = await axiosInstance.put(`/jobs/status/change`, {
    //         applicationId: jobId,
    //         status: newStatus,
    //         user_Id: userId,
    //     });
    //     return response.data;
    // };

    // const mutation = useMutation({
    //     mutationKey: ['update_status'],
    //     mutationFn: updateStatus,
    //     onSuccess: (data) => {
    //         if (data.success) {
    //             message.success(data.message);
    //             // Update status without needing a manual refresh
    //             setStatus((prevStatus) => {
    //                 if (!prevStatus.includes(data.newStatus)) {
    //                     return [...prevStatus, data.newStatus];
    //                 }
    //                 return prevStatus;
    //             });
    //             queryClient.invalidateQueries(["status", userId, jobId]);
    //         }
    //     },
    //     onError: () => {
    //         message.error("Failed to update status");
    //     },
    // });

    // const toggleContactVisibility = () => {
    //     if (!status.includes("Contact Viewed") && status.includes("Resume Viewed") && status.includes("Interested")) {
    //         mutation.mutate("Contact Viewed");
    //     } else {
    //         message.warning("Contact details can be viewed only after sharing interest.");
    //     }
    // };

    // const handleResumeClick = () => {
    //     if (!status.includes("Resume Viewed")) {
    //         mutation.mutate("Resume Viewed");
    //     }
    // };

    // const handleInterestShared = () => {
    //     if (status.includes("Resume Viewed")) {
    //         mutation.mutate("Interested");
    //     } else {
    //         message.warning("Please view the resume before expressing interest.");
    //     }
    // };

    // const steps = [
    //     { title: "Applied" },
    //     { title: "Profile Viewed" },
    //     { title: status.includes("Resume Viewed") ? "Resume Viewed" : "Resume Not Viewed" },
    //     { title: status.includes("Interested") ? "Interest Shared" : "Share Interest" },
    //     { title: status.includes("Contact Viewed") ? "Contact Viewed" : "Contact Not Viewed" },
    // ];

    // const currentStep = status.length - 1;

    if (isLoadingApplicant) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    const resumeUrl = applicant?.profile_details?.resume?.url;

    return (
        <MainContext>
            <div className="w-full flex center py-2 sticky pt-8 bg-slate-100">
                <CustomBreadCrumbs
                    items={[
                        { path: "/freelancer", icon: <CiHome />, title: "Home" },
                        { title: "Candidate Details", icon: <CiUser /> },
                    ]}
                />
            </div>
            <div className="w-full mx-auto min-h-screen bg-gray-100 py-3 px-3 md:px-6 lg:px-10 flex flex-col gap-10">
                {/* <div className="w-full lg:w-[60%] h-auto bg-white flex flex-col mx-auto p-5 m-2 rounded-xl shadow-md">
                    <h1 className="text-lg font-semibold">Candidate Progress</h1>
                    <Steps current={currentStep} progressDot>
                        {steps.map((step, index) => (
                            <Steps.Step key={index} title={step.title} />
                        ))}
                    </Steps>
                </div> */}

                <div className="w-full lg:w-[60%] flex flex-col mx-auto">
                    <div className="flex flex-col md:flex-row gap-5 items-center bg-white p-5 rounded-xl shadow-md">
                        <div className="w-[150px] h-[150px] relative rounded-full bg-gray-200 overflow-hidden shadow-lg">
                            <img
                                src={applicant?.profile_details?.profileImg || applicant?.name}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-semibold">{applicant?.name || "N/A"}</h1>
                            <div className="relative">
                                {/* <div className={`${status.includes("Contact Viewed") ? '' : 'blur'}`}> */}
                                <div>
                                    <a href={`mailto:${applicant?.email}`}>
                                        <h1 className="flex items-center gap-2 text-sm text-gray-600">
                                            <MdEmail className="text-orange-600" />
                                            {applicant?.email || "Not provided"}
                                        </h1>
                                    </a>
                                    <h1 className="flex items-center gap-2 text-sm text-gray-600">
                                        <FaPhoneAlt className="text-orange-600" />
                                        {applicant?.mobile || "Not provided"}
                                    </h1>
                                    <h1 className="flex items-center gap-2 text-sm text-gray-600">
                                        <IoIosMale className="text-orange-600" />
                                        {applicant?.profile_details?.gender || "Not provided"}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="bg-white p-5 mt-6 rounded-xl shadow-md flex flex-col center lg:flex-row gap-2">
                        <div className="px-4 py-2 mt-2 bg-orange-600 text-white center rounded-full">
                            {`Latest: ${status[status.length - 1]}`}
                        </div>
                        <button
                            onClick={handleResumeClick}
                            className="px-4 py-2 mt-2 bg-white border rounded-full p-1 shadow-md"
                            title="View Resume"
                            disabled={status.includes("Resume Viewed")}
                        >
                            {(
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                {status.includes("Resume Viewed") ? "Resume Viewed" : "View Resume"}
                                </a>
                            )}
                        </button>

                        <button
                            onClick={handleInterestShared}
                            className={`px-4 py-2 mt-2 bg-white border rounded-full p-1 shadow-md ${status.includes("Interested") ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                            title="Express Interest"
                            disabled={status.includes("Interested")}
                        >
                            {status.includes("Interested") ? "Interest Shared" : "Share Interest"}
                        </button>

                        <button
                            onClick={toggleContactVisibility}
                            className={`px-4 py-2 mt-2 bg-white center border rounded-full p-1 shadow-md ${status.includes("Contact Viewed") ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                            title="View Contact Details"
                            disabled={status.includes("Contact Viewed")}
                        >
                            {status.includes("Contact Viewed") ? <><FaEyeSlash className="mr-2" />Contact Viewed</> : <><FaEye />{"View Contact"}</>}
                        </button>
                    </div> */}

                    {/* Profile Summary */}
                    <div className="bg-white p-5 mt-6 rounded-xl shadow-md">
                        <h1 className="text-lg font-semibold">Profile Summary</h1>
                        <hr className="my-3" />
                        <p className="text-sm text-gray-600">
                            {applicant?.profile_details?.summary || "No summary provided"}
                        </p>
                    </div>

                    {/* Education Details */}
                    <div className="bg-white p-5 mt-6 rounded-xl shadow-md">
                        <h1 className="text-lg font-semibold">Education Details</h1>
                        <hr className="my-3" />
                        <div className="text-sm text-gray-600">
                            <strong>Qualification:</strong> {applicant?.education_details?.qualification || "Not Provided"}
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                            <strong>Specialization:</strong> {applicant?.education_details?.specification || "Not Provided"}
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                            <strong>College:</strong> {applicant?.education_details?.institute_name || "Not Provided"}
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                            <strong>Percentage:</strong> {applicant?.education_details?.percentage || "Not Provided"}
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                            <strong>Passed Year:</strong> {applicant?.education_details?.yearOfPassout ? dayjs(applicant.education_details.yearOfPassout).format('YYYY') : "Not Provided"}
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="bg-white p-5 mt-6 rounded-xl shadow-md">
                        <h1 className="text-lg font-semibold">Skills</h1>
                        <hr className="my-3" />
                        <div className="flex flex-wrap gap-2">
                            {applicant?.profile_details?.skills?.length > 0 ? (
                                applicant.profile_details.skills.map((skill, index) => (
                                    <span key={index} className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm shadow-sm">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-600">No skills added</p>
                            )}
                        </div>
                    </div>

                    {/* Internship Details */}
                    <div className="bg-white p-5 mt-6 rounded-xl shadow-md">
                        <h1 className="text-lg font-semibold">Internship Details</h1>
                        <hr className="my-3" />
                        
                        {applicant?.internship_details?.length > 0 ? (
                            applicant.internship_details.map((internship, index) => (
                                <div key={internship._id} className="mt-3 w-full flex gap-3 items-start">
                                    <div className="w-[2%] mt-3 text-sm text-gray-600">
                                        <strong>{index+1 || "Not Provided"}</strong>
                                    </div>
                                    <div className="w-3/4 mb-2 mt-3">
                                        <div className="text-sm text-gray-600">
                                            <strong>Company Name: </strong> {internship.company_name || "Not Provided"}
                                        </div>
                                        {/* <div className="mt-3 text-sm text-gray-600">
                                            <strong>Start Month:</strong> {dayjs(internship.start_month).format("MM-YYYY") || "Not Provided"}
                                        </div>
                                        <div className="mt-3 text-sm text-gray-600">
                                            <strong>End Month:</strong> {dayjs(internship.end_month).format("MM-YYYY") || "Not Provided"}
                                        </div> */}
                                        <div className="mt-3 text-sm text-gray-600">
                                            <strong>Duration: </strong> 
                                            {(dayjs(internship.end_month).diff(internship.start_month, 'month') === 1) 
                                                ? 
                                                dayjs(internship.end_month).diff(internship.start_month, 'month') + " month" 
                                                : 
                                                dayjs(internship.end_month).diff(internship.start_month, 'month') + " months" 
                                                || 
                                            "Not Provided"}
                                        </div>
                                        <div className="mt-3 text-sm text-gray-600">
                                            <strong>Designation:</strong> {internship.project || "Not Provided"}
                                        </div>
                                        <div className="mt-3 text-sm text-gray-600">
                                            <strong>Description:</strong> {internship.project_description || "Not Provided"}
                                        </div>
                                        <hr className="my-3" />
                                    </div>
                                    
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-600">No internships added</p>
                        )}
                    </div>
                </div>
            </div>
        </MainContext>
    );
};

export default ViewProjectCandidate;
