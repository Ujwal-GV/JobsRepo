import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CiHome, CiLocationOn, CiUser, CiSearch } from 'react-icons/ci';
import { LiaRupeeSignSolid } from 'react-icons/lia';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import axios from 'axios';
import Loading from '../Loading';
import { AuthContext } from '../../contexts/AuthContext';
import CustomBreadCrumbs from '../../components/CustomBreadCrumbs';
import { JobCardSkeleton } from '../../components/JobCard';
import { VerticalBar } from '../seeker/CompanyPage';
import { axiosInstance } from '../../utils/axiosInstance';
import dayjs from 'dayjs';

const ProjectsPostedByFreelancer = () => {
    const { profileData } = useContext(AuthContext);
    const [freelancerDetails, setFreelancerDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { freelancer_id: freelancerId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.invalidateQueries(["freelancer_data", freelancerId]);
    }, [freelancerId, queryClient]);

    const fetchFreelancerData = async () => {
        const res = await axiosInstance.get("/freelancer/all-post",{
            params: { 
                freelancer_id: freelancerId 
            }
        });
        const projectDetails = res.data.flatMap((item) => 
            item.projects.map((project) => project.projectData)
        );
        return projectDetails;
    };

    const { data: freelancerData = [], isLoading: freelancerDataLoading, error  } = useQuery({
        queryKey: ["freelancer_data", freelancerId],
        queryFn: fetchFreelancerData,
        staleTime: 20000,
        cacheTime: 0,
        onError: () => {
        
            toast.error("Something went wrong while fetching jobs");
        }
    });

    // useEffect(() => {
    //     if (freelancerData) {
    //         const freelancerDetails = freelancerData?.pageData;
    //         console.log(freelancerData?.accountData);
            
    //         setFreelancerDetails(freelancerDetails);
    //     }
    // }, [freelancerData]);

    const handleProjectClick = (project_id) => {
        queryClient.invalidateQueries(["freelancer_data", freelancerId]);
        navigate(`/freelancer/project/${project_id}`)
    };

    const filteredProjects = (freelancerData || []).filter((project) => {
        return (
            project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.dueTime?.includes(searchQuery)
        );
    });    

    if (freelancerDataLoading) {
        return (
            <div className="flex flex-col w-full min-h-screen bg-gray-100 py-3 px-3 md:py-3 md:px-6 lg:px-3 gap-10">
                <div className="w-full lg:w-[55%] job-apply-section flex flex-col mx-auto relative">
                    <div className="w-full rounded-xl h-fit bg-white p-5">
                        <h1 className="text-2xl font-bold mb-5 text-gray-800">Projects Posted ({freelancerData?.length})</h1>
                            <hr className='mt-2 mb-4' />
                        {[1, 2, 3].map((d) => (
                            <div
                                key={d}
                                className="flex-1 bg-gray-200 mb-2 w-full flex items-center justify-center h-auto rounded-lg animate-pulse shadow-lg gap-2"
                            >
                                <JobCardSkeleton id={d} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col w-full min-h-screen mx-auto bg-gray-100 py-3 md:py-3 md:px-6 lg:px-3 gap-10'>
            <div className="w-full lg:w-[55%] job-apply-section flex flex-col mx-auto relative">
                <div className="w-full flex center py-3 pt-2 bg-slate-100">
                    <CustomBreadCrumbs
                        items={[
                            {
                                path: "/freelancer",
                                icon: <CiHome />,
                                title: "Home",
                            },
                            { title: "Projects Posted", icon: <CiUser /> },
                        ]}
                    />
                </div>

                <div className="w-full rounded-xl h-fit bg-white hover: cursor-pointer p-5 font-outfit">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
                    <h1 className="text-2xl font-bold text-gray-800">Projects Posted ({freelancerData?.length})</h1>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-[60%] lg:w-[40%]">
                        <input
                            type="text"
                            className="w-full px-4 py-2 pr-10 bg-gray-100 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            placeholder="Search by title or date"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500">
                            <CiSearch size={20} className='text-black' />
                        </span>
                    </div>
                </div>

                    <hr className='mt-2 mb-4' />

                    {filteredProjects.length > 0 ? (
                        <div className="grid h-auto grid-cols-1 gap-4 text-sm max-h-[35rem] overflow-y-auto custom-scroll">
                            {filteredProjects.map((freelancer_data) => {
                                const {
                                    applied_ids,
                                    project_id,
                                    dueTime,
                                    name,
                                    cost:{amount},
                                    skills = [],
                                } = freelancer_data;

                                return (
                                    <>
                                        <div
                                            key={project_id}
                                            className="w-full rounded-xl bg-gray-100 p-6 shadow-lg font-outfit mb-3 relative"
                                            onClick={() => handleProjectClick(project_id)}
                                        >
                                            <h1 className="w-[90%] overflow-hidden text-ellipsis text-nowrap mb-4 text-xl font-semibold">
                                                {name}
                                            </h1>
                                            <span className='absolute right-5 top-12 text-xs md:text-sm'>Applicants: ({applied_ids?.length})</span>
                                            <hr className='mt-2 mb-2' />
                                            <div className="w-full flex justify-start items-start gap-2 my-3">
                                                <span className="w-fit block"> Skills : </span>
                                                <div className="flex-1 w-full flex text-wrap overflow-hidden text-ellipsis max-h-9">
                                                    {skills.length > 0 ? skills.join(" , ") : "Not mentioned"}
                                                </div>
                                            </div>
                                            <div className="mt-1 flex flex-row justify-start items-center gap-1 text-xs md:text-sm">
                                                <span className="flex center">
                                                    Cost:
                                                    <LiaRupeeSignSolid />{" "}
                                                    {!amount ? (
                                                        "Not Disclosed"
                                                    ) : (
                                                        <>
                                                            {amount}
                                                        </>
                                                    )}
                                                </span>
                                                <VerticalBar className={"!border-slate-500 h-3 md:h-5"} />
                                                <span className="flex center">
                                                    Due Time:{" "}
                                                    {dayjs(dueTime).format("DD-MM-YYYY")}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center">
                            <p className="text-lg text-gray-500">No projects found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectsPostedByFreelancer;