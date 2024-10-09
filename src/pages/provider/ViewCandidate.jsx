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
import { useLocation } from "react-router-dom";

const ViewCandidate = () => {

    const { state } = useLocation();
    const applicant = state?.applicant; // Retrieve the applicant data from state
    
    // console.log(applicant);

    const [errorMessage, setErrorMessage] = useState("");
    
    if (!applicant) {
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
                src={applicant.profile_details.profileImg}
                alt="Profile Image" 
                className="w-full h-full rounded-full object-fill"
            />
            </div>
            <div className="bg-white w-full md:w-[500px] h-full p-3 md:p-7 rounded-xl relative shadow-md">
              <h1 className="text-xl font-semibold">{applicant.name}</h1>
              <a href="mailto: ${applicant.email}">
              <h1 className="flex justify-start items-center gap-2 mt-2 text-sm text-gray-600">
                <MdEmail className="text-orange-600" />
                {applicant.email}
              </h1>
              </a>
              <h1 className="flex justify-start items-center gap-2 text-sm text-gray-600">
                <FaPhoneAlt className="text-orange-600" />
                {applicant.mobile}
              </h1>
              <h1 className="flex justify-start items-center gap-2 text-sm text-gray-600">
                <IoIosMale className="text-orange-600" />
                {applicant.profile_details.gender}
              </h1>
            </div>
          </div>
          <hr className="mt-5 mb-2" />

          {/* Profile Summary */}
          <div className="bg-white w-full h-full p-5 md:p-7 rounded-xl shadow-md mt-6">
            <h1 className="text-lg font-semibold">Profile Summary</h1>
            <hr className="mt-2 mb-2" />
            <p className="mt-3 text-sm text-gray-600">{applicant.profile_details.summary || "No summary provided"}</p>
          </div>

          {/* Education Details */}
          <div className="bg-white w-full p-5 md:p-5 rounded-xl shadow-md font-outfit mt-6">
            <h1 className="text-lg font-semibold">Education Details</h1>
            <hr className="mt-2 mb-2" />
            <div className="mt-3 text-sm text-gray-600">
              <strong>Qualification:</strong> {applicant.education_details.qualification || "Not Provided"}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Specialization:</strong> {applicant.education_details.specification || "Not Provided"}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>College:</strong> {applicant.education_details.institute_name || "Not Provided"}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Percentage:</strong> {applicant.education_details.percentage || "Not Provided"}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Passed Year:</strong> {applicant.education_details.yearOfPassout ? dayjs(applicant.education_details.yearOfPassout).format('YYYY') : "Not Provided"}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white w-full h-full p-5 md:p-7 rounded-xl shadow-md mt-6">
            <h1 className="text-lg font-semibold">Skills</h1>
            <hr className="mt-2 mb-2" />
            <div className="flex flex-wrap gap-2 mt-3">
              {applicant.profile_details.skills.length > 0 ? (
                applicant.profile_details.skills.map((skill, index) => (
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
              <strong>Internship Title:</strong> {applicant.internship_details.title || "Not Provided"}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Internship Description:</strong> {applicant.internship_details.description || "Not Provided"}
            </div>
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

export default ViewCandidate;
