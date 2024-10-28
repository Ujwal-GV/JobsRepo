import React, { useContext, useEffect, useState } from "react";
import MainContext from "../../components/MainContext";
import { AutoComplete, ConfigProvider, Pagination, Skeleton, Spin } from "antd";
import { AuthContext } from "../../contexts/AuthContext";
import { axiosInstance } from "../../utils/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomSkeleton, NoPostFound } from "./CompanyAllPosts";
import CustomBadge from "../../components/badges/CustomBadge";
import { useNavigate } from "react-router-dom";
import { formatTimestampToDate } from "../../utils/CommonUtils";

const ListOfProjects = () => {
  const pageSize = 10;
  const [totalData, setTotalData] = useState(pageSize || 8);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [openSuggestion, setSuggestionOpen] = useState(false);

  const handlePageChange = (val) => {
    setCurrentPage(val);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const fetchProjects = async () => {
    const res = await axiosInstance.get("/projects/project/search", {
      params: { limit: pageSize, page: currentPage, q: searchText },
    });
    if (res.data) {
      setTotalData(res.data.totalData);
    }
    return res.data.pageData;
  };

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["search-projects", currentPage],
    queryFn: fetchProjects,
    keepPreviousData: true,
    staleTime: 1000 * 60,
    cacheTime: 10000,
  });

  const fetchSearchSuggestions = async () => {
    const res = await axiosInstance.get(`projects/search/${searchText}`);
    return res.data.map((sdata) => ({ value: sdata }));
  };

  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching:searchFetching,
    isSuccess:searchSuccess
  } = useQuery({
    queryKey: ["autocomplete-suggestions-projects", searchText],
    queryFn: fetchSearchSuggestions,
    enabled: !!searchText, // Only fetch when there's search text
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const handleSearchTextChange = (e) => {
    setSearchText(e);
  };

  const queryClient = useQueryClient()

  useEffect(()=>{
   return ()=>{
    queryClient.removeQueries(["autocomplete-suggestions-projects"])
   }
  },[])


  console.log(searchData)


  return (
    <MainContext>
      <div className="w-full min-h-screen bg-slate-50 py-5">
        <div className="w-full p-2 md:w-[95%] lg:w-[70%] mx-auto min-h-screen bg-white">
          <div className="w-full flex center h-7">
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "black",
                  colorLink: "#fadb14",
                  colorTextBase: "#000",
                },
              }}
            >
              <AutoComplete
                options={searchData || []}
                className="rounded-lg auto-complete-custom !w-[250px]"
                style={{ border: "1px solid black" }}
                open={openSuggestion}
                onFocus={() => setSuggestionOpen(true)}
                value={searchText}
                onChange={handleSearchTextChange}
                placeholder="Search by name or skills"
                notFoundContent={(searchLoading || searchFetching) ? <Spin size="small" /> : ((searchSuccess && !searchData)? "No Results Found" : null)}
                onSelect={(e) => setSearchText(e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    refetch();
                    setSuggestionOpen(false);
                  }
                }}
              />
            </ConfigProvider>
            <button
              type="button"
              className="p-1 text-white px-2 bg-orange-600 ms-2 rounded-full text-sm"
              onClick={() => {
                refetch();
                setSuggestionOpen(false);
              }}
            >
              Search
            </button>
          </div>
          <div className="mt-10 w-full">
            <h1>Search Results : </h1>
            <div
              className={
                "mt-2 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:p-5 " +
                (data?.length === 0 ? " !grid-cols-1 " : "")
              }
            >
              {isLoading || isFetching
                ? [...Array(pageSize)].map((i) => <ProjectSearchCardSkeleton />)
                : data?.length > 0
                ? data.map((cData, idx) => <ProjectSearchCard key={idx} data={cData} />)
                : <NoPostFound title={"No Projects found"} />}
            </div>
            <div className="mt-2 w-full flex center">
              {totalData > pageSize ? (
                <Pagination
                  disabled={isLoading || isFetching}
                  current={currentPage}
                  className="w-fit mx-auto mb-5 mt-3"
                  total={totalData}
                  showSizeChanger={false}
                  pageSize={pageSize}
                  onChange={handlePageChange}
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
                      disabled={isLoading || isFetching}
                      className={
                        "hidden md:flex " +
                        (currentPage >= Math.ceil(totalData / pageSize) && "!hidden")
                      }
                      style={{ border: "none", background: "none" }}
                    >
                      Next →
                    </button>
                  }
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </MainContext>
  );
};

export default ListOfProjects;

export const ProjectSearchCard = ({ data ,showApplied = true }) => {
  const [userId, setUserId] = useState("");
  const { profileData } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    setUserId(profileData?.user_id);
  }, [profileData]);

  const {
    provider_info,
    name,
    cost,
    dueTime,
    applied_ids
  } = data || {};

  return (
    <div
      className="w-full h-[130px] md:h-[150px] rounded-lg flex justify-between items-center cursor-pointer border border-gray-300 p-4 primary-shadow-hover relative hover:scale-[1.0002] "
      onClick={() => navigate(`/user/project-apply/${data.project_id}`)}
    >
      {
        showApplied ? applied_ids?.find((uid) => uid === userId) ? (
          <div className="absolute top-2 right-2">
            <CustomBadge text="Applied" bgcolor="white" text_color="green" />
          </div>
        ) : (
          <></>
        ) :<></>
      }
      <div>
        <h1 className="text-[1rem] md:text-[1.1rem] font-light">
          {name}
        </h1>
       {
        cost?.amount &&  <h6 className="text-[0.8rem] font-extralight mb-0">
        Price : {cost?.amount}
      </h6>
       }
        <h6 className="text-[0.8rem] font-extralight mb-0">
          Due Time : {checkoutDatePass(dueTime) === 1 ? <strike>{formatTimestampToDate(dueTime)}</strike> : formatTimestampToDate(dueTime) }
        </h6>
      </div>
      <div>
        <img
          src={provider_info?.img || ""}
          alt={"project"}
          className="h-[60px] md:h-[70px] w-[60px] md:w-[70px] rounded-md border border-gray-300"
        />
      </div>
    </div>
  );
};

const ProjectSearchCardSkeleton = () => {
  return (
    <div className="w-full h-[130px] md:h-[150px] rounded-lg flex justify-between items-center cursor-pointer border border-gray-300 p-4 primary-shadow-hover">
      <div>
        <h1 className="text-[1rem] md:text-[1.1rem] font-light">
          <CustomSkeleton height="20px" width="150px" />
        </h1>
        <h6 className="text-[0.7rem] font-extralight mb-0">
          <CustomSkeleton height="10px" width="50px" />
        </h6>
        <h6 className="text-[0.7rem] font-extralight mb-0">
          <CustomSkeleton height="10px" width="50px" />
        </h6>
      </div>
      <div>
        <CustomSkeleton height="70px" width="70px" />
      </div>
    </div>
  );
};


const checkoutDatePass = (val)=>{
  const givenTimestamp = new Date(val).getTime(); 
  const currentTimestamp = Date.now(); 
  if(currentTimestamp > givenTimestamp)
  {
    return 1
  } else if(currentTimestamp < givenTimestamp)
  {
    return -1
  }
  else {
    return 0
  }

}