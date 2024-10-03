import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React from "react";
import Navbar from "../components/Navbar";
import MainContext from "../components/MainContext";
import SeachInput from "../components/SeachInput";
import { FaArrowRight } from "react-icons/fa";
import AdvancedSwiper from "../components/AdvanceSwiper";
import { companyData, jobData, projectData } from "../../assets/dummyDatas/Data";
import { SwiperSlide } from "swiper/react";
import JobCard from "../components/JobCard";
import CompanyCard from "../components/CompanyCard";
import ProjectCard from "../components/ProjectCard";

const SwiperWrapper = ({title="" ,onViewClick=()=>{},children})=>{
  return <div className="my-5 w-full p-3">
  <div className="job-slider md:border w-full rounded-2xl h-full  shadow-black p-1 md:p-5">
    <h1 className="text-xl md:text-2xl font-semibold flex items-center justify-between gap-2">
      <span className="flex center text-[1rem] md:text-[1.2rem] ms-1 font-outfit">
        {title} <FaArrowRight className="ms-2"/>
      </span>
      <span className="text-orange-600 text-sm cursor-pointer hover:underline font-outfit me-1" onClick={onViewClick}>
        View All
      </span>
    </h1>
    <div className="mt-5  md:py-3">
      {
        children
      }
    </div>
  </div>
</div>

}

function MainPage() {

  return (
    <div className="w-full min-h-screen relative max-w-[1800px] bg-white mx-auto">
      <MainContext>
        <div className="h-[600px] w-full bg-slate-50 relative py-10">
          {/* blue bubble */}
          <div className="orange-bubble absolute top-[100px] left-[100px]" />
          {/* search input */}
          <div className="w-[250px] mx-auto md:w-[300px] lg:w-[500px]">
            <SeachInput placeholder = "Search a job / project....."/>
          </div>
          {/* prime header  */}
          <div className="mt-10 mx-auto w-fit font-outfit">
            <h1 className="text-center text-xl md:text-5xl font-semibold">
              Find jobs that matches your
            </h1>
            <h1 className="mt-6 text-center text-xl md:text-5xl font-semibold text-orange-500">
              Preferences
            </h1>
          </div>
          <div className="orangle-circle absolute right-5 md:right-16  lg:right-[200px]  top-[200px]" />
          <div className="blue-circle absolute left-5 md:left-16 lg:left-[200px] bottom-[200px] shadow-sm " />
        </div>

        {/* Jobs Slider */}
        <SwiperWrapper key={"jobs"} title="Recomended jobs for you" onViewClick={()=>alert("jobs List")}>
        <AdvancedSwiper key={"jobs"}>
              {jobData.map((item) => (
                <SwiperSlide key={item.id}>
                  <JobCard
                    key={item.id}
                    data={item}
                  />
                </SwiperSlide>
              ))}
            </AdvancedSwiper>
        </SwiperWrapper>

        {/* Company Slider */}

        <SwiperWrapper key={"company"} title="Explore jobs in top companies" onViewClick={()=>alert("comapny  List")}>
        <AdvancedSwiper>
                {companyData.map((data) => (
                  <SwiperSlide key={data.id}>
                    <CompanyCard data={data} />
                  </SwiperSlide>
                ))}
              </AdvancedSwiper>
        </SwiperWrapper>


        <SwiperWrapper key={"projects"} title="Suggested projects" onViewClick={()=>alert("Project  List")}>
        <AdvancedSwiper>
                {projectData.map((data) => (
                  <SwiperSlide key={data.id}>
                     <ProjectCard key={data.id} data={data}/>
                  </SwiperSlide>
                ))}
              </AdvancedSwiper>
        </SwiperWrapper>

      </MainContext>


      



    </div>
  );
}

export default MainPage;
