import React, {  useEffect, useState } from "react";
import MainContext from "../../../components/MainContext";
import CustomBreadCrumbs from "../../../components/CustomBreadCrumbs";
import { CiHome } from "react-icons/ci";
import SavedCard, { SavedCardSkeleton } from "../../../components/SavedCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../utils/axiosInstance";
import { NoPostFound } from "../CompanyAllPosts";
import { Pagination } from "antd";
import { CompanySearchCard } from "../ListOfCompanies";
import CustomBadge from "../../../components/badges/CustomBadge";



const FollowingCompanies = () => {

  const [totalData_pagination, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [companyList,setCompanyList] = useState([])
  const pageSize = 10;
  const queryClinet = useQueryClient();

  const getSavedData = async () => {
    const res = await axiosInstance.get("/user/companies/following", {
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
      setCompanyList(res.data?.pageData)
    }
    return res.data;
  };

  

  const { isLoading, isFetching, isError, error, data } = useQuery({
    queryKey: ["companies_list", currentPage],
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


  useEffect(()=>{
     return ()=>{
      queryClinet.removeQueries(["companies_list"])
     }
  },[])


  const { totalData} = data ||{};




  if (!isError) {
   

    return (
      <MainContext>
        <div className="w-full min-h-[90vh] bg-slate-100 p-3 md:px-6 md:py-4">
          {/* Body Wrapper */}

          <div className="w-full flex center h-8">
            <CustomBreadCrumbs
              items={[
                {
                  path: "/user",
                  icon: <CiHome />,
                  title: "Home",
                },
                { title: "Following" },
              ]}
            />
          </div>

          <div className="w-full md:w-[99%] lg:w-[90%] mx-auto h-full">
            {/* Job Application Status */}
            <div className="bg-white flex justify-between items-center rounded-xl w-full h-20 px-1 md:px-3">
              <h3 className="text-[1rem] md:text-xl font-outfit font-medium flex center gap-1">
                <span>Following </span>
            </h3>
            </div>

            {/* Main content area */}
            
            <div className="bg-white min-h-[70vh] w-full p-4 mt-2 rounded-md">
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
                <NoPostFound title={"Start Following"} />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 place-items-start bg-white min   w-[100%] lg:w-[80%] mx-auto  gap-2  p-1 mt-3">
                    {/* Job Applications List */}

                    {data?.pageData?.map((sdata, idx) => (
                      
                      <CompanySearchCard key={idx} data={sdata.companiesData} showFollowing={false}/>
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
                            ((currentPage * pageSize === totalData ||
                              totalData < pageSize) &&
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

export default FollowingCompanies;
