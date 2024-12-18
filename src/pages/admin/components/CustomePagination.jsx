import React, { useEffect, useState } from "react";

const CustomePagination = ({
  totalData,
  currentPage,
  dataPerPage,
  activePageBg = "#0c1a32",
  activePageColor = "#fff",
  onPageChange = () => {},
}) => {
  const [paginationcurrentPage, setCurrentPage] = useState(currentPage || 1);
  const [noOfPages, setNoOfPages] = useState(Math.ceil(totalData / dataPerPage));
  const [startPage, setStartPage] = useState(Math.max(1, currentPage - 2));
  const [endPage, setEndPage] = useState(Math.min(noOfPages, currentPage + 2));

  useEffect(() => {
    const pages = Math.ceil(totalData / dataPerPage);
    setNoOfPages(pages);
    setStartPage(Math.max(1, currentPage - 2));
    setEndPage(Math.min(pages, currentPage + 2));
  }, [totalData, dataPerPage, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  if (totalData === 0) {
    return null;
  }

  return (
    <div className="w-fit flex">
      {paginationcurrentPage > 1 && (
        <button
          key="prev"
          onClick={() => handlePageChange(paginationcurrentPage - 1)}
          className="px-3 py-1 rounded-md mx-1"
        >
          ← Prev
        </button>
      )}
      {Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index
      ).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1 rounded-md mx-1 
            ${paginationcurrentPage === page ? 
              "bg-gray-300 text-black" : 
              `bg-[${activePageBg}] text-[${activePageColor}]
            `}`}
          // style={{
          //   backgroundColor: paginationcurrentPage === page ? `bg-[${activePageBg}]` : "bg-gray-300",
          //   color: paginationcurrentPage === page ? `text-[${activePageColor}]` : "",
          // }}
        >
          {page}
        </button>
      ))}
      {paginationcurrentPage < noOfPages && (
        <button
          key="next"
          onClick={() => handlePageChange(paginationcurrentPage + 1)}
          className="px-3 py-1 rounded-md mx-1"
        >
          Next →
        </button>
      )}
    </div>
  );
};

export default CustomePagination;
