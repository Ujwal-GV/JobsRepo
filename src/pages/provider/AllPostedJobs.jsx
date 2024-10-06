import React from 'react';
import { useJobContext } from '../../contexts/JobContext';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AllPostedJobs = () => {
  const { jobs } = useJobContext();
  const navigate = useNavigate();

  const handleViewClick = (job) => {
    navigate(`/provider/post-job/${job.id}`, { state: { job } });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10 flex gap-10 font-outfit">
      {/* Left Side: Jobs Posted */}
      <div className='w-full lg:w-full flex flex-col lg:flex-row gap-10'>
      <div className="w-full lg:w-1/2 bg-white p-5 rounded-lg shadow-md">
        <h1 className="text-xl font-semibold mb-5">Jobs Posted by You</h1>
        
        {jobs.length === 0 ? (
          <p className="text-center text-gray-500">No jobs have been posted by you.</p>
        ) : (
          // Scrollable container for job postings
          <div className="flex flex-col gap-4 h-[620px] overflow-y-auto custom-scroll p-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 border rounded-lg shadow-sm flex justify-between items-center bg-gray-50"
              >
                <div>
                  <h3 className="font-bold">{job.title}</h3>
                  <p className="text-sm text-gray-600">Company: {job.companyName}</p>
                  <p className="text-sm text-gray-600">Applicants: {job.applicants}</p>
                </div>
                <button
                  className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm flex items-center"
                  onClick={() => handleViewClick(job)}
                >
                  <FaEye className="mr-1" /> View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Right Side: Blank Div */}
      <div className="w-full lg:w-1/2 bg-white p-5 rounded-lg shadow-md">
        <h1 className="text-xl font-semibold mb-5">Detailed View</h1>
        {/* Placeholder for the detailed job view */}
      </div>
      </div>
    </div>
  );
};

export default AllPostedJobs;
