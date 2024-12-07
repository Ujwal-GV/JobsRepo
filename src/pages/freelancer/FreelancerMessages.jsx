import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../utils/axiosInstance';
import { JobCardSkeleton } from '../../components/JobCard';
import CustomBreadCrumbs from '../../components/CustomBreadCrumbs';
import { CiHome, CiSearch, CiUser } from 'react-icons/ci';
import { LiaRupeeSignSolid } from 'react-icons/lia';
import { VerticalBar } from '../seeker/CompanyPage';
import dayjs from 'dayjs';
import Loading from '../Loading';

export default function FreelancerMessages() {
    const { profileData } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [freelancerId, setFreelancerId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if(profileData) {
            setFreelancerId(profileData?.freelancer_id);
        }
        queryClient.invalidateQueries([freelancerId]);
    }, [profileData]);

    const fetchProjects = async () => {
        if (!freelancerId) throw new Error("Freelancer ID is not available");
        const res = await axiosInstance.get(`/freelancer/all-post`, {
            params: {
                freelancer_id: freelancerId
            }
        });

        const projectDetails = res.data[0].projects.map(
            (project) => project.projectData);
        return projectDetails;
    };

    const { data: projectsData = [], isLoading: projectsDataLoading, isError: projectsDataError, isSuccess: projectsDataSuccess } = useQuery({
        queryKey: ['freelancer_data', freelancerId],
        queryFn: fetchProjects,
        staleTime: 300000,
        cacheTime: 300000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: () => {
            toast.error("Something went wrong while fetching projects");
        },
    });

    const filteredProjects = (projectsData || []).filter((project) => {
        return (
            project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.dueTime?.includes(searchQuery)
        );
    });

    if (projectsDataLoading) {
        return <Loading />
    }

    return (
        <div className='flex flex-col w-full min-h-screen mx-auto bg-gray-100 py-3 md:py-3 md:px-6 gap-10'>
            <div className="w-full lg:w-[55%] job-apply-section flex flex-col mx-auto relative">
                {/* <div className="w-full flex center py-3 pt-2 bg-slate-100">
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
                </div> */}

                <div className="w-full rounded-xl h-fit bg-white hover: cursor-pointer px-4 py-7 lg:px-6 lg:py-6 md:py-6 md:px-6 font-outfit">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-5 gap-3">
                        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                        {/* Search Bar */}
                        <div className="relative w-full md:w-[60%] lg:w-[40%]">
                            <span className="w-full py-3 pr-0 bg-gray-100 text-sm rounded-full border-2 border-gray-200 focus:border-gray-200 focus:ring-2 focus:ring-gray-800">
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 pr-10 bg-gray-100 text-sm rounded-full"                         
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </span>
                            <span className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500">
                                <CiSearch size={20} className='text-black' />
                            </span>
                        </div>
                    </div>

                    <hr className='mt-2 mb-4' />

                    {filteredProjects.length > 0 ? (
                        <div className="grid h-auto grid-cols-1 gap-0 text-sm max-h-[35rem] overflow-y-auto custom-scroll">
                            {
                                filteredProjects.map((freelancer_data) => {
                                    const {
                                        applied_ids,
                                        project_id,
                                        name,
                                    } = freelancer_data;

                                return (
                                    <>
                                        <div
                                            key={project_id}
                                            className="w-full hover:rounded-full hover:bg-gray-200 px-4 py-5 font-outfit relative"
                                            onClick={() => handleProjectClick(project_id)}
                                        >
                                            <div className='flex flex-row'>
                                                <img 
                                                    src={profileData?.img} 
                                                    alt="Image" 
                                                    className="w-12 h-12 mr-4 rounded-full object-contain border-2 border-gray-200 bg-gray-100 p-1" 
                                                />                                                
                                                <h1 className="w-[90%] overflow-hidden text-ellipsis text-nowrap mb-4 text-md lg:text-lg md:text-lg uppercase font-semibold">
                                                    {name}
                                                </h1>
                                                <span className='my-auto p-2 w-5 h-5 text-xs md:text-sm center bg-orange-600 rounded-full font-bold'>1</span>
                                            </div>
                                        </div>
                                        {/* <hr /> */}
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
}
