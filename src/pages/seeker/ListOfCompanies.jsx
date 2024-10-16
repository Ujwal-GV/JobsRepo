import React, { useContext, useEffect, useState } from "react";
import MainContext from "../../components/MainContext";
import { AutoComplete, ConfigProvider, Pagination, Skeleton, Spin } from "antd";
import { AuthContext } from "../../contexts/AuthContext";
import { axiosInstance } from "../../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { CustomSkeleton, NoPostFound } from "./CompanyAllPosts";
import CustomBadge from "../../components/badges/CustomBadge";
import { useNavigate } from "react-router-dom";

const ListOfCompanies = () => {
  const pageSize = 8;
  const [totalData, setTotalData] = useState(pageSize || 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [openSuggestion,setSuggestionOpen] =useState(false)


  const handlePageChange = (val) => {
    setCurrentPage(val);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const fetchCompanies = async () => {
    const res = await axiosInstance.get("/provider/allcompany", {
      params: { limit: pageSize, page: currentPage, q: searchText },
    });
    if (res.data) {
      setTotalData(res.data.totalDatas);
    }
    return res.data.pageData;
  };

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["search-comapny", currentPage],
    queryFn: () => fetchCompanies(currentPage),
    keepPreviousData: true,
    staleTime: 1000 * 60,
    cacheTime: 10000,
  });

  useEffect(() => {
    const fetchSearchData = async () => {
      if (searchText === "") {
        setSearchData([]);
        return;
      }
      const controller = new AbortController();
      const signal = controller.signal;
      try {
        setSearchLoading(true);

        const res = await axiosInstance.get(
          `/provider/searchCompany/${searchText}`,
          {
            signal,
          }
        );

        if (res.data) {
          const searchedData = res.data.map((sdata) => ({
            value: sdata.company_name,
          }));
          setSearchData(searchedData);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          console.error("Error fetching search data:", error);
        }
      } finally {
        setSearchLoading(false);
      }

      return () => {
        controller.abort(); // Cleanup to cancel any ongoing requests
      };
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSearchData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const handleSearchTextChange = (e) => {
    setSearchText(e);
  };

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
                options={searchData}
                className="rounded-lg auto-complete-custom !w-[250px] "
                style={{
                  border: "1px solid black ",
                }}
                open={openSuggestion}
                onFocus={()=>setSuggestionOpen(true)}
                value={searchText}
                onChange={handleSearchTextChange}
                placeholder="Search Company By Name"
                notFoundContent={searchLoading ? <Spin size="small" /> : null}
                onSelect={(e) => setSearchText(e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    refetch();
                    setSuggestionOpen(false)
                  }
                }}
              />
            </ConfigProvider>
            <button
              type="button"
              className="p-1 px-2 bg-orange-600 ms-2 rounded-full text-sm"
              onClick={() => {refetch();setSuggestionOpen(false)}}
            >
              Search
            </button>
          </div>
          <div className="mt-10 w-full">
            <h1>Search Results:</h1>
            <div
              className={"mt-2  grid grid-cols-1 sm:grid-cols-2 gap-5 sm:p-5 "}
            >
              {isLoading || isFetching ? (
                [...Array(pageSize)].map((i) => <CompanySearchCardSkeleton />)
              ) : (
                <>
                  {data?.length > 0 ? (
                    data?.map((cData, idx) => (
                      <CompanySearchCard key={idx} data={cData} />
                    ))
                  ) : (
                    <NoPostFound />
                  )}
                </>
              )}
            </div>
            <div className="mt-2 w-full flex center">
              <Pagination
                disabled={isLoading || isFetching}
                defaultCurrent={1}
                current={currentPage}
                className="w-fit mx-auto mb-5 mt-3"
                total={totalData}
                showSizeChanger={false}
                pageSize={pageSize}
                onChange={(e) => handlePageChange(e)}
                prevIcon={
                  <button
                    disabled={isLoading || isFetching || currentPage === 1}
                    className={
                      "hidden md:flex " + (currentPage === 1 && " !hidden")
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
          </div>
        </div>
      </div>
    </MainContext>
  );
};

export default ListOfCompanies;

const CompanySearchCard = ({ data }) => {
  const [userId, setUserId] = useState("");
  const { profileData } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    setUserId(profileData?.user_id);
  }, [profileData]);

  const {
    company_name,
    img,
    job_details,
    followers,
    project_details,
    company_id,
  } = data;
  return (
    <div
      className="w-full h-[130px] md:h-[150px] rounded-lg flex justify-between items-center cursor-pointer border border-gray-300 p-4 primary-shadow-hover relative hover:scale-[1.0002] "
      onClick={() => navigate(`/user/company/${company_id}`)}
    >
      {followers?.find((uid) => uid === userId) ? (
        <div className="absolute top-2 right-2">
          <CustomBadge text="Following" bgcolor="#1E5BF0" text_color="white" />
        </div>
      ) : (
        <></>
      )}
      <div>
        <h1 className="text-[1rem] md:text-[1.1rem] font-light">
          {company_name}
        </h1>
        <h6 className="text-[0.8rem] font-extralight mb-0">
          No of Post :{" "}
          {job_details.jobs
            ? job_details?.jobs?.length +
              (project_details?.projects?.length || 0)
            : 0}
        </h6>
        <h6 className="text-[0.8rem] font-extralight mb-0">
          Followers : {followers ? followers?.length : 0}
        </h6>
      </div>
      <div>
        <img
          src={img?.url || ""}
          alt={company_name}
          className="h-[60px] md:h-[70px] w-[60px] md:w-[70px] rounded-md border border-gray-300"
        />
      </div>
    </div>
  );
};

const CompanySearchCardSkeleton = () => {
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
