import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../../utils/axiosInstance';
import CustomBreadCrumbs from '../../components/CustomBreadCrumbs';
import { CiHome, CiUser } from 'react-icons/ci';
import Loading from '../Loading';
import { Pagination } from 'antd';
import { FaEye, FaMailBulk } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import { JobCardSkeleton } from '../../components/JobCard';
import toast, { LoaderIcon } from 'react-hot-toast';
import { LuLoader2 } from 'react-icons/lu';

export default function ShortlistedCandidates() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [candidates, setCandidates] = useState([]);
    const limit = 16;  // Number of applicants per page
    const [totalData, setTotalData] = useState(0);
    const [pages, setPages] = useState(0);
    const totalPages = Math.ceil(totalData / limit);

    const fetchShortlistedCandidates = async (postId, page, limit) => {
        try {
            const response = await axiosInstance(`/jobs/post/shortlist`, {
                params: { postId, page, limit },
            });
            // console.log("Response", response.data.pageData.length);

            if (response.data) {
                const candidatesCount = response?.data?.totalData;
                setPages(response.data.pageData.length);
                setTotalData(candidatesCount);
                // console.log("TotalData", candidatesCount);
                return response.data;
            } else {
                throw new Error("No candidates found");
            }
        } catch (err) {
            throw new Error("Failed to fetch candidates");
        }
    };

    const {
        data: shortlistedCandidatesData,
        isLoading,
        isFetching,
        isError,
        error,
        refetch: refetchCandidates,
    } = useQuery({
        queryKey: ["shortlisted-candidates", postId, currentPage, limit],
        queryFn: () => fetchShortlistedCandidates(postId, currentPage, limit),
        staleTime: 0,
        gcTime: 0,
    });

    const sendMailToCandidates = async(postId) => {
        try {
            const response = await axiosInstance.post("/jobs/post/shortlist/send-mail", {
                postId,
            });
            if(response.data) {
                return response.data;
            } else {
                throw new Error("Failed to send mail");
            }
        } catch (err) {
            throw new Error(err.message || "Failed to send mail");
        }
    };

    const sendMailMutation = useMutation({
        mutationKey: ["send-mail-to-candidates"],
        mutationFn: sendMailToCandidates,
        onSuccess: (data) => {
            toast.success("Mail sent to shortlisted candidates");
            console.log(data);
        } ,
        onError: (error) => {
            console.log(error);
            toast.error("Failed to send mail");
        },
    });

    useEffect(() => {
        if (shortlistedCandidatesData?.pageData) {
            setCandidates(shortlistedCandidatesData.pageData);
        }
    }, [shortlistedCandidatesData]);

    const handlePageChange = (val) => {
        if (val <= totalPages && val > 0) {
            setCurrentPage(val);
            // console.log("Set current:", currentPage);
        }
    };

    const handleRefreshCandidates = () => {
        refetchCandidates();
    };

    const handleViewCandidate = (userId) => {
        navigate(`/provider/view-candidate/${postId}/${userId}`);
    };

    const handleSendMailToCandidates = () => {
        if(postId) {
            sendMailMutation.mutate(postId);
        } else {
            toast.error("Invalid post ID. Please refresh and try again");
        }
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100 py-3 px-4 gap-10">
            <div className="w-full flex flex-col mx-auto">
                <div className="w-full flex justify-center py-3 bg-slate-100">
                    <CustomBreadCrumbs
                        items={[
                            { path: "/provider", icon: <CiHome />, title: "Home" },
                            { title: "Shortlisted Candidates", icon: <CiUser /> },
                        ]}
                    />
                </div>

                <div className="w-full rounded-xl bg-white p-4">
                    <div className="flex flex-col md:flex-row md:justify-between mb-5 gap-3 relative">
                        <h1 className="text-2xl center font-bold text-gray-800">
                            Candidates: {(limit * (currentPage - 1)) + pages}/{totalData || 0}
                            {/* {console.log("CurrentPage", currentPage, "Pages", pages, "TotalData", totalData)} */}
                        </h1>

                        <div className="flex gap-2 md:ml-auto justify-center">
                            <button
                                className="flex items-center w-[80%] justify-center gap-1 text-sm bg-orange-600 hover:bg-orange-700 rounded-lg px-4 py-2 text-white"
                                onClick={handleSendMailToCandidates}
                                disabled={sendMailMutation.isPending}
                            >
                            {sendMailMutation.isPending ? (
                                <>
                                    <LuLoader2 className="animate-spin" /> Sending...
                                </>
                            ) : (
                                <>
                                    <FaMailBulk /> Send Mail
                                </>
                            )}
                            </button>
                            <button
                                onClick={handleRefreshCandidates}
                                className="text-gray-800 rounded-full p-3 hover:bg-gray-200 hover:rounded-full transition-all"
                            >
                                <MdRefresh className="text-xl" />
                            </button>
                        </div>
                    </div>

                    <hr className="mt-2 mb-4" />

                    {isLoading || isFetching ? (
                        [1, 2, 3].map((d) => (
                            <div className="w-full flex flex-col items-center">
                              {[1, 2, 3].map((d) => (
                                <div key={d} className="flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-gray-200 pr-6 mx-2 w-full flex items-center justify-center h-auto rounded-lg animate-pulse shadow-lg gap-2">
                                  <JobCardSkeleton id={d} />
                                  <JobCardSkeleton id={d} />
                                  <JobCardSkeleton id={d} />
                                  <JobCardSkeleton id={d} />
                                </div>
                              ))}
                            </div>
                          ))
                    ) : candidates?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm overflow-auto custom-scroll max-h-[35rem]">
                            {candidates.map((candidate) => (
                                <div
                                    key={candidate.user_id}
                                    className="w-full rounded-xl shadow-lg bg-gray-100 p-4 relative overflow-hidden"
                                >
                                    <h1 className="truncate text-md font-semibold">{candidate.name}</h1>
                                    <hr className="mt-2 mb-2" />
                                    <p className="text-xs truncate">{candidate.email}</p>
                                    <button
                                        className="flex items-center gap-1 text-xs bg-orange-600 hover:bg-orange-700 rounded-lg p-2 text-white"
                                        onClick={() =>handleViewCandidate(candidate?.user_id)}
                                    >
                                        <FaEye /> View Candidate
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center">
                            <p className="text-lg text-gray-500">No candidates found</p>
                        </div>
                    )}

                    <div className="mt-4 flex justify-center">
                        <Pagination
                            disabled={isLoading || isFetching}
                            pageSize={limit}
                            total={totalData}
                            defaultCurrent={1}
                            current={currentPage}
                            onChange={(page) => handlePageChange(page)}
                            className="pagination"
                            showSizeChanger={false}
                            prevIcon={
                                <button
                                    disabled={isLoading || isFetching || currentPage === 1}
                                    className={"hidden md:flex " + (currentPage === 1 && " !hidden")}
                                    style={{ border: "none", background: "none" }}
                                >
                                    ← Prev
                                </button>
                            }
                            nextIcon={
                                <button
                                    disabled={isLoading || isFetching || currentPage >= totalPages}
                                    className={
                                        "hidden md:flex " +
                                        (currentPage < totalPages ? "" : "!hidden")
                                    }
                                    style={{ border: "none", background: "none" }}
                                >
                                    Next →
                                </button>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

