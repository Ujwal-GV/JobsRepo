import React, { useEffect, useState } from "react";
import CustomePagination from "./CustomePagination";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { RiLoader3Fill } from "react-icons/ri";
import { TbMoodEmpty } from "react-icons/tb";
import { Dropdown } from "antd";
import {
  FaLongArrowAltDown,
  FaLongArrowAltUp,
  FaSortDown,
  FaSortUp,
  FaUserCheck,
  FaUsers,
  FaUserSlash,
} from "react-icons/fa";

const FreelancerTable = () => {
  const USER_TYPE = [
    { label: "All", icon: <FaUsers />, color: "yellow" },
    { label: "Blocked", icon: <FaUserSlash />, color: "red" },
    { label: "Not Blocked", icon: <FaUserCheck />, color: "green" },
  ];

  const [filteredTableData, setFilteredTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableFilter, setTableFilter] = useState({});
  const [searchText, setSearchText] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [sortType, setSortType] = useState("inc");
  const [userType, setUserType] = useState("All");

  const fetchData = async ({ queryKey }) => {

    let queryParam = {page: queryKey[1],
      limit: 10,q: searchText,}

    if(userType!=="All")
    {
      queryParam = {...queryParam , isBlocked : userType === "Blocked" ? true :false}
    }

    try {
        const res = await axiosInstance.get("/admin/freelancers", {
          params: queryParam,
        });
        console.log("Freelancers:", res.data);
        return res.data;
      } catch (error) {
        throw new Error(error);
      }
  };

  const {
    isLoading,
    isFetching,
    isError,
    data,
    refetch: searchHandler,
  } = useQuery({
    queryKey: ["freelancers-data", currentPage ,searchText ,userType],
    queryFn: fetchData,
    keepPreviousData: true,
    staleTime: 0,
  });

  useEffect(() => {
    setTableLoading(isLoading);
    if(isFetching)
    {
      setTableLoading(isFetching)
    }
  
  }, [isLoading,isFetching]);

  useEffect(() => {
    if (data) {
      setTableData(data.users);
      setFilteredTableData(data.users);
      setTotalData(data.totalUsers);
    }
  }, [data]);

  const handleCurrentPageChange = (page) => {
    console.log("Page", page);
    
    setCurrentPage(page);
  };

  //   Sort Login

  const items = [
    {
      label: (
        <span
          className="w-full"
          onClick={() => {
            setSortValue("");
            setSortType("inc");
          }}
        >
          None
        </span>
      ),
      key: "0",
    },
    {
      label: (
        <span className="w-full" onClick={() => setSortValue("name")}>
          Name
        </span>
      ),
      key: "1",
    },
    {
      label: (
        <span className="w-full" onClick={() => setSortValue("email")}>
          Email
        </span>
      ),
      key: "2",
    },
    {
      label: (
        <span
          className="w-full"
          onClick={() => setSortValue("Registered Date")}
        >
          Registered Date
        </span>
      ),
      key: "3",
    },
  ];

  const filterTableDataHandler = () => {
    setTableLoading(true);

    let filteredData = [...tableData];

    if (sortValue !== "") {
      if (sortValue === "name") {
        if (sortType === "inc") {
          filteredData = filteredData.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        } else if (sortType === "desc") {
          filteredData = filteredData.sort((a, b) =>
            b.name.localeCompare(a.name)
          );
        }
      } else if (sortValue === "email") {
        if (sortType === "inc") {
          filteredData = filteredData.sort((a, b) =>
            a.email.localeCompare(b.email)
          );
        } else if (sortType === "desc") {
          filteredData = filteredData.sort((a, b) =>
            b.email.localeCompare(a.email)
          );
        }
      } else if (sortValue === "Registered Date") {
        if (sortType === "inc") {
          filteredData = filteredData.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else if (sortType === "desc") {
          filteredData = filteredData.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      }
    } else {
      filteredData = [...filteredData];
    }

    setFilteredTableData(() => [...filteredData]);
    setTotalData(filteredData.length);
    setTableLoading(false);
  };

  useEffect(() => {
    if (tableData.length > 0) {
      handleSortChange();
    }
  }, [sortType, sortValue]);

  const handleSortChange = () => {
    filterTableDataHandler();
  };

  const handleUserTypeChange=(type)=>{
    setUserType(type)
    searchHandler()
  }

  return (
    <section className="w-full border-[0.05rem] border-gray-700 rounded-sm relative py-3">
      {tableLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-slate-700 bg-opacity-75 flex justify-center items-center cursor-progress">
          <RiLoader3Fill className="animate-spin text-[1.5rem]" />
        </div>
      )}

      {/* Table Filter */}

      <article className="w-full flex px-4 justify-between items-center">
        <div className="my-2 me-3">
          <input
            type="text"
            value={searchText}
            onChange={(e) => {setSearchText(e.target.value);setCurrentPage(1)}}
            className="bg-gray-900 bg-opacity-50 me-1 py-2 px-3 rounded-lg !border !border-black text-gray-400 placeholder:!text-[0.8rem]"
            placeholder="Search by name or email or userId"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchHandler();
              }
            }}
          />
          <button onClick={() => searchHandler()}>Search</button>
        </div>

        <div className="flex justify-center items-center gap-2">
          <div className="me-2 flex justify-center items-center gap-3">
            {USER_TYPE.map((type, idx) => {
              return (
                <span
                  key={type.label}
                  style={{
                    color: userType === type.label ? type.color : "white",
                  }}
                  onClick={()=>{handleUserTypeChange(type.label)}}
                  className="flex justify-center items-center gap-[2px] text-[0.7rem] cursor-pointer"
                >
                  {type.icon} {type.label}
                </span>
              );
            })}
          </div>

          {sortValue !== "" ? (
            <SortComponent
              key={sortValue}
              sortValue={sortValue}
              sortTypeValue={sortType}
              onSortTypeChange={(sortChangedValue) =>
                setSortType(sortChangedValue)
              }
            />
          ) : (
            <></>
          )}

          <Dropdown
            menu={{
              items,
              className: "custom-dropdown-menu"
            }}
            trigger={["click"]}
          >
            <a
              onClick={(e) => e.preventDefault()}
              className="cursor-pointer text-[0.8rem]"
            >
              Sort By
            </a>
          </Dropdown>
        </div>
      </article>

      {/* TAble */}

      {/* Table Header */}
      <div className="w-full grid grid-cols-6 p-2">
        <span className="text-[1.1rem] border border-gray-700 p-2 rounded-tl-md rounded-bl-md">
          ID
        </span>
        <span className="text-[1.1rem] border border-gray-700 p-2 flex justify-start items-center gap-1 ">
          Name{" "}
          {sortValue === "name" ? (
            sortType === "desc" ? (
              <FaLongArrowAltDown className="text-[0.5rem] text-red-600" />
            ) : (
              <FaLongArrowAltUp className="text-[0.5rem] text-green-600" />
            )
          ) : (
            ""
          )}
        </span>
        <span className="text-[1.1rem] border border-gray-700 p-2 flex justify-start items-center gap-1 ">
          Email{" "}
          {sortValue === "email" ? (
            sortType === "desc" ? (
              <FaLongArrowAltDown className="text-[0.5rem] text-red-600" />
            ) : (
              <FaLongArrowAltUp className="text-[0.5rem] text-green-600" />
            )
          ) : (
            ""
          )}{" "}
        </span>
        <span className="text-[1.1rem] border border-gray-700 p-2 flex justify-start items-center gap-1 ">
          Registered Date{" "}
          {sortValue === "Registered Date" ? (
            sortType === "desc" ? (
              <FaLongArrowAltDown className="text-[0.5rem] text-red-600" />
            ) : (
              <FaLongArrowAltUp className="text-[0.5rem] text-green-600" />
            )
          ) : (
            ""
          )}
        </span>
        <span className="text-[1.1rem] border border-gray-700 p-2">Status</span>
        <span className="text-[1.1rem] border border-gray-700 p-2 rounded-tr-md rounded-br-md">
          Action
        </span>
      </div>

      {/* Table Data */}

      {filteredTableData.length === 0 && (
        <div className="w-full flex justify-center items-center h-[200px] text-gray-400">
          {!tableLoading ? (
            <>
              <TbMoodEmpty /> <span> No Data Found</span>
            </>
          ) : (
            <></>
          )}
        </div>
      )}

      {filteredTableData.length > 0 && (
        <div className="mt-2 w-full">
          {filteredTableData.map((tData, idx) => {
            return <UserTableCard key={idx} data={tData} />;
          })}
        </div>
      )}

      <article className="w-full flex justify-center items-center mt-3 ">
        <CustomePagination
        //   key={"seeker-pagination"}
          totalData={totalData}
          currentPage={currentPage}
          dataPerPage={10}
          onPageChange={(p) => handleCurrentPageChange(p)}
        />
      </article>
    </section>
  );
};

