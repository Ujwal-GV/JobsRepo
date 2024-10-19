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

const ViewCandidate = () => {
    const { user_id: userId } = useParams();
    const { profileData } = useContext(AuthContext);
    const [applicant, setApplicant] = useState(null);
    const [contactVisible, setContactVisible] = useState(false);
    const [resumeViewed, setResumeViewed] = useState(false);
    const [status, setStatus] = useState("Profile Viewed");

    useEffect(() => {
        if (profileData && profileData.user_id === userId) {
            setApplicant(profileData);
        } else {
            axiosInstance.get(`/user/${userId}`)
                .then((res) => {
                    setApplicant(res.data);
                })
                .catch((err) => {
                    console.error("Error fetching applicant data", err);
                });
        }
    }, [userId, profileData]);

    const toggleContactVisibility = () => {
        if (status === "Profile Viewed") {
            setContactVisible(true);
            setStatus("Contact Viewed");
            message.success("Contact Viewed");
        } else if (status === "Contact Viewed") {
            message.warning("Contact details have already been viewed.");
        }

        axiosInstance.put(`/user/${userId}/status`, { status: "Contact Viewed" })
            .catch(err => {
                console.error("Error updating status", err);
            });
    };

    const handleResumeClick = () => {
        if (!resumeViewed && contactVisible) {
            setResumeViewed(true);
            setStatus("Resume Viewed");
            message.success("Resume Viewed");
            axiosInstance.put(`/user/${userId}/status`, { status: "Resume Viewed" })
                .catch(err => {
                    console.error("Error updating status", err);
                });
        }
    };

    const getFillWidth = () => {
        if (status === "Profile Viewed") return "0%";
        if (status === "Contact Viewed") return "50%";
        if (status === "Resume Viewed") return "100%";
        return "0%";
    };

    if (!applicant) {
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
                    {
                    path: "/provider",
                    icon: <CiHome />,
                    title: "Home",
                    },
                    { title: "Job Application", icon: <CiUser /> },
                ]}
                />
            </div>
            <div className="w-full mx-auto min-h-screen bg-gray-100 py-3 px-3 md:px-6 lg:px-10 flex flex-col gap-10">
                <div className="w-full lg:w-[60%] h-[120px] bg-white flex flex-col mx-auto p-5 m-2 rounded-xl">
                    <h1 className="text-lg font-semibold">Candidate Progress</h1>
                    <div className="relative mt-2">
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-300 rounded-full">
                            <div className="h-[2px] bg-orange-500 rounded-full" style={{ width: getFillWidth() }}></div>
                        </div>

                        {/* Status Points */}
                        <div className="flex justify-between absolute top-[-3px] w-full">
                            <div className="flex flex-col items-start">
                                <div className={`w-2 h-2 rounded-full border-2 ${status === "Profile Viewed" || status === "Contact Viewed" || status === "Resume Viewed" ? 'bg-orange-500 border-orange-500' : 'bg-gray-300 border-gray-300'}`}></div>
                                <p className="mt-2 text-sm text-gray-600">Profile Viewed</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className={`w-2 h-2 rounded-full border-2 ${status === "Contact Viewed" || status === "Resume Viewed" ? 'bg-orange-500 border-orange-500' : 'bg-gray-300 border-gray-300'}`}></div>
                                <p className="mt-2 text-sm text-gray-600">Contact Viewed</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className={`w-2 h-2 rounded-full border-2 ${status === "Resume Viewed" ? 'bg-orange-500 border-orange-500' : 'bg-gray-300 border-gray-300'}`}></div>
                                <p className="mt-2 text-sm text-gray-600">Resume Viewed</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-[60%] flex flex-col mx-auto">
                    {/* Avatar and Personal Details */}
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
                                    {status}
                                </div>
                                <button
                                    onClick={toggleContactVisibility}
                                    className={`px-4 py-2 mt-2 bg-white border rounded-full p-1 shadow-md ${contactVisible ? "cursor-not-allowed opacity:50" : "cursor-pointer"}`}
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
                            {resumeUrl && (
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute right-9 px-4 py-2 center inline-flex bg-white border rounded-full shadow-md"
                                    onClick={handleResumeClick}
                                >
                                    <FaEye />
                                </a>
                            )}
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
                                <div key={internship._id} className="mt-3">
                                    <div className="text-sm text-gray-600">
                                        <strong>Company Name:</strong> {internship.company_name || "Not Provided"}
                                    </div>
                                    <div className="mt-3 text-sm text-gray-600">
                                        <strong>Duration:</strong> {internship.duration || "Not Provided"}
                                    </div>
                                    <div className="mt-3 text-sm text-gray-600">
                                        <strong>Designation:</strong> {internship.designation || "Not Provided"}
                                    </div>
                                    <hr className="my-3" />
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
