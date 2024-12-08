import React, { useContext, useEffect, useState } from "react";
import MainContext from "../../../components/MainContext";
import CustomBreadCrumbs from "../../../components/CustomBreadCrumbs";
import { CiHome } from "react-icons/ci";
import SavedCard, { SavedCardSkeleton } from "../../../components/SavedCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../utils/axiosInstance";
import { NoPostFound } from "../CompanyAllPosts";
import { Pagination } from "antd";

const AppSavedListPage = () => {

  const [totalData_pagination, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedList,setSavedList] = useState([])
  const pageSize = 10;
  const queryClinet = useQueryClient();

  const getSavedData = async () => {
    const res = await axiosInstance.get("/user/job/saved-list", {
      params: {
        page: currentPage,
        limit: pageSize,
      },
    });
    if (res.data?.totalData) {
      setTotalData(res.data?.totalData);
    }
    if(res.data?.pageData)
    {
      setSavedList(res.data?.pageData)
    }
    return res.data;
  };

  console.log(savedList)

  console.log(totalData_pagination)
  

  const { isLoading, isFetching, isError, error, data } = useQuery({
    queryKey: ["saved_list", currentPage],
    queryFn: getSavedData,
    gcTime: 1000 * 60,
    staleTime: 0,
    retry: false,
  });

  const handleCurrentPageChange = (val) => {
    setCurrentPage(val);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const handleUnsavePOst = (jobId)=>{
    
    const removedData =  savedList?.filter((sData)=>sData?.saved_app_info?.job_id !== jobId)
    setSavedList((prev)=>[...removedData])
    alert(Removed)

  }


  useEffect(()=>{
     return ()=>{
      
      queryClinet.removeQueries(["saved_list"])
     }
  },[])


  const { totalData} = data ||{};

  if (!isError) {
   

    return (
      <MainContext>
        <div className="w-full min-h-[90vh] bg-slate-50 p-3 md:px-6 md:py-4">
          {/* Body Wrapper */}

         

          <div className="w-full md:w-[99%] lg:w-[90%] mx-auto h-full">
            {/* Job Application Status */}
            <div className="bg-white flex justify-between items-center rounded-xl w-full h-20 px-1 md:px-3">
              <span className="text-[1rem] md:text-xl font-outfit font-medium">
                Applications Saved{" "}
                {
                  (!isLoading && !isFetching && <span>({totalData >= 100 ? "99+" : totalData})</span>)
                }
              </span>
            </div>

            {/* Main content area */}

            <div className="bg-white  w-full p-4 mt-2 rounded-md">
              {
                (isLoading || isFetching) ?   <>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 place-items-start bg-white min   w-[100%] lg:w-[80%] mx-auto  gap-2  p-1 mt-3">
                    {/* Job Applications List */}

                    {[...Array(6)]?.map((idx) => (
                      <SavedCardSkeleton key={idx} />
                    ))}
                  </div>
                
                
                
                </> :      <>
                {totalData === 0 ? (
                <NoPostFound title={"No Application Found"} />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 place-items-start bg-white min   w-[100%] lg:w-[80%] mx-auto  gap-2  p-1 mt-3">
                    {/* Job Applications List */}

                    {data?.pageData?.map((sdata, idx) => (
                      <SavedCard key={idx} data={sdata} onDelete={handleUnsavePOst}/>
                    ))}
                  </div>
                  <div className="mt-2 w-full flex center">
                    <Pagination
                      disabled={isLoading || isFetching}
                      defaultCurrent={1}
                      current={currentPage}
                      className="w-fit mx-auto mb-5 mt-3"
                      total={totalData_pagination}
                      showSizeChanger={false}
                      pageSize={pageSize}
                      onChange={(e) => handleCurrentPageChange(e)}
                      prevIcon={
                        <button
                          disabled={
                            isLoading || isFetching || currentPage === 1
                          }
                          className={
                            "hidden md:flex " +
                            (currentPage === 1 && " !hidden")
                          }
                          style={{ border: "none", background: "none" }}
                        >
                          ← Prev
                        </button>
                      }
                      nextIcon={
                        <button
                          disabled={isLoading || isFetching}
                          className={
                            "hidden md:flex " +
                            (currentPage >= Math.ceil(totalData / pageSize) &&
                              "!hidden")
                          }
                          style={{ border: "none", background: "none" }}
                        >
                          Next →
                        </button>
                      }
                    />
                  </div>
                </>
              )}</>
              }
            </div>
          </div>
        </div>
      </MainContext>
    );
  }
};

export default AppSavedListPage;