export default FreelancerTable;

const UserTableCard = ({ data = {} }) => {
  if (Object.keys(data).length > 0) {
    return (
      <div
        className="w-full grid grid-cols-6 p-2 border-b border-b-gray-700 hover:bg-gray-800 hover:bg-opacity-50 text-[0.9rem]"
        key={data?._id}
      >
        <span className="overflow-hidden text-ellipsis p-1">
          {data?.freelancer_id}
        </span>
        <span className="overflow-hidden text-ellipsis p-1">{data?.name}</span>
        <span className="overflow-hidden text-ellipsis p-1">{data?.email}</span>
        <span className="overflow-hidden text-ellipsis p-1">
          {new Date(data?.createdAt).toLocaleString()}
        </span>
        <span className="overflow-hidden text-ellipsis p-1">
          {data?.isVerified ? "Verified" : "Not Verified"}
        </span>
        <div className="flex flex-wrap gap-[3px] justify-center items-center">
          <button>View Profile</button>
          <button>View Profile</button>
          <button>View Profile</button>
          <button>View Profile</button>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

const SortComponent = ({
  sortTypeValue,
  onSortTypeChange = () => {},
  sortValue,
}) => {
  const [sortType, setSortType] = useState(sortTypeValue || "inc");

  const handleSortTypeChange = () => {
    if (sortType === "inc") {
      setSortType("desc");
    } else {
      setSortType("inc");
    }
  };

  useEffect(() => {
    onSortTypeChange(sortType);
  }, [sortType]);

  return (
    <div
      className="w-fit flex text-[0.8rem] justify-center items-center gap-1 cursor-pointer "
      onClick={() => handleSortTypeChange()}
    >
      {sortValue}{" "}
      {sortType === "inc" ? (
        <FaSortUp className=" text-green-600" />
      ) : (
        <FaSortDown className="text-red-600" />
      )}
    </div>
  );
};
