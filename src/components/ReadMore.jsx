import React, { useState } from "react";

const ReadMore = ({ maxLength = 500, content = "", className }) => {
  const [readMore, setReadMore] = useState(false);
  const sortContent = content.slice(0, maxLength);

  return (
    <div className={className}>
      {!readMore ? (
        <>
          {sortContent}{" "}
          <span
            className="ms-1 cursor-pointer text-blue-600"
            onClick={() => setReadMore(true)}
          >
            Read More
          </span>
        </>
      ) : (
        <>
          {content}{" "}
          <span
            className="ms-1 cursor-pointer text-blue-600"
            onClick={() => setReadMore(false)}
          >
            Read Less
          </span>
        </>
      )}
    </div>
  );
};

export default ReadMore;
