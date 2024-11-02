import React, { useState, useEffect, useContext }  from "react";
import MainContext from "../../components/MainContext";
import SeachInput from "../../components/SeachInput";
import { FaArrowRight, FaCheckCircle, FaExclamationCircle, FaEye } from "react-icons/fa";
import AdvancedSwiper from "../../components/AdvanceSwiper";
import { SwiperSlide } from "swiper/react";
// import JobCard, { JobCardSkeleton } from "../../components/JobCard";
import ProjectCard from "../../components/ProjectCard";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance, getError } from "../../utils/axiosInstance";
import JobCard, { JobCardSkeleton } from "../../components/JobCard";
import { IoTrash } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../contexts/AuthContext";

function MainPageFreelancer() {
  const { profileData } = useContext(AuthContext);
  const [freelancerId, setFreelancerId] = useState(null);
  const navigate = useNavigate();
  const [deletedprojects, setDeletedProjects] = useState({});
  const queryClient = useQueryClient();

  const handlePostClick = () => {
    navigate("/freelancer/post-project");
  };

  const deleteProject = async (project_id) => {
    const response = await axiosInstance.delete(`/projects/${project_id}`);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: (data, variables) => {
      toast.success("Project deleted successfully!");
      setDeletedProjects((prev) => ({ ...prev, [variables]: true }));
      queryClient.invalidateQueries(['freelancer', freelancerId]);
    },
    onError: (error) => {
      toast.error("Error deleting job post: " + error.message);
    },
  });

  const handleProjectDelete = (project_id) => {
    mutation.mutate(project_id);
  };

  useEffect(() => {
    if (profileData) {      
      setFreelancerId(profileData?.freelancer_id);
    }
    queryClient.invalidateQueries([freelancerId])
  }, [profileData]);

  const fetchProjects = async () => {
    if (!freelancerId) throw new Error("Freelancer ID is not available");
    const res = await axiosInstance.get(`/freelancer/all-post`,{
      params: {
        freelancer_id: freelancerId
      }});

    const projectDetails = res.data.flatMap((item) => 
      item.projects.map((project) => project.projectData)
    );

    return projectDetails;
  };

  const { data: projectsData, isLoading: projectsDataLoading ,isError:projectsDataError ,isSuccess:projectsDataSuccess  } = useQuery({
    queryKey: ["freelancer", freelancerId],
    queryFn: fetchProjects,
    staleTime: 300000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 300000,
    onError: () => {
      toast.error("Something went wrong while fetching projects");
    },
  });

  return (
    <div className="w-full min-h-screen relative max-w-[1800px] bg-white mx-auto">
      <MainContext>
        <div className="h-[600px] w-full bg-slate-50 relative py-10">
          {/* blue bubble */}
          <div className="orange-bubble absolute top-[100px] left-[100px]" />
          {/* search input */}
          <div className="w-[250px] mx-auto md:w-[300px] lg:w-[500px]">
            <SeachInput placeholder="Search a job / project....." />
          </div>
          {/* prime header  */}
          <div className="mt-10 mx-auto w-fit font-outfit">
            <h1 className="text-center text-xl md:text-5xl font-semibold">
              Find projects posted by
            </h1>
            <h1 className="mt-6 text-center text-xl md:text-5xl font-semibold text-orange-500">
              YOU
            </h1>
          </div>
          <div className="orangle-circle absolute right-5 md:right-16  lg:right-[200px]  top-[200px]" />
          <div className="blue-circle absolute left-5 md:left-16 lg:left-[200px] bottom-[200px] shadow-sm " />
        </div>
      </MainContext>

      <div className="my-5 p-4 bg-gray-100 mx-auto w-full rounded-lg lg:w-2/3">
        <div className="my-5 flex flex-col gap-4 items-center justify-center text-center relative">
          <h2 className="text-2xl mx-auto font-semibold text-center flex-grow">Projects Posted by You</h2>
          <button
            onClick={handlePostClick}
            className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition duration-200"
          >
            Post a Project
          </button>
          {!projectsDataError && !projectsDataLoading && 
          (<button
            title="View"
            // className="px-3 py-2 shadow-lg bg-black text-white rounded-lg text-sm flex items-center hover:bg-gray-800 transition duration-200"
            className="absolute right-2 bottom-[-1rem] center underline text-sm"
            onClick={() => navigate(`/freelancer/projects-posted/${freelancerId}`)}
          >
            <FaEye className="mr-1 text-sm" />
            All Projects
          </button>)}
        </div>
        <hr className="mt-5 mb-2 border-gray" />
        <div className="flex flex-col gap-4 h-[620px] overflow-y-auto custom-scroll p-2">
        {projectsDataLoading ? (
          [1, 2, 3, 4, 5].map((d) => (
            <div key={d} className="flex-1 bg-white w-full flex items-center justify-center h-auto rounded-lg animate-pulse shadow-md">
              <JobCardSkeleton id={d} />
            </div>
          ))
        ) : projectsDataError ? (
          <div className="text-center flex flex-col items-center gap-4 mx-auto my-auto text-gray-500">
            <span><FaExclamationCircle className="text-2xl text-red-500" /></span>
            <span>Please login to post and view project details</span>
          </div>
        ) : projectsData?.length === 0 ? (
          <div className="text-center flex flex-col my-auto text-gray-500">
            No projects posted by you.
          </div>
        ) : (
          projectsData.map((project) => {
            const {
              name: projectName,
              dueTime,
              project_id,
              applied_ids,
            } = project;

            return (
              <>
                <div className="flex flex-col bg-white p-5 rounded-lg lg:flex-row justify-between items-start lg:items-center" key={project_id}>
                {/* Job Details */}
                <div className="flex flex-col">
                  <h3 className="font-bold">{projectName}</h3>
                  <p className="text-sm text-gray-600 mb-0">Due: {dayjs(dueTime).format("DD-MM-YYYY")}</p>
                  <p className="text-sm text-gray-600 mb-0">App-ID: {project_id}</p>
                  <p className="text-sm text-gray-600">Applicants: {applied_ids?.length}</p>
                </div>

                {/* Buttons */}
                <div className="flex flex-row gap-2 mt-2 lg:mt-0 lg:ml-4">
                  <button
                    title="View"
                    className="px-3 py-2 shadow-lg bg-black text-white rounded-lg text-sm flex items-center hover:bg-gray-800 transition duration-200"
                    onClick={() => navigate(`/freelancer/project/${project_id}`)}
                  >
                    <FaEye className="mr-1" />
                    View
                  </button>

                  <button
                    title="Delete"
                    className="px-3 py-2 shadow-lg bg-white text-black rounded-lg text-sm flex items-center border border-gray-500 hover:bg-gray-300 transition duration-200"
                    onClick={() => handleProjectDelete(project_id)}
                  >
                    <IoTrash className="mr-1" />
                    {
                      mutation.isLoading && mutation.variables === project_id && (
                        <LuLoader2 className="animate-spin-slow" />
                      )
                    }
                    {
                      deletedprojects[project_id] ? (
                        <FaCheckCircle className="text-black" />
                      ) : (
                        "Delete"
                      )
                    }
                  </button>
                </div>
              </div>
              </>
            )
          })
        )}
      </div>
      </div>
    </div>
  );
}

export default MainPageFreelancer;
