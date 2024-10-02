import React, { useState } from "react";
import MainContext from "../../components/MainContext";
import { useJobContext } from '../../contexts/JobContext';
import { AuthContext } from '../../contexts/AuthContext';
import { FaCheckCircle, FaEye, FaTrash } from "react-icons/fa";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import styles for ReactQuill

const VerticalBar = () => {
  return <div className="w-0 h-5 border-r border-black"></div>;
};

const JobApplicationProviderView = () => {
  const [saved, setSaved] = useState(false);
  const { jobs, setJobs } = useJobContext();
  const { userRole } = React.useContext(AuthContext);
  const [jobDetails, setJobDetails] = useState({
    title: "",
    companyName: "",
    providerName: "",
    location: "",
    industry: "",
    jobDescription: "",
    experience: "",
  });
  const [selectedJob, setSelectedJob] = useState(null); // Track the selected job for "view"
  const [applicants] = useState(20);

  const navigate = useNavigate();

  const handleSaveClick = () => {
    setSaved((prev) => !prev);
  };

  const handleDeleteClick = (id) => {
    const updatedJobs = jobs.filter((job) => job.id !== id);
    setJobs(updatedJobs);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jobDetails.title && jobDetails.companyName) {
      const newJob = {
        ...jobDetails,
        id: Math.random().toString(36).substring(7),
        applicationId: "APP-" + Math.floor(100000 + Math.random() * 900000), // Generate unique Application ID
        applicants: Math.floor(Math.random() * 100), // Random applicants
      };
      setJobs((prevJobs) => [...prevJobs, newJob]);
      setJobDetails({
        title: "",
        companyName: "",
        providerName: "",
        location: "",
        industry: "",
        jobDescription: "", // Reset jobDescription after submit
      });
    }
  };

  const handleViewClick = (job) => {
    navigate(`/provider/post-job/${job.id}`, { state: { job } }); // Set selected job to display the details
  };

  return (
    <MainContext>
      {/* Wrapper for the entire content */}
      <div className="w-full min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10 flex flex-col gap-10">
        
        {/* Top Section: Company and Person Details */}
        <form onSubmit={handleSubmit} className="w-full lg:w-full flex flex-col lg:flex-row gap-10">
          
          {/* Left Section */}
          <div className="w-full lg:w-[55%] job-apply-section relative">
            {/* Company and Person Details */}
            <div className="w-full rounded-xl h-fit bg-white p-4 md:p-5 font-outfit">
              <img 
                src="/Logo.png" 
                alt="Company Logo" 
                className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover mb-4 absolute top-4 right-4" 
              />
              <h1 className="text-[1.3rem] md:text-2xl font-bold">
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Job Title"
                  value={jobDetails.title}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </h1>
              <h1 className="text-[1.3rem] md:text-2xl font-semibold">
                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter Company Name"
                  value={jobDetails.companyName}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </h1>
              <h3 className="font-light mt-5">
                Posted by: 
                <input
                  type="text"
                  name="providerName"
                  placeholder="Enter Provider Name"
                  value={jobDetails.providerName}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              </h3>

              <div className="flex items-center gap-2 mt-3">
                <span className="font-light">Experience:</span>
                <input
                  type="text"
                  name="experience"
                  placeholder="Enter Experience (in years)"
                  value={jobDetails.experience}
                  onChange={handleChange}
                  className="border rounded-lg p-2"
                />
                <VerticalBar />
                <span>Posted Jobs: {jobs.length}</span>
              </div>

              <hr className="mt-10 mb-2" />
              <div className="flex justify-between items-center">
                <div>
                  <span>Applicants: {applicants}</span>
                </div>
                <div className="flex center gap-3">
                  <button
                    className="btn-orange-outline px-3 py-1 flex center gap-1"
                    onClick={handleSaveClick}
                  >
                    {saved ? (
                      <FaCheckCircle className="text-orange-600" />
                    ) : (
                      <></>
                    )}
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="w-full rounded-xl mt-8 h-fit bg-white p-2 md:p-10">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">
                Key Highlights
              </h1>
              <ul className="mt-3">
                <KeyHighlightsListItem
                  key={"1"}
                  title="Location"
                  value={
                    <input
                      type="text"
                      name="location"
                      placeholder="Enter Location"
                      value={jobDetails.location}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2"
                    />
                  }
                />
                <KeyHighlightsListItem
                  key={"1-1"}
                  title="Industry"
                  value={
                    <input
                      type="text"
                      name="industry"
                      placeholder="Enter Industry"
                      value={jobDetails.industry}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2"
                    />
                  }
                />
                <KeyHighlightsListItem key={"1-2"} title="Posted On" value="Just Now" />
              </ul>
            </div>
          </div>

          {/* Right Section: About Company */}
          <div className="w-full lg:w-[45%] mt-5 md:mt-0 flex-1 flex flex-col gap-2 h-fit bg-white rounded-lg p-2 md:p-5">
            <h1 className="text-xl md:text-2xl font-outfit text-orange-600">
              About Company
            </h1>
            <div className="mt-4">
              <label className="block text-md ml-2 font-medium text-gray-800">
                Job Description
              </label>
              <div className="mt-1 bg-gray-200 p-2 rounded-lg shadow-sm">
                <ReactQuill
                  theme="snow"
                  value={jobDetails.jobDescription}
                  onChange={(content) => setJobDetails((prev) => ({ ...prev, jobDescription: content }))}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                      ['link', 'image']
                    ]
                  }}
                  placeholder="Enter job description..."
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Jobs Posted by You */}
        <div className="w-full rounded-xl h-fit bg-white p-2 md:p-10">
          <h1 className="text-xl md:text-2xl font-semibold mb-4">
            Jobs Posted by You
          </h1>
          {/* Check if jobs exist else render the No jobs content */}
          {jobs.length === 0 ? (
            <p className="text-center text-gray-500">No jobs have been posted by you.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-sm mt-2">Applicants: {job.applicants}</p>
                    <p className="text-sm mt-2 text-gray-500">Application ID: {job.applicationId}</p>
                  </div>
                  <div className="flex gap-2">
                    {/* View Applicants Button */}
                    <button
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm flex items-center"
                      onClick={() => handleViewClick(job)}
                    >
                      <FaEye className="mr-1" />
                    </button>

                    {/* Delete Application Button */}
                    <button 
                      className="px-3 py-2 bg-black text-white rounded-lg text-sm flex items-center"
                      onClick={() => handleDeleteClick(job.id)}
                    >
                      <FaTrash className="mr-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainContext>
  );
};

export default JobApplicationProviderView;
