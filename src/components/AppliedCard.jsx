import React, { useEffect, useRef, useState } from "react";
import { Steps } from "antd";
import { FaAngleDown } from "react-icons/fa";

const AppliedCard = ({ data }) => {
  const {
    isNew = "",
    img = "",
    title = "",
    company = "",
    location = "",
    postedBy = "",
    applicationStatus=[
        {
            title:"Applied",
            status:"finish",
        },
        {
            title :"Viewed",
            status:'wait'
        }
      ]
  } = data;

  const [collapse, setCollapse] = useState(true);
  const [maxHeight, setMaxHeight] = useState(0); // State to store maxHeight
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      if (!collapse) {
        // Set max-height to the actual content height when expanded
        setMaxHeight(contentRef.current.scrollHeight);
      } else {
        // Set max-height to 0 when collapsed
        setMaxHeight(0);
      }
    }
  }, [collapse]); // Trigger the effect when collapse state changes

  return (
    <div
      className="w-full md:max-w-[70%] md:mx-auto rounded-xl h-fit p-2 border border-slate-300  primary-shadow-hover cursor-pointer font-outfit"
      onClick={() => {setCollapse(true);alert("Job card Navigate")}}
    >
      <div className="w-full flex items-center justify-between px-2">
        <img src={img}  loading="lazy" alt="" className="w-10 h-10 md:h-12 md:w-12 border-gray rounded-lg p-1" />
        {
            applicationStatus.length > 0 && 
            <FaAngleDown
              className={"cursor-pointer w-6 h-6   bg-orange-600 rounded-full text-white duration-1000 transition-all "+(!collapse && "rotate-180")}
              onClick={(e) => {
                e.stopPropagation();
                setCollapse((prev) => !prev);
              }}
            />
        }
      </div>
      <div className="flex flex-col mt-2">
        <h1 className="">{title}</h1>
        <h2 className="font-extralight capitalize">{company}</h2>
      </div>

      {/* Apply transition to max-height */}
      <div
        style={{
          maxHeight: `${maxHeight}px`, // Dynamically set max-height
          transition: "max-height 0.7s ease-in-out", // Add transition for max-height
          overflow: "hidden",
        }}
      >
        <div ref={contentRef} className="w-full flex center ps-3">
          <Steps
            className="font-outfit"
            progressDot
            size="small"
            direction="vertical"
            current={1}
            items={applicationStatus}
          />
        </div>
      </div>
    </div>
  );
};
export default AppliedCard;
