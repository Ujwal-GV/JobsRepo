import React, { useEffect, useState } from "react";
import CustomePagination from "./CustomePagination";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RiLoader3Fill } from "react-icons/ri";
import { TbMoodEmpty } from "react-icons/tb";
import { Dropdown } from "antd";
import {
  FaLongArrowAltDown,
  FaLongArrowAltUp,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa";

const ReportTablePage = () => {
  const queryClient = useQueryClient();

  const LIMIT_ITEM = [
    {
      label: (
        <span
          className="w-full"
          onClick={() => {
            setTableLimit(10);
          }}
        >
          10
        </span>
      ),
      key: "10",
    },
    {
      label: (
        <span className="w-full" onClick={() => setTableLimit(20)}>
          20
        </span>
      ),
      key: "20",
    },
    {
      label: (
        <span className="w-full" onClick={() => setTableLimit(50)}>
          50
        </span>
      ),
      key: "50",
    },
    {
      label: (
        <span className="w-full" onClick={() => setTableLimit(100)}>
          100
        </span>
      ),
      key: "100",
    },
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
  const [tableLimit, setTableLimit] = useState(10);

  const fetchData = async ({ queryKey }) => {
    let queryParam = { page: queryKey[1], limit: tableLimit, reportedTo: searchText };

    queryParam = {
      ...queryParam,
    };

    try {
      const res = await axiosInstance.get("/reports", {
        params: queryParam,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const {
    isLoading,
    isFetching,
    isError,
    data,
    refetch: searchHandler,
  } = useQuery({
    queryKey: ["reports", currentPage, tableLimit],
    queryFn: fetchData,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  useEffect(() => {
    setTableLoading(isLoading);
    if (isFetching) {
      setTableLoading(isFetching);
    }
  }, [isLoading, isFetching]);

  useEffect(() => {
    if (data) {
      setTableData(data.reports);
      setFilteredTableData(data.reports);
      setTotalData(data.totalData);
      if (searchText !== "") {
        setCurrentPage(1);
      }
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
            onClick={() => setSortValue("")}
          >
            None
          </span>
        ),
        key: "1",
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
     if (sortValue === "Registered Date") {
        if (sortType === "inc") {
          filteredData = filteredData.sort(
            (a, b) =>
              new Date(a?.report.createdAt).getTime() - new Date(b?.report.createdAt).getTime()
          );
        } else if (sortType === "desc") {
          filteredData = filteredData.sort(
            (a, b) =>
              new Date(b?.report.createdAt).getTime() - new Date(a?.report.createdAt).getTime()
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

  return (
    <section className="w-full border-[0.05rem] border-gray-700 rounded-sm relative py-5 text-white px-2">
      <h1 className="text-center text-[2rem]">Users Report</h1>

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
            onChange={(e) => setSearchText(e.target.value)}
            className="bg-gray-900 bg-opacity-50 me-1 py-2 px-3 rounded-lg !border !border-black text-gray-400 placeholder:!text-[0.8rem]"
            placeholder="Search by Reported To"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchHandler();
              }
            }}
          />
          <button onClick={() => searchHandler()}>Search</button>
        </div>

       <div className="flex justify-center items-center gap-1">
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
            className: "custom-dropdown-menu",
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
          Report ID
        </span>
        <span className="text-[1.1rem] border border-gray-700 p-2 flex justify-start items-center gap-1 ">
          Reported By
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
          Reported To
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
          Reported Date
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
        <span className="text-[1.1rem] border border-gray-700 p-2 rounded-tr-md rounded-br-md">
          Reason
        </span>
        <span className="text-[1.1rem] border border-gray-700 p-2 rounded-tr-md rounded-br-md">
          Action
        </span>
      </div>

      {/* Table Data */}

      <article className="h-[70vh] overflow-y-auto custom-scroll">
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
              return <ReportTableCard key={idx} data={tData} />;
            })}
          </div>
        )}
      </article>

      <article className="w-full flex justify-between items-center mt-3 relative">
        <div className="">
          <span className="ml-9 text-[0.9rem] px-4 py-2 border border-white rounded-lg">
            Total Data : {totalData}
          </span>
        </div>
        <div className="flex flex-1 justify-center">
          <CustomePagination
            key={"provider-pagination"}
            totalData={totalData}
            currentPage={currentPage}
            dataPerPage={tableLimit}
            onPageChange={(p) => handleCurrentPageChange(p)}
          />
        </div>
        <div>
          <Dropdown
            menu={{
              items: LIMIT_ITEM,
              className: "custom-dropdown-menu",
              style: {
                display: "flex",
              },
            }}
            trigger={["click"]}
          >
            <a
              onClick={(e) => e.preventDefault()}
              className="cursor-pointer text-[0.9rem] mr-9 px-4 py-2 border border-white rounded-lg"
            >
              Limit | {tableLimit}
            </a>
          </Dropdown>
        </div>
      </article>
    </section>
  );
};

export default ReportTablePage

const ReportTableCard = ({ data = {} }) => {

    const {report} = data



  if (Object.keys(data).length > 0) {
    return (
      <div
        className="w-full grid grid-cols-6 p-2 border-b border-b-gray-700 hover:bg-gray-800 hover:bg-opacity-50 text-[0.9rem]"
        key={report?.report_id}
      >
        <span className="overflow-hidden text-ellipsis p-1">
          {report?.report_id}
        </span>
        <span className="overflow-hidden text-ellipsis p-1">
          {report?.reportedBy}
        </span>
        <span className="overflow-hidden text-ellipsis p-1">
          {report?.reportedTo}
        </span>
        <span className="overflow-hidden text-ellipsis p-1">{new Date(report?.createdAt).toLocaleString()}</span>
        <span className="overflow-hidden text-ellipsis p-1 text-red-600">
          {report?.content}
        </span>
        <span className="overflow-hidden text-ellipsis p-1">
          <button>Profile</button>
        </span>  
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
      {sortValue}
      {sortType === "inc" ? (
        <FaSortUp className=" text-green-600" />
      ) : (
        <FaSortDown className="text-red-600" />
      )}
    </div>
  );
};



