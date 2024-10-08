import React from "react";
import { useLocation } from "react-router-dom";
import MainContext from "../../components/MainContext";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { useNavigate } from "react-router-dom";

const JobDetails = () => {
  const { state } = useLocation();
  const job = state?.job;
  if (!job) {
    return <p>Job not found!</p>;
  }

  const VerticalBar = () => {
    return <div className="w-0 h-5 border-r border-black"></div>;
  };

  const navigate = useNavigate();

  return (
    <MainContext>
      {/* Wrapper for the entire content */}
      <div className="w-full min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10 lg:w-full flex flex-col gap-10">
        {/* Flex container for left and right sections */}
        <div className="w-full lg:w-[55%] job-apply-section flex flex-col mx-auto relative">
          {/* Left Section */}
            {/* Company and Person Details */}
            <div className="w-full rounded-xl h-fit bg-white p-5 md:p-5 font-outfit">
              <img 
                src="/Logo.png" 
                alt="Company Logo" 
                className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover mb-4 absolute top-4 right-4" 
              />
              <h1 className="text-[1.3rem] md:text-2xl font-bold">
                {job.title}
              </h1>
              <h1 className="text-[1.3rem] md:text-2xl font-semibold">
                {job.companyName}
              </h1>
              <h3 className="font-normal mt-5">
                Posted by: {job.providerName}
              </h3>
              <div className="flex gap-2 mt-3">
                <span>Experience: {job.experience}</span>
                {/* <VerticalBar /> */}
              </div>
              <hr className="mt-10 mb-2" />
              <div className="flex justify-between items-center">
                <div>
                  <span>Vacancies: {job.vacancies ? job.vacancies : "Not mentioned"}</span>
                </div>
              </div>
            </div>

            {/* More Details */}
            <div className="w-full rounded-xl mt-8 h-fit bg-white p-4 md:p-5 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">
                More Details
              </h1>
              <ul className="mt-3">
              <li className="mb-4">
                  <KeyHighlightsListItem
                    key={"1"}
                    title="Location"
                    value={job.location ? job.location : "Not disclosed"}
                  />
                </li>

                <li className="mb-4">
                  <KeyHighlightsListItem
                    key={"1-1"}
                    title="Department"
                    value={job.department ? job.department : "Not specified"}
                  />
                </li>
                <li className="mb-4">
                  <KeyHighlightsListItem
                    key={"1-2"}
                    title="Role"
                    value={job.jobRole ? job.jobRole : "Not specified"}
                  />
                </li>
                
                <li className="mb-4">
                  <KeyHighlightsListItem 
                    key={"1-3"} 
                    title="Employment Type"
                    value={job.employmentType} 
                  />
                </li>
                <li className="mb-4">
                  <KeyHighlightsListItem 
                    key={"1-4"} 
                    title="Package"
                    value={`${job.package}` ? `${job.package} ${job.currency || 'INR'}` : 'Not Disclosed'} 
                  />
                </li>
              </ul>
            </div>

            <div className="w-full rounded-xl mt-8 h-fit bg-white p-4 md:p-5 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">
                Qualifications
              </h1>
              <ul className="mt-3">
              <li className="mb-4">
                <KeyHighlightsListItem
                    key={"1"}
                    title="Category"
                    value={null}
                  />
                {job.qualifications && job.qualifications.length > 0 ? (
                  job.qualifications.map((qualification, index) => (
                    <div className="mt-3 mb-3">
                      <li className="ml-7 list-disc">
                        {qualification.value}
                        </li>
                    </div>
                  ))
                ) : (
                  <p>Not sepcified</p>
                )}
                </li>

                <li className="mb-4">
                <KeyHighlightsListItem
                    key={"1-1"}
                    title="Sub-Category"
                    value={null}
                  />
                {job.subCategories && job.subCategories.length > 0 ? (
                  job.subCategories.map((subCategory, index) => (
                    <div className="mt-3 mb-3">
                      <li className="ml-7 list-disc">
                        {subCategory.value}
                        </li>
                    </div>
                  ))
                ) : (
                  <p>Not sepcified</p>
                )}
                </li>
              </ul>
            </div>

          {/* Right Section: About Company */}
          <div className="w-full rounded-xl mt-8 h-fit bg-white p-4 md:p-5 md:mt-8 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">
                Required Skills
              </h1>
              {job.skills && job.skills.length > 0 ? (
                job.skills.map((skill, index) => (
                  <div className="mb-2">
                    <KeyHighlightsListItem
                      key={index}
                      title={null}
                      value={skill.value}
                    />
                  </div>
                ))
              ) : (
                <p>No skills listed</p>
              )}

            <h1 className="text-xl md:text-2xl font-semibold mb-4 mt-6">
                Optional Skills
              </h1>
              {job.optionalSkills && job.optionalSkills.length > 0 ? (
                job.optionalSkills.map((optionalSkill, index) => (
                  <div className="mb-2">
                    <KeyHighlightsListItem
                      key={index}
                      title={null}
                      value={optionalSkill.value}
                    />
                  </div>
                ))
              ) : (
                <p>No skills listed</p>
              )}
            </div>

            <div className="w-full lg:w-full mt-5 md:p-5 md:mt-8 flex-1 flex flex-col gap-2 h-fit bg-white rounded-lg p-4 md:p-5">
              <strong>Job Description:</strong>
              <div
                className="mt-2 p-4 text-justify"
                dangerouslySetInnerHTML={{ __html: job.jobDescription }}
              />
            </div>
          </div>
      </div>
    </MainContext>
  );
};

export default JobDetails;
