import React, { useEffect, useState } from "react";
import MainContext from "../../components/MainContext";
import ProfileAvatar from "../../components/ProfileAvatar";
import InputBox from "../../components/InputBox";
import { MdEmail, MdEdit, MdDelete, MdPerson } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaArrowLeft, FaCircleCheck } from "react-icons/fa6";
import axios from "axios";
import "antd/dist/reset.css";
import { FaPhoneAlt, FaCheckCircle, FaSave, FaLocationArrow } from "react-icons/fa";
import { IoIosMale, IoIosFemale, IoMdTransgender } from "react-icons/io";
import { TbMoodEmptyFilled } from "react-icons/tb";
import { Field, Form, Formik } from "formik";
import { BiSolidUser ,BiGroup, BiSolidBadgeCheck } from "react-icons/bi";
import { Input } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTwitter, FaGlobe } from "react-icons/fa";


const { TextArea } = Input;

const ProviderProfile = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [personalDetailsModelOpen, setpersonalDetailsModelOpen] = useState(false);
  const [summaryModelOpen, setSummaryModelOpen] = useState(false);
  const [companyLinkModel, setCompanyLinkModel] = useState(false);

  const [personalDetails, setPersonalDetails] = useState({
    companyName: "Google",
    fullName: "Ujwal Gowda V",
    email: "ujwalgowda8792@gmail.com",
    mobile: "7483268624",
    location: "Bangalore",
  });

  const [companySummary, setCompanySummary] = useState("");
  const [companyLink, setCompanyLink] = useState({
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",
    });

  const handlePersonalDetails = (val) => {
    setPersonalDetails((prev) => {
      return { ...prev, ...val };
    });
  };

  const handleSummaryChange = (val) => {
    setCompanySummary(val);
  };

  const handleCompanyLinkChange = (updatedLinks) => {
    setCompanyLink(updatedLinks);
  };

  const handleSaveClick = () => {
    setSaved((prev) => !prev);
    navigate(-1);
  };

  const handleBackClick = () => {
    navigate(-1);
  }
  

  return (
    <MainContext>
      <div className="w-full h-screen bg-slate-50 ">
        <div className="w-full h-screen overflow-y-auto relative overflow-x-hidden mx-auto  mt-2 md:max-w-[80%] lg:max-w-[70%] bg-slate-100 pb-5 px-2 md:px-0 font-outfit ">
          {/* Avatar and PersonalDetails */}

          <div className="flex center flex-col w-[95%] z-999 md:flex-row md:w-full gap-2 relative top-0 pt-2   h-fit mx-auto">
            <div className="w-[200px] h-[200px] flex center relative rounded-full  bg-white">
              <ProfileAvatar />
            </div>
            <div className="bg-white w-full md:w-[500px] h-full  p-3 md:p-7 rounded-xl relative">
              <MdEdit
                className="absolute top-2 right-2  cursor-pointer"
                onClick={() => setpersonalDetailsModelOpen(true)}
              />
              <h1 className="flex justify-start text-2xl font-bold items-center gap-1">
                <BiSolidBadgeCheck className="text-orange-600" />
                {personalDetails.companyName}
              </h1>
              <h1 className="flex justify-start items-center gap-1">
                <BiSolidUser className="text-orange-600" />
                {personalDetails.fullName}
              </h1>
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
                {" "}
                <FaLocationArrow className="text-orange-600" />{" "}
                {personalDetails.location}
              </h1>
              <div className="flex flex-center mt-5 m-2 md:mt-5 md:mb-0 gap-3">
                <button
                  className="btn-orange-outline px-3 py-1 flex center gap-1"
                  onClick={handleBackClick}
                >
                  {"Back"}
                </button>
                <button
                    className="btn-orange-outline px-3 py-1 flex center gap-1"
                    onClick={handleSaveClick}
                  >
                    {saved ? (
                      <FaCheckCircle className="text-orange-600" />
                    ) : (
                      <></>
                    )}
                    {saved ? "Saved" : "Save"}
                  </button>
              </div>
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
                    icon={Object.values(companyLink).every((link) => link.trim() === "") ? "Add" : "Edit"}
                    editOnClick={() => setCompanyLinkModel(true)}
                  >
                    <div className="flex flex-wrap gap-1 w-full pb-2">
                      {/* If no links are added */}
                      {Object.values(companyLink).every((link) => link.trim() === "") ? (
                        <div className="w-full gap-1 center flex">
                          <TbMoodEmptyFilled /> Add Company Links
                        </div>
                      ) : (
                        <div className="w-full h-full bg-white p-2 rounded-lg overflow-hidden text-ellipsis">
                          {/* Company Website Link */}
                          {companyLink.website && (
                            <div className="flex items-center gap-2 mb-2">
                              <FaGlobe className="text-gray-500" />
                              <a
                                href={companyLink.website.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500"
                              >
                                {companyLink.website.trim()}
                              </a>
                            </div>
                          )}

                          {/* Instagram Link */}
                          {companyLink.instagram && (
                            <div className="flex items-center gap-2 mb-2">
                              <FaInstagram className="text-pink-500" />
                              <a
                                href={companyLink.instagram.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500"
                              >
                                {companyLink.instagram.trim()}
                              </a>
                            </div>
                          )}

                          {/* Facebook Link */}
                          {companyLink.facebook && (
                            <div className="flex items-center gap-2 mb-2">
                              <FaFacebook className="text-blue-600" />
                              <a
                                href={companyLink.facebook.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500"
                              >
                                {companyLink.facebook.trim()}
                              </a>
                            </div>
                          )}

                          {/* Twitter Link */}
                          {companyLink.twitter && (
                            <div className="flex items-center gap-2">
                              <FaTwitter className="text-blue-400" />
                              <a
                                href={companyLink.twitter.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500"
                              >
                                {companyLink.twitter.trim()}
                              </a>
                            </div>
                          )}
                        </div>
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
                        <div className="w-full h-full bg-white p-2 rounded-lg overflow-hidden text-ellipsis text-justify">
                            {companySummary}
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

                {/* Location with Icon */}
                <Field name="location">
                  {({ field }) => (
                    <InputBox
                      {...field}
                      icon={<FaLocationArrow />} // Icon for mobile
                      placeholder="Enter Location"
                      customClass="mt-4"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e); // Formik's handleChange
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
    value = {
      website: "",
      instagram: "",
      facebook: "",
      twitter: "",
    },
    onLinkChange = () => {},
  }) => {
    return (
      <div
        className={
          "absolute top-0 left-0 w-full flex center h-screen bg-slate-200 profile-modal p-7 md:p-10 " +
          (open ? "profile-modal-show " : "")
        }
      >
        <div className="border relative w-[90%] lg:w-[50%] p-5 md:p-8 bg-gray-100 border-white rounded-lg">
          <FaArrowLeft
            className="absolute text-white w-5 h-5 p-1 top-5 left-4 md:p-1 md:top-8 md:left-5 cursor-pointer bg-gray-600 rounded-full"
            onClick={onClose}
          />
  
          <h1 className="mb-5 mx-4 ml-5">Add Company Links</h1>
  
          <Formik
            initialValues={value}
            enableReinitialize={true}
            onSubmit={(data, { resetForm }) => {
              onLinkChange(data); // Pass the form data back when submitted
              onClose();
              resetForm();
            }}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                {/* Company Website */}
                <div className="flex items-center mb-4">
                  <InputBox
                    name="website"
                    type="url"
                    icon={<FaGlobe className="text-gray-500 w-5 h-5 mr-2" />}
                    placeholder="Company Website URL"
                    value={values.website}
                    onChange={handleChange}
                  />
                </div>
  
                {/* Instagram Link */}
                <div className="flex items-center mb-4">
                  <InputBox
                    name="instagram"
                    type="url"
                    icon={<FaInstagram className="text-pink-500 w-5 h-5 mr-2" />}
                    placeholder="Instagram Profile URL"
                    value={values.instagram}
                    onChange={handleChange}
                  />
                </div>
  
                {/* Facebook Link */}
                <div className="flex items-center mb-4">
                  <InputBox
                    name="facebook"
                    type="url"
                    icon={<FaFacebook className="text-blue-600 w-5 h-5 mr-2" />}
                    placeholder="Facebook Profile URL"
                    value={values.facebook}
                    onChange={handleChange}
                  />
                </div>
  
                {/* Twitter Link */}
                <div className="flex items-center mb-4">
                  <InputBox
                    name="twitter"
                    type="url"
                    icon={<FaTwitter className="text-blue-400 w-5 h-5 mr-2" />}
                    placeholder="Twitter Profile URL"
                    value={values.twitter}
                    onChange={handleChange}
                  />
                </div>
  
                {/* Action Buttons */}
                <div className="w-full mt-4 flex justify-end gap-3">
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