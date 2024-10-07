import React, { useContext, useState, useEffect } from "react";
import MainContext from "../../components/MainContext";
import ProfileAvatar from "../../components/ProfileAvatar";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosMale } from "react-icons/io";
import { DatePicker, message, Spin } from "antd";
import dayjs from "dayjs";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { AiFillProject } from "react-icons/ai";
import { CiUser } from "react-icons/ci";
import { TbMoodEmptyFilled } from "react-icons/tb";
import axios from 'axios';

const UserProfile = () => {

    const [personalDetails, setPersonalDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    
    const user_id = "USER-2";

    useEffect(() => {
        const fetchPersonalDetails = async () => {
          try {
            const response = await axios.get(`http://localhost:8087/user/${user_id}`);
            if (response.status === 200) {
              setPersonalDetails(response.data);
            //   console.log(response);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setErrorMessage(error.response?.data?.message || "Failed to fetch user details.");
          }
        };
    
        fetchPersonalDetails();
      }, [user_id]);

    // const personalDetails = {
    //     fullName: "Shivuroopesh",
    //     email: "shivuroopesh6362@gmail.com",
    //     mobile: "6362379895",
    //     gender: "Male",
    //     skills: ["JavaScript", "React"],
    //     educationDetails: {
    //       qualification: "B.Tech",
    //       college: "ABC College",
    //       percentage: "80%",
    //       passedYear: "2022",
    //     },
    //     internshipDetails: {
    //       title: "Software Engineer Intern",
    //       description: "Worked on various web development projects.",
    //     },
    //     profileSummary:
    //       "A passionate software engineer with experience in building web applications.",
    //   };

    if (!personalDetails) {
        return <div className="flex justify-center items-center"><p>Loading...</p></div>;
    }

  return (
    <MainContext>
      <div className="w-full mx-auto min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10 flex flex-col gap-10">
        <div className="w-full lg:w-[55%] job-apply-section flex flex-col mx-auto relative">
          {/* Avatar and Personal Details */}
          <div className="flex center flex-col w-[95%] md:flex-row md:w-full gap-2 h-fit mx-auto">
            <div className="w-[200px] h-[200px] flex center relative rounded-full bg-white">
              <img 
                src={personalDetails.profile_details.profileImg}
                alt="Profile Image" 
                className="w-full h-full rounded-full object-fill"
            />
            </div>
            <div className="bg-white w-full md:w-[500px] h-full p-3 md:p-7 rounded-xl relative shadow-md">
              <h1 className="text-xl font-semibold">{personalDetails.name}</h1>
              <a href="mailto: ${personalDetails.email}">
              <h1 className="flex justify-start items-center gap-2 mt-2 text-sm text-gray-600">
                <MdEmail className="text-orange-600" />
                {personalDetails.email}
              </h1>
              </a>
              <h1 className="flex justify-start items-center gap-2 text-sm text-gray-600">
                <FaPhoneAlt className="text-orange-600" />
                {personalDetails.mobile}
              </h1>
              <h1 className="flex justify-start items-center gap-2 text-sm text-gray-600">
                <IoIosMale className="text-orange-600" />
                {personalDetails.profile_details.gender}
              </h1>
            </div>
          </div>
          <hr className="mt-5 mb-2" />

          {/* Education Details */}
          <div className="bg-white w-full p-5 md:p-5 rounded-xl shadow-md font-outfit mt-6">
            <h1 className="text-lg font-semibold">Education Details</h1>
            <hr className="mt-2 mb-2" />
            <div className="mt-3 text-sm text-gray-600">
              <strong>Qualification:</strong> {personalDetails.education_details.qualification || "Not Provided"}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Specialization:</strong> {personalDetails.education_details.specification || "Not Provided"}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>College:</strong> {personalDetails.education_details.institute_name || "Not Provided"}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Percentage:</strong> {personalDetails.education_details.percentage || "Not Provided"}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Passed Year:</strong> {personalDetails.education_details.yearOfPassout ? dayjs(personalDetails.education_details.yearOfPassout).format('YYYY') : "Not Provided"}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white w-full h-full p-5 md:p-7 rounded-xl shadow-md mt-6">
            <h1 className="text-lg font-semibold">Skills</h1>
            <hr className="mt-2 mb-2" />
            <div className="flex flex-wrap gap-2 mt-3">
              {personalDetails.profile_details.skills.length > 0 ? (
                personalDetails.profile_details.skills.map((skill, index) => (
                  <span key={index} className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-600">No skills added</p>
              )}
            </div>
          </div>

          {/* Internship Details */}
          <div className="bg-white w-full h-full p-5 md:p-7 rounded-xl shadow-md mt-6">
            <h1 className="text-lg font-semibold">Internship Details</h1>
            <hr className="mt-2 mb-2" />
            <div className="mt-3 text-sm text-gray-600">
              <strong>Internship Title:</strong> {personalDetails.internship_details.title || "Not Provided"}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Internship Description:</strong> {personalDetails.internship_details.description || "Not Provided"}
            </div>
          </div>

          {/* Profile Summary */}
          <div className="bg-white w-full h-full p-5 md:p-7 rounded-xl shadow-md mt-6">
            <h1 className="text-lg font-semibold">Profile Summary</h1>
            <hr className="mt-2 mb-2" />
            <p className="mt-3 text-sm text-gray-600">{personalDetails.profile_details.summary || "No summary provided"}</p>
          </div>

          <div className="bg-white w-full h-full p-5 md:p-7 rounded-xl shadow-md mt-6">
          <button
            type="submit"
            onClick={() => {
                message.success("Interest shared");
            }}
            className="btn-orange px-3 border py-1 border-transparent tracking-widest"
            >
            Interested
            </button>
          </div>
        </div>
      </div>
    </MainContext>
  );
};

export default UserProfile;
