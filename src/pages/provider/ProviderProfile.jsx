import React, { useEffect, useState } from "react";
import MainContext from "../../components/MainContext";
import ProfileAvatar from "../../components/ProfileAvatar";
import InputBox from "../../components/InputBox";
import { MdEmail, MdEdit, MdDelete, MdPerson } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaArrowLeft, FaCircleCheck } from "react-icons/fa6";
import axios from "axios";
import "antd/dist/reset.css";
import { FaPhoneAlt, FaSave } from "react-icons/fa";
import { IoIosMale, IoIosFemale, IoMdTransgender } from "react-icons/io";
import { TbMoodEmptyFilled } from "react-icons/tb";
import { Field, Form, Formik } from "formik";
import { BiGroup, BiSolidBadgeCheck } from "react-icons/bi";
import { Input } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from "react-router-dom";

const { TextArea } = Input;

const ProviderProfile = () => {
  const [personalDetailsModelOpen, setpersonalDetailsModelOpen] = useState(false);
  const [jobDetailsModelOpen, setJobDetailsModelOpen] = useState(false);
  const [summaryModelOpen, setSummaryModelOpen] = useState(false);
  const [companyLinkModel, setCompanyLinkModel] = useState(false);

  const [personalDetails, setPersonalDetails] = useState({
    fullName: "Ujwal Gowda V",
    email: "ujwalgowda8792@gmail.com",
    mobile: "7483268624",
    gender: "Male",
  });

  const [companySummary, setCompanySummary] = useState("");
  const [companyLink, setCompanyLink] = useState("");

  const [jobDetails, setJobDetails] = useState({
    position: "",
    location: "",
    employmentType: "",
    description: "",
    qualification: "",
  });


  const handlePersonalDetails = (val) => {
    setPersonalDetails((prev) => {
      return { ...prev, ...val };
    });
  };

  const handleSummaryChange = (val) => {
    setCompanySummary(val);
  };

  const handleCompanyLinkChange = (val) => {
    setCompanyLink(val);
  }

  const handleJobDetailsChange = (val) => {
    setJobDetails((prev) => {
      return { ...prev, ...val };
    });
  };

  return (
    <MainContext>
      <div className="w-full h-screen bg-slate-50 ">
        <div className="w-full h-screen overflow-y-auto relative overflow-x-hidden mx-auto  mt-2 md:max-w-[80%] lg:max-w-[70%] bg-slate-100 pb-5 px-2 md:px-0 font-outfit ">
          {/* Avatar and PersonalDetails */}

          <div className="flex center flex-col w-[95%] z-999 md:flex-row md:w-full gap-2 sticky top-0 pt-2   h-fit mx-auto">
            <div className="w-[200px] h-[200px] flex center relative rounded-full  bg-white">
              <ProfileAvatar />
            </div>
            <div className="bg-white w-full md:w-[500px] h-full  p-3 md:p-7 rounded-xl relative">
              <MdEdit
                className="absolute top-2 right-2  cursor-pointer"
                onClick={() => setpersonalDetailsModelOpen(true)}
              />
              <h1>{personalDetails.fullName}</h1>
              <h1 className="flex justify-start items-center gap-1">
                <MdEmail className="text-orange-600" />
                {personalDetails.email}
              </h1>
              <h1 className="flex justify-start items-center gap-1">
                {" "}
                <FaPhoneAlt className="text-orange-600" />{" "}
                {personalDetails.mobile}
              </h1>
              <h1 className="flex justify-start items-center gap-1">
                {personalDetails.gender.toLowerCase() === "male" && (
                  <IoIosMale className="text-orange-600" />
                )}
                {personalDetails.gender.toLowerCase() === "female" && (
                  <IoIosFemale className="text-orange-600" />
                )}
                {personalDetails.gender.toLowerCase() === "transgender" && (
                  <IoMdTransgender className="text-orange-600" />
                )}
                {personalDetails.gender}
              </h1>
            </div>
          </div>

          {/* Other Profile Details */}

          <div className="w-[60%] z-0  mx-auto flex flex-col gap-2 md:gap-0 sm:flex-row justify-evenly items-center p-1 border-t mt-2">
            <DeatilsBadge
              icon={<BiSolidBadgeCheck className="text-green-600" />}
              title="Jobs Posted"
              val={10}
            />
            <DeatilsBadge
              icon={<BiGroup className=" text-orange-600" />}
              title="No. of Employees"
              val={2001}
            />
          </div>

          <div className="w-full  h-80 max-w-[90%] md:w-full mx-auto mt-4 flex flex-col lg:flex-row gap-2">
            <div className="part-1 flex-1">
                {/* Company Links Section */}
                <CompanyInputWrapper>
                  <CompanyLinksField
                    title="Company Link"
                    icon={companyLink.trim() === "" ? "Add" : "Edit"}
                    editOnClick={() => setCompanyLinkModel(true)}
                  >
                    <div className="flex flex-wrap gap-1 w-full pb-2 ">
                      {!companyLink ? (
                        <div className="w-full gap-1 center flex">
                          <TbMoodEmptyFilled /> Add Company Links
                        </div>
                      ) : (
                        <>
                          <div className="w-full h-full bg-white p-2 rounded-lg overflow-hidden text-ellipsis">
                            {companyLink.split(',').map((link, index) => (
                              <span key={index}>
                                <a
                                  href={link.trim()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500"
                                >
                                  {link.trim()}
                                </a>
                                {index < companyLink.split(',').length - 1 && <span><br /> </span>}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </CompanyLinksField>
                </CompanyInputWrapper>

                {/* Company Summary Section */}
                <CompanyInputWrapper>
                    <CompanyInfoField
                    title="Company Summary"
                    icon={companySummary.trim() === "" ? "Add" : "Edit"}
                    editOnClick={() => setSummaryModelOpen(true)}
                    >
                    <div className="flex flex-wrap gap-1 w-full pb-2 ">
                        {!companySummary ? (
                        <div className="w-full gap-1 center flex">
                            <TbMoodEmptyFilled /> Add summary about the Company
                        </div>
                        ) : (
                        <div className="w-full h-full bg-white p-2 rounded-lg overflow-hidden text-ellipsis">
                            {companySummary}
                        </div>
                        )}
                    </div>
                    </CompanyInfoField>
                </CompanyInputWrapper>

                {/* Job Details Section */}
                <CompanyInputWrapper>
                  <CompanyInfoField
                    title="Job Details"
                    icon={
                      Object.values(jobDetails).some(
                        (s) => s !== null && s !== ""
                      )
                        ? "Edit"
                        : "Add"
                    }
                    editOnClick={() => setJobDetailsModelOpen(true)}
                  >
                    <div className="flex flex-wrap gap-1 w-full pb-2">
                      {jobDetails.position ? (
                        <div className="w-full h-full bg-white p-2 rounded-lg overflow-hidden text-ellipsis">
                          <div className="mb-2">
                            <strong>Position:</strong> {jobDetails.position}
                          </div>
                          <div className="mb-2">
                            <strong>Location:</strong> {jobDetails.location}
                          </div>
                          <div className="mb-2">
                            <strong>Type of Employment:</strong> {jobDetails.employmentType}
                          </div>
                          <div className="mb-2">
                            <strong>Qualification:</strong> {jobDetails.qualification}
                          </div>

                          {jobDetails.jobDescription && (
                            <div className="mb-2">
                              <strong>Job Description:</strong>
                              {/* Render the HTML content of the job description safely */}
                              <div
                                className="mt-2"
                                dangerouslySetInnerHTML={{ __html: jobDetails.jobDescription }}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full gap-1 center flex">
                          <TbMoodEmptyFilled /> Add job details
                        </div>
                      )}
                    </div>
                  </CompanyInfoField>
                </CompanyInputWrapper>
            </div>
          </div>

        {/* Models */}

          <ProfilePersonalDetailsModal
            open={personalDetailsModelOpen}
            onClose={() => setpersonalDetailsModelOpen(false)}
            value={personalDetails}
            onChange={handlePersonalDetails}
          />
      <AnimatePresence>
              
      {summaryModelOpen && (
            <AnimateEnterExit>
            <CompanySummaryModel
                open={summaryModelOpen}
                onClose={() => setSummaryModelOpen(false)}
                value={companySummary}
                onSummaryChange={handleSummaryChange}
            />
            </AnimateEnterExit>
        )}

        {companyLinkModel && (
            <AnimateEnterExit>
            <CompanyLinkModel
                open={companyLinkModel}
                onClose={() => setCompanyLinkModel(false)}
                value={companyLink}
                onLinkChange={handleCompanyLinkChange}
            />
            </AnimateEnterExit>
        )}

        {jobDetailsModelOpen && (
              <AnimateEnterExit>
                <JobDetailsModel
                  open={jobDetailsModelOpen}
                  onClose={() => setJobDetailsModelOpen(false)}
                  value={jobDetails}
                  onJobDetailsChange={handleJobDetailsChange}
                />
              </AnimateEnterExit>
            )}
          </AnimatePresence>
        </div>
    </div>
    </MainContext>
  );
};

export default ProviderProfile;

const DeatilsBadge = ({ icon = "", title = "", val = "" }) => {
    const [hovered, setHovered] = useState(false);
  
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={
          "w-[250px] md:w-fit h-[50px] cursor-pointer  center flex gap-1 border bg-white rounded-lg px-3 "
        }
      >
        {icon}{" "}
        <span
          className={" duration-150 text-nowrap " + (hovered && "tracking-wide")}
        >
          {title}
        </span>
        <span className="p-1 bg-slate-200 rounded-full ml-1 text-sm">
          {val >= 2001 ? "2000+" : val}
        </span>
      </div>
    );
  };
  
  const CompanyInputWrapper = ({ children }) => (
    <div className="flex flex-col mt-3 center w-full">
      <div className="w-full ">{children}</div>
    </div>
  );
  
  const Tag = ({ close = false, onClick = () => {}, val, className = "" }) => {
    return (
      <div
        onClick={onClick}
        className={
          "rounded-full cursor-pointer center gap-1 bg-white h-10 border hover:border-gray-950  px-3 text-sm " +
          (close && " active-tag ") +
          className
        }
      >
        {val} {close && <IoMdClose className="close rounded-full p-[0.1rem]" />}
      </div>
    );
  };
  
  const ProfileGender = ({
    value = "",
    customClass = "",
    onChange = () => {},
  }) => {
    const Genderdata = ["Male", "Female", "Transgender"];
  
    const [val, setVal] = useState(value);
  
    useEffect(() => {
      setVal(value);
    }, [value]);
  
    const handleChange = (v) => {
      setVal(v);
      onChange(v);
    };
  
    const handleDelete = () => {
      setVal("");
      onChange("");
    };
  
    return (
      <div
        className={
          "w-full h-fit flex justify-start items-center gap-3 bg-gray-200 rounded-lg p-2 ps-4 " +
          customClass
        }
      >
        <span className="text-nowrap">Gender :</span>
        {val ? (
          // Show the selected tag with close button
          <Tag val={val} close={true} key={val} onClick={handleDelete} />
        ) : (
          // Show the list of gender options when no gender is selected
          <div className="flex  flex-row gap-2 overflow-auto">
            {Genderdata.map((d) => (
              <Tag val={d} key={d} onClick={() => handleChange(d)} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const CompanyLinksField = ({
    editOnClick = () => {},
    title = "",
    children,
    icon = "Add",
  }) => {
    return (
      <div className="w-full h-fit flex flex-col justify-start items-start gap-3 bg-white rounded-lg p-2 ps-4 ">
        <div className="flex justify-between items-center w-full">
          <span>{title} :</span>{" "}
          <span className="text-orange-600 cursor-pointer" onClick={editOnClick}>
            {icon}
          </span>
        </div>
        {children}
      </div>
  );
};
  
  const CompanyInfoField = ({
    editOnClick = () => {},
    title = "",
    children,
    icon = "Add",
  }) => {
    return (
      <div className="w-full h-fit flex flex-col justify-start items-start gap-3 bg-white rounded-lg p-2 ps-4 ">
        <div className="flex justify-between items-center w-full">
          <span>{title} :</span>{" "}
          <span className="text-orange-600 cursor-pointer" onClick={editOnClick}>
            {icon}
          </span>
        </div>
        {children}
      </div>
    );
  };
  
  //Model Forms for all
  const JobDetailsModel = ({ open, onClose, value, onJobDetailsChange }) => {
    return (
      <div
        className={
          "absolute top-[0] left-0 w-full flex center h-screen bg-slate-200 profile-modal p-7 md:p-10 " +
          (open ? "profile-modal-show " : " ")
        }
      >
        <div className="border relative w-[90%] lg:w-[50%] p-5 md:p-8 bg-gray-100 border-white rounded-lg">
          <FaArrowLeft
            className="absolute text-white w-5 h-5 p-1 top-5 left-4 md: p-1 md:top-8 md:left-5 cursor-pointer bg-gray-600 rounded-full"
            onClick={() => {
              onClose();
            }}
          />
          <h1 className="mb-5 mx-4 ml-5">Job Details</h1>
          <Formik
            initialValues={value}
            onSubmit={(values) => {
              onJobDetailsChange(values);
              onClose();
            }}
          >
            {({ setFieldValue, resetForm, values }) => (
              <Form>
                {/* Position Field */}
                <Field name="position">
                  {({ field }) => (
                    <InputBox
                      {...field}
                      label="Position"
                      placeholder="Enter Job Position"
                    />
                  )}
                </Field>
  
                {/* Location Field */}
                <Field name="location">
                  {({ field }) => (
                    <InputBox
                      {...field}
                      label="Location"
                      customClass="mt-4"
                      placeholder="Enter Job Location"
                    />
                  )}
                </Field>
  
                {/* Employment Type Field */}
                <Field name="employmentType">
                  {({ field }) => (
                    <InputBox
                      {...field}
                      label="Type of Employment"
                      customClass="mt-4"
                      placeholder="Full-time / Part-time / Contract"
                    />
                  )}
                </Field>

                {/* Job Qualification Field */}
                <Field name="qualification">
                  {({ field }) => (
                    <InputBox
                      {...field}
                      label="Qualification"
                      customClass="mt-4"
                      placeholder="Enter Job Qualification"
                    />
                  )}
                </Field>
  
                {/* React Quill */}
                <div className="mt-4">
                  <label className="block text-md ml-2 font-medium text-gray-800">
                    Job Description
                  </label>
                  <div className="mt-1 bg-gray-200 p-2 rounded-lg shadow-sm">
                    <ReactQuill
                      theme="snow"
                      value={values.jobDescription || ""}
                      onChange={(content) => setFieldValue("jobDescription", content)}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline'],
                          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                          ['link', 'image']
                        ]
                      }}
                      placeholder="Enter job description..."
                      className="h-full"
                    />
                  </div>
                </div>
  
                <div className="w-full mt-4 center gap-3">
                  <button
                    type="submit"
                    className="btn-orange px-3 border py-1 border-transparent tracking-widest"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn-orange-outline px-3 py-1"
                    onClick={() => {
                      onClose();
                      resetForm({ values: value }); // Reset form on cancel
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  };


  const ProfilePersonalDetailsModal = ({
    open,
    onClose = () => {},
    onChange = () => {},
    value = {
      fullName: null,
      email: null,
      mobile: null,
      gender: null,
    },
  }) => {
    return (
      <div
        className={
          "absolute top-[0] left-0 w-full flex center h-screen bg-slate-200 profile-modal p-7 md:p-10 " +
          (open ? "profile-modal-show " : " ")
        }
      >
        <div className="border relative w-[90%] lg:w-[50%] p-5 md:p-8 bg-gray-100 border-white rounded-lg">
          <FaArrowLeft
            className="absolute text-white w-5 h-5 p-1 top-5 left-4 md: p-1 md:top-8 md:left-5 cursor-pointer bg-gray-600 rounded-full"
            onClick={() => {
              onClose();
            }}
          />
          <h1 className="mb-5 mx-4 ml-5">Personal Details</h1>
  
          <Formik
            initialValues={value}
            enableReinitialize={true} // Ensure form resets when modal opens again with new values
            onSubmit={(data, { resetForm }) => {
              onChange(data);
              onClose();
              // alert(JSON.stringify(data))
              resetForm();
            }}
          >
            {({ setFieldValue, resetForm, values }) => (
              <Form>
                {/* Full Name with Icon */}
                <Field name="fullName">
                  {({ field }) => (
                    <InputBox
                      {...field}
                      icon={<MdPerson />} // Icon for full name
                      placeholder="Full Name"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e); // Formik's handleChange
                      }}
                    />
                  )}
                </Field>
  
                {/* Email with Icon */}
                <Field name="email">
                  {({ field }) => (
                    <InputBox
                      {...field}
                      icon={<MdEmail />} // Icon for email
                      placeholder="Email"
                      customClass="mt-4"
                      value={field.value}
                      disabled={true} // Assuming email is non-editable
                    />
                  )}
                </Field>
  
                {/* Mobile with Icon */}
                <Field name="mobile">
                  {({ field }) => (
                    <InputBox
                      {...field}
                      icon={<FaPhoneAlt />} // Icon for mobile
                      placeholder="Enter Mobile"
                      customClass="mt-4"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e); // Formik's handleChange
                      }}
                    />
                  )}
                </Field>
  
                {/* Gender */}
                <Field name="gender">
                  {({ field }) => (
                    <ProfileGender
                      key={values.gender}
                      {...field}
                      customClass="mt-4"
                      value={values.gender}
                      onChange={(val) => {
                        setFieldValue("gender", val); // Custom handler for select
                      }}
                    />
                  )}
                </Field>
  
                {/* Buttons */}
                <div className="w-full mt-4 center gap-3">
                  <button
                    type="submit"
                    className="btn-orange px-3 border py-1 border-transparent tracking-widest"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn-orange-outline px-3 py-1"
                    onClick={() => {
                      onClose();
                      resetForm({ values: value }); // Reset form on cancel
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  };

  const CompanyLinkModel = ({
    open,
    onClose = () => {},
    value,
    onLinkChange = () => {},
  }) => {
    return (
    <div
      className={
        "absolute top-[0] left-0 w-full flex center h-screen bg-slate-200 profile-modal p-7 md:p-10 " +
        (open ? "profile-modal-show " : " ")
      }
    >
      <div className="border relative w-[90%] lg:w-[50%] p-5 md:p-8 bg-gray-100 border-white rounded-lg">
        <FaArrowLeft
          className="absolute text-white w-5 h-5 p-1 top-5 left-4 md: p-1 md:top-8 md:left-5 cursor-pointer bg-gray-600 rounded-full"
          onClick={() => {
            onClose();
          }}
        />

        <h1 className="mb-5 mx-4 ml-5">Add Company Links</h1>

        <Formik
          initialValues={{ links: value }}
          enableReinitialize={true}
          onSubmit={(data, { resetForm }) => {
            onLinkChange(data.links);
            onClose();
          }}
        >
          {({ setFieldValue, resetForm, values }) => (
            <Form>
              <Field name="links">
                {({ field }) => (
                  <div className="flex flex-col">
                    <input
                      type="text"
                      className="border border-gray-300 p-2 rounded-lg font-outfit"
                      placeholder="Enter Company Links (comma-separated)"
                      {...field}
                      value={values.links}
                      onChange={(e) => {
                        setFieldValue("links", e.target.value);
                      }}
                    />
                  </div>
                )}
              </Field>

              <h2 className="text-gray-500 font-extralight text-sm text-end">
                {new String(values.links).length}/200
              </h2>

              <div className="w-full mt-4 center gap-3">
                <button
                  type="submit"
                  className="btn-orange px-3 border py-1 border-transparent tracking-widest"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn-orange-outline px-3 py-1"
                  onClick={() => {
                    onClose();
                    resetForm({ values: value });
                  }}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
  
  const CompanySummaryModel = ({
    open,
    onClose = () => {},
    value,
    onSummaryChange = () => {},
  }) => {
    return (
      <div
        className={
          "absolute top-[0] left-0 w-full flex center h-screen bg-slate-200 profile-modal p-7 md:p-10 " +
          (open ? "profile-modal-show " : " ")
        }
      >
        <div className="border relative w-[90%] lg:w-[50%] p-5 md:p-8 bg-gray-100 border-white rounded-lg">
          <FaArrowLeft
            className="absolute text-white w-5 h-5 p-1 top-5 left-4 md: p-1 md:top-8 md:left-5 cursor-pointer bg-gray-600 rounded-full"
            onClick={() => {
              onClose();
            }}
          />
  
          <h1 className="mb-5 mx-4 ml-5">Add Profile Summary</h1>
  
          <Formik
            initialValues={{ summary: value }}
            enableReinitialize={true}
            onSubmit={(data, { resetForm }) => {
              onSummaryChange(data.summary);
              onClose();
            }}
          >
            {({ setFieldValue, resetForm, values }) => (
              <Form>
                <Field name="summary">
                  {({ field }) => (
                    <TextArea
                      rows={4}
                      allowClear
                      className="!max-h-[600px] font-outfit"
                      placeholder="Enter Profile Summary"
                      maxLength={2000}
                      {...field}
                      value={values.summary}
                      onChange={(e) => field.onChange(e)}
                    />
                  )}
                </Field>
                <h2 className="text-gray-500 font-extralight text-sm text-end">
                  {new String(values.summary).length}/2000
                </h2>
  
                <div className="w-full mt-4 center gap-3">
                  <button
                    type="submit"
                    className="btn-orange px-3 border py-1 border-transparent tracking-widest"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn-orange-outline px-3 py-1"
                    onClick={() => {
                      onClose();
                      resetForm({ values: value });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  };
  
  export const AnimateEnterExit = ({
    children,
    initial = { opacity: 0, scale: 0.8 },
    animate = { opacity: 1, scale: 1 },
    exit = { opacity: 0, scale: 0.8 },
    transition={duration:0.6}
  }) => {
    return (
      <motion.div
        className="w-full h-full absolute top-0 left-0"
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  };