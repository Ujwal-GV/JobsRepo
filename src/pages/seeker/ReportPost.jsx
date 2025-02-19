import React, { useState } from "react";
import { FaDotCircle } from "react-icons/fa";
import { axiosInstance, getError } from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { LuLoader2 } from "react-icons/lu";

const ReportPost = ({
  onClose = () => {},
  reportedBy = "",
  reportedTo = "",
  postId = "",
}) => {
  const [selectedReson, setReson] = useState("");
  const [otherContent, setContent] = useState("");

  const report = async () => {
    const res = await axiosInstance.post("/reports/provider", {
      reportedBy,
      reportedTo,
      postId,
      content: selectedReson != "Others" ? selectedReson : otherContent,
    });
    return res.data;
  };

  const reportMutate = useMutation({
    mutationKey: ["provider-post-report"],
    mutationFn: report,
    onSuccess: (res) => {
      toast.success("Reported Successfully");
      onClose();
    },
    onError: (err) => {
      const { message } = getError(err);
      toast.error(message || "Something Went Wrong");
    },
  });

  const handleReportClick = () => {
    if (selectedReson === "") {
      toast.error("Please provide reson");
      return;
    }
    if (selectedReson === "Others") {
      if (otherContent === "") {
        toast.error("Please fill reson");
        return;
      }
    }

    if (reportedBy!=="" && reportedTo!=="" && postId!=="" && selectedReson!=="") {
      reportMutate.mutate();
    } else {
      toast.error("Failed to report");
    }
  };

  const reportingResons = [
    "Fraudulent Activity",
    "Violation of Policies",
    "Unprofessional Behavior",
    "Fake Company Details",
    "Unrealistic Salary or Job Conditions",
    "Fake Job Posting",
    "Offensive Content",
    "Spam Posting",
    "Illegal Activity",
    "Misleading Information",
    "Duplicate Posting",
    "Data Harvesting",
    "Others",
  ];

  return (
    <section
      className="fixed top-0 left-0 w-full h-screen bg-gray-500 bg-opacity-50 z-[999] flex justify-center items-center "
      onClick={() => onClose()}
    >
      <div
        className="bg-white rounded-lg p-5 w-[280px] md:w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-[1.5rem] text-orange-600">Report this post</h1>

        {reportingResons.map((reson, idx) => (
          <div
            key={idx}
            className="flex justify-start items-center gap-2 w-fit cursor-pointer my-2 text-[0.8rem]"
            onClick={() => setReson(reson)}
          >
            <FaDotCircle
              className={
                reson === selectedReson ? "text-orange-600" : "text-gray-400"
              }
            />{" "}
            {reson}
          </div>
        ))}

        {selectedReson === "Others" ? (
          <textarea
            placeholder="Reason"
            value={otherContent}
            className="w-full border text-[0.97rem]"
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          ></textarea>
        ) : (
          <></>
        )}

        <div className="flex justify-end items-center gap-2 text-[0.9rem] md:text-[1rem] mt-5">
          <button
            className="flex justify-center items-center gap-1"
            onClick={() => handleReportClick()}
            disabled={reportMutate.isPending}
          >
            {
                reportMutate.isPending ? <LuLoader2 className="animate-spin-slow text-orange-600 " /> :<></>
            } Report
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReportPost;
