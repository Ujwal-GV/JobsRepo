import React, { useEffect, useState } from "react";
import CustomePagination from "./CustomePagination";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { RiLoader3Fill } from "react-icons/ri";
import { TbMoodEmpty } from "react-icons/tb";
import { Dropdown } from "antd";
import { FaSortDown, FaSortUp } from "react-icons/fa";

const SeekerTable = () => {
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableFilter, setTableFilter] = useState({});
  const [searchText, setSearchText] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [sortType, setSortType] = useState("inc");

  const fetchData = async ({ queryKey }) => {
    const res = await axiosInstance.get("/admin/seekers", {
      params: {
        page: queryKey[1],
        limit: 10,
      },
    });
    return res.data;
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["seekers-data", currentPage],
    queryFn: fetchData,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  useEffect(() => {
    setTableLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      setTableData(data.users);
      setFilteredTableData(data.users);
      setTotalData(data.totalUsers);
    }
  }, [data]);

  const handleCurrentPageChange = (page) => {
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

    let filteredData = [];

    if (searchText === "") {
      filteredData = tableData;
    } else {
      filteredData = tableData.filter(
        (tData) =>
          tData?.name?.startsWith(searchText) ||
          tData?.user_id?.startsWith(searchText) ||
          tData?.email?.startsWith(searchText)
      );
    }

    if (sortValue !== "") {
        alert(sortType)
      if (sortValue === "name") {
        if (sortType === "desc") {
          filteredData = filteredData.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        } else if (sortType === "inc") {
          filteredData = filteredData.sort((a, b) =>
            b.name.localeCompare(a.name)
          );
        }
      } else if (sortValue === "email") {
        if (sortType === "desc") {
          filteredData = filteredData.sort((a, b) =>
            a.email.localeCompare(b.email)
          );
        } else if (sortType === "inc") {
          filteredData = filteredData.sort((a, b) =>
            b.email.localeCompare(a.email)
          );
        }
      } else if (sortValue === "Registered Date") {
      }
    }

    setFilteredTableData(filteredData);
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

  return (
    <section className="w-full border border-slate-100 rounded-sm relative py-3">
      {tableLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50 opacity-75 flex justify-center items-center cursor-progress">
          <RiLoader3Fill className="animate-spin text-[1.5rem]" />
        </div>
      )}

      {/* Table Filter */}

      <article className="w-full flex px-4 justify-between items-center">
        <div className="my-2 me-3">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="bg-[#efefef] me-1 py-2 px-3 rounded-lg !border !border-black"
            placeholder="Search by name or email or userId"
          />
          <button onClick={() => filterTableDataHandler()}>Search</button>
        </div>

        <div className="flex justify-center items-center gap-2">
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
        <span className="text-[1.1rem] border border-gray-400 p-2 rounded-tl-md rounded-bl-md">
          ID
        </span>
        <span className="text-[1.1rem] border border-gray-400 p-2 ">Name</span>
        <span className="text-[1.1rem] border border-gray-400 p-2">Email</span>
        <span className="text-[1.1rem] border border-gray-400 p-2">
          Registered Date
        </span>
        <span className="text-[1.1rem] border border-gray-400 p-2">Status</span>
        <span className="text-[1.1rem] border border-gray-400 p-2 rounded-tr-md rounded-br-md">
          Action
        </span>
      </div>

      {/* Table Data */}

      {filteredTableData.length === 0 && (
        <div className="w-full flex justify-center items-center h-[200px] text-gray-400">
          <TbMoodEmpty /> <span> No Data Found</span>{" "}
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
          key={"seeker-pagination"}
          totalData={totalData}
          currentPage={currentPage}
          dataPerPage={10}
          onPageChange={(p) => handleCurrentPageChange(p)}
        />
      </article>
    </section>
  );
};

export default SeekerTable;

const UserTableCard = ({ data = {} }) => {
  if (Object.keys(data).length > 0) {
    return (
      <div
        className="w-full grid grid-cols-6 p-2 border-b border-b-gray-300 hover:bg-slate-100"
        key={data?._id}
      >
        <span className="overflow-hidden text-ellipsis p-1">
          {data?.user_id}
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
      {sortValue} {sortType === "inc" ? <FaSortUp /> : <FaSortDown />}
    </div>
  );
};
