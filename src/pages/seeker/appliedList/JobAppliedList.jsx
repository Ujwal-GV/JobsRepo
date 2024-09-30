import React, { useState } from "react";
import MainContext from "../../../components/MainContext";
import { FaRegFaceFrownOpen } from "react-icons/fa6";
import { jobData } from "../../../../assets/dummyDatas/Data";
import JobSuggestionCard from "../../../components/JobSuggestionCard";
import CustomBreadCrumbs from "../../../components/CustomBreadCrumbs";
import { CiHome } from "react-icons/ci";
import AppliedCard from "../../../components/AppliedCard";

const JobAppliedList = () => {
  const count = 0;

  return (
    <MainContext>
      <div className="w-full min-h-[90vh] bg-slate-100 p-3 md:px-6 md:py-4">
        {/* Body Wrapper */}

        <div className="w-full flex center h-8">
        <CustomBreadCrumbs
              items={[
                {
                  path: "/user",
                  icon:<CiHome />,
                  title : "Home"
                },
                { title: "Applied Jobs"  },
              ]}
            />
        </div>

        <div className="w-full md:w-[99%] lg:w-[90%] mx-auto h-full">
          {/* Job Application Status */}
          <div className="bg-white flex justify-between items-center rounded-xl w-full h-20 px-1 md:px-3">
            <span className="text-[1rem] md:text-xl font-outfit font-medium">
              Applications Applied <span>({count >= 100 ? "99+" : count})</span>
            </span>
          </div>

          {/* Main content area */}
          <div className="flex flex-col gap-10 md:gap-3 lg:gap-2 lg:flex-row  w-full  h-[620px] overflow-y-auto custom-scroll p-1 mt-3">
            {/* Job Applications List */}
            <div
              className={`flex lg:flex-1  bg-white rounded-xl gap-2 lg:overflow-y-auto custom-scroll   p-3 ${
                count === 0
                  ? "justify-center items-center"
                  : "justify-start items-start flex-wrap"
              }`}
            >
              {count === 0 ? (
                <span className="flex gap-1 text-gray-400 font-outfit">
                  <FaRegFaceFrownOpen className="text-[1.1rem] md:text-xl" />
                  No Application Found
                </span>
              ) : (
                jobData.map((data, i) => <AppliedCard data={data} key={i} />)
                
              )}
              
            </div>

            {/* Suggested Jobs */}
            <div className="flex flex-col w-full lg:w-[40%]  rounded-xl px-1 py-2 bg-white">
              <h5 className="mt-2 text-lg font-semibold">Suggested Jobs:</h5>
              <div className="w-full flex flex-col gap-2 p-1 overflow-y-auto custom-scroll" style={{ maxHeight: "600px" }}>
                {jobData.map((d) => (
                  <JobSuggestionCard data={d} key={d.id} />
                ))}
              </div>
            </div>
          </div>


        </div>
      </div>
    </MainContext>
  );
};

export default JobAppliedList;
