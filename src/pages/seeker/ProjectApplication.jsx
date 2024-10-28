import React, { useContext, useEffect, useState } from "react";
import MainContext from "../../components/MainContext";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import ProjectSuggestionCard from "../../components/ProjectSuggestionCard";
import {  useLocation, useParams } from "react-router-dom";
import { axiosInstance, getError } from "../../utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../Loading";
import SomethingWentWrong from "../../components/SomethingWentWrong";
import toast from "react-hot-toast";
import { LuLoader2 } from "react-icons/lu";
import { AuthContext } from "../../contexts/AuthContext";
import { formatTimestampToDate } from "../../utils/CommonUtils";


const ProjectApplication = () => {
  const { id: projectId } = useParams();

  const { profileData } = useContext(AuthContext);
  const [applied, setApplied] = useState(false);


  useEffect(() => {
    setApplied(false)
    if (profileData && profileData !== null) {
      if (profileData?.application_applied_info?.projects?.find((id) => id.projectId === projectId)) {
        setApplied(true);
      }
    }
  }, [profileData,projectId]);



  const fetchprojectData = async (id) => {
    const res = await axiosInstance.get(`/projects/${projectId}`, {
      params: { similar_post: true },
      limit: 10,
    });
    return res.data;
  };

  const ProjectApply = async (postId) => {
    const res = await axiosInstance.post("/user/project/apply", { postId });
    return res.data;
  };


  const queryClient = useQueryClient()

  const applyMutate = useMutation({
    mutationKey: ["apply_project", projectId],
    mutationFn: ProjectApply,
    onSuccess: (data, varibles) => {
      setApplied(true);
      queryClient.invalidateQueries(["profile"])
      toast.success("Applied Successfully");
    },
    onError: (error) => {
      const { message } = getError(error);
      if (message) {
        toast.error(message);
      } else {
        toast.error("Something Went Wrong");
      }
    },
  });

  const { isLoading, isFetching, isSuccess, isError, error, data } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchprojectData(),
    staleTime: 60*1000,
    gcTime: 0,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (isLoading || isFetching) {
    return <Loading />;
  }

  if (isError && error) {
    return <SomethingWentWrong />;
  }

  const { provider_info, similarPost } = data || {};

  const location = useLocation()
  return (
    <MainContext>
      <div className="w-full min-h-screen bg-gray-100 pt-5 px-3 md:pt-12 md:px-6 lg:px-10 ">
        <section className="bg-white p-1 flex justify-between md:gap-3 lg:gap-10 flex-col lg:flex-row ">
          <div className="w-full  lg:w-[55%] job-apply-section">
            <div className="w-full rounded-xl  h-fit bg-white p-2 md:p-10 font-outfit">
              <h1 className="text-[1.3rem] md:text-2xl font-semibold max-w-[80%] overflow-hidden text-ellipsis text-nowrap">
                {data?.name || "Project Name"}
              </h1>
              <h3 className="font-light mt-5">{provider_info?.name}</h3>
              <div className="flex gap-2">
                <span>Cost : {data?.cost?.amount}</span>
              </div>
              <div className="flex center gap-1 w-fit mt-3 text-gray-600">
                <span>Due Time:</span>{" "}
                <span>{formatTimestampToDate(data?.dueTime)}</span>
              </div>
              <hr className="mt-5 mb-2" />
              <div className="flex justify-end items-center">
                  <div className="flex center gap-3">
                    {!applied ? (
                      <button
                        className="btn-orange px-3 py-1 flex center gap-1 tracking-widest"
                        disabled={applyMutate.isPending}
                        onClick={() => applyMutate.mutate(projectId)}
                      >
                        Interested{" "}
                        {applyMutate.isPending ? (
                          <LuLoader2 className="animate-spin-slow text-white  " />
                        ) : (
                          <></>
                        )}
                      </button>
                    ) : (
                      <button
                        className="btn-orange px-3 py-1 flex center gap-1 tracking-widest"
                        disabled={true}
                      >
                        Applied
                      </button>
                    )}
                  </div>
              </div>
            </div>
            <div className="w-full rounded-xl mt-8  h-fit bg-white p-2 md:p-10 border border-gray-100 ">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">
                Key Highlights
              </h1>
              <div className="high-light-content font-outfit">
                <p dangerouslySetInnerHTML={{ __html: data?.description }} />
              </div>
              <div>
                <h1 className="font-semibold">Skills</h1>
                <p className="w-full">{data?.skills.join(" , ")}</p>
              </div>
            </div>
            <div className="w-full rounded-xl mt-8  h-fit bg-white p-2 md:p-10">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">
                About Provider
              </h1>
              <div className="mt-3 text-sm">
                {provider_info?.email && (
                  <span className="flex w-fit center gap-1">
                    <KeyHighlightsListItem />
                    Email : <span>{provider_info?.email}</span>
                  </span>
                )}
                {provider_info?.mobile && (
                  <span className="flex w-fit center gap-1">
                    <KeyHighlightsListItem />
                    Mobile : <span>{provider_info?.mobile}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="w-full  lg:w-[45%] mt-5 md:mt-0 flex-1 flex flex-col gap-2  h-fit job-apply-suggestion-section bg-white rounded-lg p-2 md:p-5">
            <h1 className="text-[1.2rem] md:text-2xl font-outfit text-orange-600">
              Similar projects you might like :
            </h1>
            {similarPost?.length === 0 || !similarPost ? (
              <h1 className="w-full flex center">No Similar Projects Found</h1>
            ) : (
              similarPost?.map((data) => (
                <ProjectSuggestionCard data={data} key={data.id} />
              ))
            )}
          </div>
        </section>
      </div>
    </MainContext>
  );
};

export default ProjectApplication;




