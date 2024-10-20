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

const fetchInitialStatus = async (userId, jobId) => {
    try {
        const res = await axiosInstance.post(`/jobs/user/status`, {
            applicationId: jobId,
            user_Id: userId,
        });
        return res.data.applicationStatus.status || [];
    } catch (error) {
        console.error("Error fetching initial status:", error);
        return [];
    }
};

const fetchApplicantData = async (userId) => {
    const res = await axiosInstance.get(`/user/${userId}`);
    return res.data;
};

const ViewCandidate = () => {
    const { user_id: userId, job_id: jobId } = useParams();
    const { profileData } = useContext(AuthContext);
    const [contactVisible, setContactVisible] = useState(false);
    const [resumeViewed, setResumeViewed] = useState(false);
    const [status, setStatus] = useState([]);
    const queryClient = useQueryClient();

    // useEffect(() => {
    //     const fetchStatus = async () => {
    //         const initialStatuses = await fetchInitialStatus(userId, jobId);
    //         setStatus(initialStatuses);
    //         setContactVisible(initialStatuses.includes("Contact Viewed"));
    //     };

    //     const setProfileViewedStatus = async () => {
    //         const newStatus = "Profile Viewed";
    //         await updateStatus(newStatus);
    //         await fetchStatus();
    //     };

    //     setProfileViewedStatus();
    // }, [userId, jobId]);

    useEffect(() => {
        const fetchStatus = async () => {
            const initialStatuses = await fetchInitialStatus(userId, jobId);
            setStatus(initialStatuses);
    
            // Ensure sequential process: force the first two statuses
            if (!initialStatuses.includes("Applied")) {
                await updateStatus("Applied");
            }
            // if (!initialStatuses.includes("Profile Viewed")) {
            //     await updateStatus("Profile Viewed");
            // }
            const setProfileViewedStatus = async () => {
                const newStatus = "Profile Viewed";
                await updateStatus(newStatus);
                await fetchStatus();
            };
            setProfileViewedStatus();
            setContactVisible(initialStatuses.includes("Contact Viewed"));
        };
    
        fetchStatus();
    }, [userId, jobId]);

    const { data: applicant, isLoading: isLoadingApplicant } = useQuery({
        queryKey: ["applicant", userId],
        queryFn: () => fetchApplicantData(userId),
        staleTime: 1000 * 60,
        gcTime: 0,
        enabled: !profileData || profileData.user_id !== userId,
        initialData: profileData && profileData.user_id === userId ? profileData : undefined,
    });

    const { data: initialStatus, isLoading: isStatusLoading } = useQuery({
        queryKey: ["status", userId, jobId],
        queryFn: () => fetchInitialStatus(userId, jobId),
        onSuccess: (data) => {
            if (data !== status) {
                setStatus(data);
                setContactVisible(data.includes("Contact Viewed"));
            }
        },
    });

    const updateStatus = async (newStatus) => {
        const response = await axiosInstance.put(`/jobs/status/change`, {
            applicationId: jobId,
            status: newStatus,
            user_Id: userId,
        });
        console.log(response.data);
    
        
        return response.data;
    };

    const mutation = useMutation({
    mutationKey: ['update_status'],
    mutationFn: updateStatus,
    onSuccess: (data) => {
        if (data.success) {
            message.success(data.message);

            const updatedStatus = [...status, data.newStatus];
            setStatus(updatedStatus);

            queryClient.invalidateQueries(["status", userId, jobId]);

            if (data.newStatus === "Contact Viewed") {
                setContactVisible(true);
            }
        }
    },
    onError: () => {
        message.error("Failed to update status");
    },
});

    const toggleContactVisibility = () => {
        if (!contactVisible) {
            const newStatus = "Contact Viewed";
            mutation.mutate(newStatus);
        } else {
            message.warning("Contact details have already been viewed.");
        }
    };

    const handleResumeClick = () => {
        if (!resumeViewed) {
            setResumeViewed(true);
            const newStatus = "Resume Viewed";
            mutation.mutate(newStatus);
        }
    };

    const steps = status.map((currentStatus, index) => ({
        title: currentStatus,
        content: currentStatus,
    }));

    if (isLoadingApplicant || isStatusLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading........</p>
            </div>
        );
    }

    const resumeUrl = applicant?.profile_details?.resume?.url;

    return (
        <MainContext>
            <div className="w-full flex center py-2 sticky pt-8 bg-slate-100">
                <CustomBreadCrumbs
                    items={[
                        {
                            path: "/provider",
                            icon: <CiHome />,
                            title: "Home",
                        },
                        { title: "Candidate Details", icon: <CiUser /> },
                    ]}
                />
            </div>
            <div className="w-full mx-auto min-h-screen bg-gray-100 py-3 px-3 md:px-6 lg:px-10 flex flex-col gap-10">
                <div className="w-full lg:w-[60%] h-auto bg-white flex flex-col mx-auto p-5 m-2 rounded-xl shadow-md">
                    <h1 className="text-lg font-semibold">Candidate Progress</h1>
                    <Steps 
                        current={status.length}
                        progressDot
                    >
                        {steps.map((step) => (
                            <Steps.Step key={step.title} title={step.title} />
                        ))}
                    </Steps>
                </div>

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
                                <div className={`${contactVisible ? '' : 'blur'}`}>
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
                                <div className="flex flex-row gap-2">
                                    <div
                                        className={`px-4 py-2 mt-2 ${contactVisible ? "bg-green-500" : "bg-orange-600"} text-white center rounded-full`}
                                    >
                                        {`Latest: ${status[status.length - 1]}`}
                                    </div>
                                    <button
                                        onClick={toggleContactVisibility}
                                        className={`px-4 py-2 mt-2 bg-white border rounded-full p-1 shadow-md ${contactVisible ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                        title="View Contact Details"
                                    >
                                        {contactVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resume */}
                    <div className="bg-white flex flex-row justify-start items-between p-5 mt-6 rounded-xl shadow-md relative">
                        <div className="text-lg font-semibold">
                            View Resume
                        </div>
                        <div>
                            {resumeUrl ? (
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute right-9 px-4 py-2 center inline-flex bg-white border rounded-full shadow-md"
                                    onClick={handleResumeClick}
                                >
                                    <FaEye />
                                </a>
                            ) : (<span className="absolute right-9 px-4 py-2 center inline-flex bg-white border rounded-full shadow-md">No Resume</span>)}
                        </div>
                    </div>

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
                                        <strong>Company Name:</strong> {internship.company_name || "Not Provided"}
                                    </div>
                                    <div className="mt-3 text-sm text-gray-600">
                                        <strong>Start Month:</strong> {internship.start_month || "Not Provided"}
                                    </div>
                                    <div className="mt-3 text-sm text-gray-600">
                                        <strong>End Month:</strong> {internship.end_month || "Not Provided"}
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

export default ViewCandidate;