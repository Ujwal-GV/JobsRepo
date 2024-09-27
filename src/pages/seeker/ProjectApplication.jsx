import React, { useState } from "react";
import MainContext from "../../components/MainContext";
import { FaCheckCircle } from "react-icons/fa";
import JobSuggestionCard from "../../components/JobSuggestionCard";
import { jobData, projectData } from "../../../assets/dummyDatas/Data";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import ProjectSuggestionCard from "../../components/ProjectSuggestionCard";

const VerticalBar = () => {
  return <div className="w-0 h-5 border-r border-black"></div>;
};

const ProjectApplication = () => {


  return (
    <MainContext>
      <div className="w-full min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10 flex justify-between md:gap-3 lg:gap-10 flex-col lg:flex-row">
        <div className="w-full  lg:w-[55%] job-apply-section">
          <div className="w-full rounded-xl  h-fit bg-white p-2 md:p-10 font-outfit">
            <h1 className="text-[1.3rem] md:text-2xl font-semibold max-w-[80%] overflow-hidden text-ellipsis text-nowrap">
              E commer Website (MERN){" "}
            </h1>
            <h3 className="font-light mt-5">Company Name</h3>
            <div className="flex gap-2">
              <span>Price : 50K</span>
            </div>
            <hr className="mt-10 mb-2" />
            <div className="flex justify-end items-center">
              <div className="flex center gap-3">
                <button className="btn-orange px-3 py-1 tracking-widest">
                  Interested
                </button>
              </div>
            </div>
          </div>
          <div className="w-full rounded-xl mt-8  h-fit bg-white p-2 md:p-10">
            <h1 className="text-xl md:text-2xl font-semibold mb-4">
              Key Highlights
            </h1>
            <div className="high-light-content font-outfit">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
                praesentium eveniet ratione saepe aliquid illo exercitationem,
                porro commodi ipsum asperiores omnis quisquam accusamus
                distinctio ipsa, facere, nisi laudantium. Optio hic veritatis
                quam recusandae reiciendis sequi deleniti voluptatibus magni eos
                soluta error quae, provident assumenda est? Excepturi, voluptas.
                Enim, eligendi, pariatur quos dolores ipsa quas recusandae
                perferendis deserunt dolorem ratione molestiae repellat aut iure
                ad numquam sed reprehenderit? Quam quia maiores, deleniti
                aliquam dolore reiciendis minus molestiae consequatur numquam.
                Nobis consequatur impedit cupiditate dolorem, earum laudantium
                exercitationem delectus a enim saepe soluta rem sequi fugiat
                nulla quos est corporis, nemo eveniet!
              </p>
            </div>
          </div>
          <div className="w-full rounded-xl mt-8  h-fit bg-white p-2 md:p-10">
            <h1 className="text-xl md:text-2xl font-semibold mb-4">
              About Company
            </h1>
            <p className="font-outfit">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
              praesentium eveniet ratione saepe aliquid illo exercitationem,
              porro commodi ipsum asperiores omnis quisquam accusamus distinctio
              ipsa, facere, nisi laudantium. Optio hic veritatis quam recusandae
              reiciendis sequi deleniti voluptatibus magni eo.
            </p>
          </div>
        </div>
        <div className="w-full  lg:w-[45%] mt-5 md:mt-0 flex-1 flex flex-col gap-2  h-fit job-apply-suggestion-section bg-white rounded-lg p-2 md:p-5">
          <h1 className="text-xl md:text-2xl font-outfit text-orange-600">
            Similar projects you might like :
          </h1>
          {projectData.map((data) => (
            <ProjectSuggestionCard data={data} key={data.id} />
          ))}
        </div>
      </div>
    </MainContext>
  );
};

export default ProjectApplication;
