import React, { useEffect, useState } from "react";

const CustomePagination = ({
  totalData,
  currentPage,
  dataPerPage,
  activePageBg = "#0c1a32",
  activePageColor = "#fff",
  onPageChange = () => {},
}) => {
  const [paginationtotalDataCount, setTotalDataCount] = useState(
    totalData || 10
  );
  const [paginationcurrentPage, setCurrentPage] = useState(currentPage || 1);
  const [paginationlimit, setLimit] = useState(dataPerPage || 10);
  const [noOfPages, setNoOfPages] = useState(
    Math.ceil(totalData / dataPerPage)
  );
  const [startPage, setStartPage] = useState(Math.max(1, currentPage - 2));
  const [endPage, setEndPage] = useState(Math.min(noOfPages, currentPage + 2));

  useEffect(() => {
    setStartPage(Math.max(1, paginationcurrentPage - 2));
    setEndPage(Math.min(noOfPages, paginationcurrentPage + 2));
  }, [paginationcurrentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };


  return (
    <div className="w-fit flex">
      {(endPage < startPage && totalData!==0) ? (
        <button
          key="btn"
          className={`px-3 py-1 rounded-md mx-1`}
          style={{
            background:activePageBg,
            color:activePageColor
          }}
        >
          {startPage}
        </button>
      ) : (
        <>
          {paginationcurrentPage > 1 ? (
            <button
              key={"prev"}
              onClick={() => handlePageChange(paginationcurrentPage - 1)}
            >
              Prev
            </button>
          ) : (
            <></>
          )}

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, index) => startPage + index
          ).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-md mx-1 ${
                paginationcurrentPage === page
                  ? `bg-[${activePageBg}] text-[${activePageColor}] `
                  : "bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
          {paginationcurrentPage < noOfPages ? (
            <button
              key={"next"}
              onClick={() => handlePageChange(paginationcurrentPage + 1)}
            >
              Next
            </button>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default CustomePagination;
