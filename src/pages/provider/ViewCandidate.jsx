import React, { useContext, useState, useEffect } from "react";
import MainContext from "../../components/MainContext";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosMale } from "react-icons/io";
import { message } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { axiosInstance } from "../../utils/axiosInstance";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ViewCandidate = () => {
    const { user_id: userId } = useParams();
    const { profileData } = useContext(AuthContext);
    const [applicant, setApplicant] = useState(null);
    const [contactVisible, setContactVisible] = useState(false);
    const [ maxTries, setMaxTries ] = useState(1);

    useEffect(() => {
        if (profileData && profileData.user_id === userId) {
            setApplicant(profileData);
        } else {
            axiosInstance.get(`/user/${userId}`)
                .then((res) => {
                  // console.log("Candidate:",res.data);
                    setApplicant(res.data);
                })
                .catch((err) => {
                    console.error("Error fetching applicant data", err);
                });
        }
    }, [userId, profileData]);

  const toggleContactVisibility = () => {
    if (maxTries === 1) {
      const newVisibility = !contactVisible;
      setContactVisible(newVisibility);
      setMaxTries(0);

      const newStatus = newVisibility ? "Profile viewed" : "Interested";
      message.success(newVisibility ? "Profile viewed" : "Status updated to Interested");

      axiosInstance.put(`/user/${userId}/status`, { status: newStatus })
          .then(() => {
              message.success(newVisibility ? "Profile viewed" : "Status updated to Interested");
          })
          .catch(err => {
              console.error("Error updating status", err);
          });
    } else {
        message.warning("Contact details have already been viewed.");
    }
  };

    if (!applicant) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <MainContext>
            <div className="w-full mx-auto min-h-screen bg-gray-100 py-10 px-3 md:px-6 lg:px-10 flex flex-col gap-10">
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
                                <button
                                    onClick={toggleContactVisibility}
                                    // disabled = { maxTries === 0 }
                                    className={`absolute top-0 left-[220px] bg-white border rounded-full p-1 shadow-md ${ contactVisible ? "cursor-not-allowed opacity:50" : "cursor-pointer" }`}
                                    title="View Contact Details"
                                >
                                    {contactVisible ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                <div className={`${contactVisible ? ' ' : 'blur'}`}>
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
                                <div
                                  type="disabled"
                                  disabled = {true}
                                  className={`px-4 py-2 mt-2 ${contactVisible ? "bg-green-500 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"} text-white center rounded-full transition-colors animation duration-200`}
                                >
                                  {contactVisible ? "Contact details viewed" : "Interested"}
                              </div>
                            </div>
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
                                      <strong>Project:</strong> {internship.project || "Not Provided"}
                                  </div>
                                  <div className="mt-3 text-sm text-gray-600">
                                      <strong>Project Description:</strong> {internship.project_description || "Not Provided"}
                                  </div>
                                  <div className="mt-3 text-sm text-gray-600">
                                      <strong>Start Month:</strong> {internship.start_month || "Not Provided"}
                                  </div>
                                  <div className="mt-3 text-sm text-gray-600">
                                      <strong>End Month:</strong> {internship.end_month || "Not Provided"}
                                  </div>
                                  <hr className="my-3" />
                              </div>
                          ))
                      ) : (
                          <p className="text-sm text-gray-600">No internships provided</p>
                      )}
                  </div>
                </div>
            </div>
        </MainContext>
    );
};

export default ViewCandidate;
