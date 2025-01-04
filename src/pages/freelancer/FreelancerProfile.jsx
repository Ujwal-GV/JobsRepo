import React, { useEffect, useState, useContext } from "react";
import MainContext from "../../components/MainContext";
import ProfileAvatar from "../../components/ProfileAvatar";
import InputBox from "../../components/InputBox";
import { MdEmail, MdEdit, MdDelete, MdPerson } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaArrowLeft, FaCircleCheck } from "react-icons/fa6";
import axios from "axios";
import "antd/dist/reset.css";
import { FaPhoneAlt } from "react-icons/fa";
import { Field, Form, Formik } from "formik";
import { BiSolidUser ,BiGroup, BiSolidBadgeCheck, BiKey } from "react-icons/bi";
import { Input, Select } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CustomBreadCrumbs from "../../components/CustomBreadCrumbs";
import { CiEdit, CiHome, CiUser } from "react-icons/ci";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../Loading";
import toast from "react-hot-toast";
import { useGetFreelancerProfileData } from "../freelancer/queries/FreelancerProfileQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance, getError } from '../../utils/axiosInstance';
import SomethingWentWrong from "../../components/SomethingWentWrong";
import { documentValidationSchema, mobileValidation } from "../../formikYup/ValidationSchema";
import { TbMoodEmptyFilled } from "react-icons/tb";


const { TextArea } = Input;

const FreelancerProfile = () => {
  const navigate = useNavigate();
  const [personalDetailsModelOpen, setpersonalDetailsModelOpen] = useState(false);

  const { profileData, setProfileData } = useContext(AuthContext);
  const [freelancerId, setFreelancerId] = useState(null);
  const [documentUploadModalOpen, setDocumentUploadModalOpen] = useState(false);
    
  useEffect(() => {
    if(profileData!==null){
      setPersonalDetails((prev)=> {
        return {
          freelancer_id: profileData?.freelancer_id || "",
          companyName: profileData?.name || "",
          email: profileData?.email || "",
          mobile: profileData?.mobile || "",
          name: profileData?.name,
        }
      });
      setFreelancerId(profileData?.freelancer_id);
      setFreelancerProfileImg(profileData?.img);
      setDocumentDetails({
        docType: profileData?.verifyDocuments?.docType,
        url: profileData?.verifyDocuments?.url,
      });
    }
  }, [profileData]);

  const [personalDetails, setPersonalDetails] = useState({
    name: profileData?.name || "",
    email: profileData?.email || "",
    mobile: profileData?.mobile || "",
    freelancer_id: profileData?.freelancer_id || "",
    companyName: profileData?.name || "",
  });

  const [freelancerProfileImg, setFreelancerProfileImg] = useState("");
  const [documentDetails, setDocumentDetails] = useState({});

  const handlePersonalDetails = (newDetails) => {
    freelancerProfilePersonalDetailsUpdateMutation.mutate(newDetails);
  };

   const freezeBody = () => {
    document.body.classList.add("no-scroll");
  };

  const freeBody = () => {
    document.body.classList.remove("no-scroll");
  };

  const queryClient = useQueryClient();
  const {
    data,
    isLoading:profileDataLoading,
    isFetching,
    isSuccess,
    isError,error
  } = useGetFreelancerProfileData();
  // console.log(profileDataLoading,isFetching);


  const updateFreelancerProfile = async (val) => {
    // console.log("Values:", val);
    const data ={"email":val.email,"mobile":val.mobile}
    // console.log("Data_Update:", data);
    const res = await axiosInstance.put("/freelancer/update", data);
    // console.log("Response_Data", res.data);
    return res.data;
  };

  const freelancerProfilePersonalDetailsUpdateMutation = useMutation({
    mutationKey: ["freelancer_profile_update"],
    mutationFn: updateFreelancerProfile,
    onSuccess: (val, variables) => {
      toast.success("Profile Updated");
      setpersonalDetailsModelOpen(false);
      freeBody();
      setPersonalDetails((prev) => {
        return {
          ...prev,
          ...variables
        };
      });
      setProfileData(val);
      queryClient.invalidateQueries({ queryKey: ["freelancer_profile"] });
    },
    onError: (error) => {
      const { message } = getError(error);
      // console.log(error);
      if (message) {
        toast.error(message);
      } else {
        toast.error("Something Went Wrong");
      }
    },
  });

  const uploadDocument = async (documentData) => {
    const formData = new FormData();
    formData.append("docType", documentData.docType);
    formData.append("doc", documentData.file);
    formData.append("userType", profileData?.auth_details?.role);
    formData.append("userId", profileData?.freelancer_id);
  
    try {
      const res = await axiosInstance.post("/uploader/verify/doc", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  };

  const documentUploadMutation = useMutation({
    mutationKey: ["freelancer_document_upload"],
    mutationFn: uploadDocument,
    onSuccess: (val) => {
      toast.success("Document Uploaded Successfully");
      setDocumentUploadModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["freelancer-profile"] });
  },
    onError: (error) => {
      const { message } = getError(error);
      if (message) {
        toast.error(message);
      } else {
        toast.error("Something Went Wrong");
      }
    },
  });


  const uploadProfilePhoto = async(url)=>{
    const data = {"img":url}
    const res = await axiosInstance.put("/freelancer/update",data);
    return res.data;  
  }

  const freelancerPhotoUploadMutation = useMutation({
    mutationKey:["freelancer_upload_profile"],
    mutationFn:uploadProfilePhoto,
    onSuccess:(val,variables)=>{
       toast.success("Profile Photo Updated Sucessfully");
       setProfileData(val);
       queryClient.invalidateQueries({ queryKey: ["freelancer_profile"] });
      //  console.log(val , variables)
       setFreelancerProfileImg(variables);
    },
    onError:(error)=>{
      const {message}= getError(error)
      if(message)
      {
        toast.error(message)
      }else{
        toast.error("Something Went Wrong")
      }
    }
  });

  if(profileDataLoading || isFetching)
  {
    return <Loading/>
  }

  if(isError || error) {
    <SomethingWentWrong />
  }

  if(isSuccess) {
    return (
      <MainContext>
        <div className="w-full h-screen bg-slate-50 ">
          <div className="w-full h-screen overflow-y-auto relative overflow-x-hidden mx-auto  mt-2 md:max-w-[80%] lg:max-w-[70%] bg-slate-100 pb-5 px-2 md:px-0 font-outfit custom-scroll">
            {/* BreadCrumbs */}
  
            <div className="w-full flex center py-3 sticky pt-2  mt-4 bg-slate-100">
              <CustomBreadCrumbs
                items={[
                  {
                    path: "/freelancer",
                    icon: <CiHome />,
                    title: "Home",
                  },
                  { title: "Profile", icon: <CiUser /> },
                ]}
              />
            </div>
  
            {/* Avatar and PersonalDetails */}
  
  
            <div className="flex flex-col center w-[95%] md:w-full gap-4 relative my-auto pt-2 h-fit mx-auto">
  
              <div className="w-[200px] h-[200px] mt-5 flex relative rounded-full bg-white">
                <ProfileAvatar 
                  url={freelancerProfileImg} 
                  onChange={(val)=>freelancerPhotoUploadMutation.mutate(val)} 
                />
              </div>
  
              {/* Profile Application Deatils */}
  
              <div className="bg-white w-full md:w-[500px] h-full  p-3 md:p-5 rounded-xl relative">
                <MdEdit
                  className="absolute top-2 right-2  cursor-pointer" 
                  onClick={() => { 
                    setpersonalDetailsModelOpen(true);
                    freezeBody();
                  }}
                />
                <h1 className="flex justify-start text-2xl lg:text-3xl md:text-3xl font-bold items-center gap-1">
                  <BiSolidBadgeCheck className="text-orange-600" />
                  {personalDetails.name || "Freelancer Name"}
                </h1>
                <hr className="m-2" />
                <h1 className="flex justify-start items-center text-sm lg:text-md gap-1">
                  <BiKey className="text-orange-600" />
                  {personalDetails.freelancer_id || "Freelancer ID"}
                </h1>
                <h1 className="flex justify-start items-center text-sm lg:text-md gap-1">
                  <MdEmail className="text-orange-600" />
                  {personalDetails.email || "Email"}
                </h1>
                <h1 className="flex justify-start items-center text-sm lg:text-md gap-1">
                  {" "}
                  <FaPhoneAlt className="text-orange-600" />{" "}
                  {personalDetails.mobile || "Mobile"}
                </h1>
              </div>

              <div className="w-[100%] mx-auto flex flex-wrap center p-1 border-t pt-2  mt-2">
              <DeatilsBadge
                icon={<BiSolidBadgeCheck className="text-green-600" />}
                title="Projects Posted"
                val={profileData?.project_details?.projects?.length || 0}
                onClick={() => navigate(`/freelancer/projects-posted/${personalDetails?.freelancer_id}`)}
              />
            </div>

            <div className="w-full  h-50 max-w-[90%] md:w-full mx-auto mt-4 flex flex-col lg:flex-row gap-2">
              <div className="part-1 flex-1">
              <FreelancerInputWrapper>
                  <FreelancerInfoField
                    title="Document Submission"
                    icon={documentDetails?.docType === undefined || null || "" ? "Add" : ""}
                    editOnClick={() => {
                      setDocumentUploadModalOpen(true);
                      freezeBody();
                    }}
                  >
                    <DocumentField
                      documentDetails={documentDetails}
                      onAddDocument={() => {
                        setDocumentUploadModalOpen(true);
                        freezeBody();
                      }}
                      hasDocuments={!!documentDetails?.url}
                    />
                  </FreelancerInfoField>
                </FreelancerInputWrapper>
              </div>
            </div>

            </div>
          </div>
        </div>
  
          {/* Models */}
          <AnimatePresence>
              {personalDetailsModelOpen && (
              <AnimateEnterExit transition={{ duration: 0.2 }}>
                <ProfilePersonalDetailsModal
                  open={personalDetailsModelOpen}
                  onClose={() => {
                    setpersonalDetailsModelOpen(false);
                    freeBody();
                  }}
                  value={personalDetails}
                  onChange={handlePersonalDetails}
                />
            </AnimateEnterExit>
              )}

              {documentUploadModalOpen && (
                <AnimateEnterExit transition={{ duration: 0.2 }} position="!fixed">
                  <CompanyDocumentModal
                    open={documentUploadModalOpen}
                    onClose={() => {
                      setDocumentUploadModalOpen(false);
                    }}
                    value={{}}
                    addDocuments={(data) => {
                      documentUploadMutation.mutate(data);
                    }}
                  />
                </AnimateEnterExit>
              )}
        </AnimatePresence>
      </MainContext>
    );
  }
};

export default FreelancerProfile;

const FreelancerInputWrapper = ({ children }) => (
  <div className="flex flex-col mt-3 center w-full">
    <div className="w-full ">{children}</div>
  </div>
);

const FreelancerInfoField = ({
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

const DocumentField = ({
    documentDetails,
    onAddDocument = () => {},
    hasDocuments,
  }) => {
    return (
      <div className="w-full h-fit flex justify-between lg:items-center gap-3 bg-white rounded-lg lg:p-2 p-1 relative">
        {hasDocuments ? (
          <>
            <span className="justify-start text-xs">Document Uploaded</span>
            <div className="flex flex-col lg:flex-row lg:gap-4 gap-2 items-center">
              <span className="font-black">{documentDetails?.docType}</span>
                <a
                  href={documentDetails?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-600 px-1 py-1 text-xs lg:px-2 lg:py-1 text-white hover:bg-orange-700 lg:text-sm rounded-full"
                >
                  View Document
                </a>
            </div>
          </>
        ) : (
            <div className="w-full gap-1 center flex">
              <TbMoodEmptyFilled /> Upload document for profile verification
            </div>
        )}
      </div>
    );
  };

  const DeatilsBadge = ({ 
    icon = "", 
    title = "", 
    val = "",
    onClick = ()=> {}
  }) => {
    const [hovered, setHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={
          "w-[120px] h-[120px] sm:w-[150px] sm:h-[150pxx] relative cursor-pointer  flex-shrink-0 my-1 md:!my-0  center flex gap-1 border-[1px] bg-white rounded-3xl px-3  mx-2 flex-col " +
          (hovered && " !border-orange-600")
        }
        onClick={onClick}
      >
        <span className="text-sm w-full  text-center flex center ">
          {icon}
          {title}
        </span>
        <span className=" bg-slate-200 rounded-full ml-1 text-sm  w-7 h-7 center">
          {val >= 100 ? "99+" : val}
        </span>
      </div>
    );
  };
  
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
  
  const ProfilePersonalDetailsModal = ({
    open,
    onClose = () => {},
    onChange = () => {},
    value = {
      email: null,
      mobile: null,
      name: null,
      freelancer_id: null,
    },
  }) => {
    return (
      <div
        className={
          "absolute top-[0] left-0 w-full flex center h-full bg-white profile-modal p-7 md:p-10 " +
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
          <h1 className="mb-5 mx-4 ml-5">Freelancer Details</h1>
  
          <Formik
            initialValues={value}
            validationSchema={mobileValidation}
            enableReinitialize={true} // Ensure form resets when modal opens again with new values
            onSubmit={(data, { resetForm }) => {
              onChange(data);
              onClose();
              // alert(JSON.stringify(data))
              resetForm();
            }}
          >
            {({ errors, touched, setFieldValue, resetForm, values }) => (
              <Form>
                {/* Email with Icon */}
                <Field name="email">
                  {({ field }) => (
                    <InputBox
                      {...field}
                      disable={true}
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
                  {({ field, form }) => (
                    <>
                      <InputBox
                        {...field}
                        icon={<FaPhoneAlt />} // Icon for mobile
                        placeholder="Enter Mobile"
                        customClass="mt-4"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,10}$/.test(value)) {
                            field.onChange(e); // Formik's handleChange
                          }
                        }}
                        maxLength={10}
                      />
                      {errors.mobile && touched.mobile && (
                        <div className="mt-1 text-[0.7rem] text-red-500">{errors.mobile}</div>
                      )}
                    </>
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

  const ConfirmationModal = ({ open, onConfirm, onCancel, message }) => {
    return (
        open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg mx-2">
                <h2 className="text-md font-semibold mb-4">Confirm Action</h2>
                <p className="mb-4 text-xs lg:text-sm md:text-sm">{message}</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={onConfirm}
                    className="btn-orange px-3 border py-1 border-transparent text-xs lg:text-sm md:text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={onCancel}
                    className="btn-orange-outline px-3 py-1 text-xs lg:text-sm md:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
        )
    );
  };

  const CompanyDocumentModal = ({
    open,
    onClose = () => {},
    value = {},
    addDocuments = () => {},
  }) => {
    const [data, setData] = useState(value);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [tempValues, setTempValues] = useState(null);
  
    useEffect(() => {
      setData(value);
    }, [value]);
  
    const handleSubmit = (values) => {      
      if (values.documentType === "") {
        toast.error("Please select a valid document type");
        return;
      }
      setTempValues(values);
      setIsConfirmModalOpen(true);
    };
  
    const handleConfirm = () => {
      const documentData = {
        docType: tempValues.documentType,
        file: tempValues.documentFile,
      };
      addDocuments(documentData);
      setIsConfirmModalOpen(false);
      onClose();
    };
  
    const handleCancel = () => {
      setIsConfirmModalOpen(false);
    };
  
    return (
      <div
        className={
          "absolute top-0 left-0 w-full flex center h-full bg-slate-50 md:bg-slate-100 profile-modal p-4 md:p-10 " +
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
  
          <h1 className="mb-5 mx-4 ml-5">Upload Document</h1>
  
          <Formik
            initialValues={{ documentType: "Select Document", documentFile: "" }}
            enableReinitialize={true}
            validationSchema={documentValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched, resetForm }) => (
              <Form>
                {/* Document Type */}
                <Field name="documentType">
                  {({ field }) => (
                    <div className="mb-4">
                      <label className="block text-gray-700 ml-1 mb-2">Document Type</label>
                      <Select
                        {...field}
                        value={field.value}
                        onChange={(value) => setFieldValue("documentType", value)}
                        className="w-full custom-dropdown-arrow"
                        placeholder="Select document type"
                        options={[
                          { value: "AADHAAR", label: "AADHAAR" },
                          { value: "GST INVOICE", label: "GST INVOICE" },
                          { value: "PAN", label: "PAN" },
                          { value: "OTHER", label: "OTHER" },
                        ]}
                      />
                      {errors.documentType && touched.documentType && (
                        <div className="text-red-500 font-outfit text-sm mt-1">
                          {errors.documentType}
                        </div>
                      )}
                    </div>
                  )}
                </Field>
  
                {/* File Upload */}
                {/* <Field name="documentFile">
                  {({ field }) => (
                    <div className="mb-4">
                      <label className="block text-gray-700 ml-1 mb-2">Upload File</label>
                      <input
                        type="file"
                        onChange={(e) =>
                          setFieldValue("documentFile", e.target.files[0])
                        }
                        className="w-full"
                      />
                      {errors.documentFile && touched.documentFile && (
                        <div className="text-red-500 font-outfit text-sm mt-1">
                          {errors.documentFile}
                        </div>
                      )}
                    </div>
                  )}
                </Field> */}

              <Field name="documentFile">
                {({ field }) => (
                  <div className="mb-4">
                    <label className="block text-gray-700 ml-1 mb-2">Upload File</label>
                    <div
                      className={`relative w-full border rounded-md p-1 bg-white flex justify-between items-center cursor-pointer ${
                        errors.documentFile && touched.documentFile ? "border-red-500" : "border-gray-300"
                      }`}
                      onClick={() => document.getElementById("file-input").click()}
                    >
                      <span className="text-gray-700 text-sm ml-2">
                        {field.value?.name || "Select a file"}
                      </span>
                      <button
                        type="button"
                        className="bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-300 text-sm"
                      >
                        Browse
                      </button>
                    </div>
                    <input
                      id="file-input"
                      type="file"
                      onChange={(e) => setFieldValue("documentFile", e.target.files[0])}
                      className="hidden"
                    />
                    {errors.documentFile && touched.documentFile && (
                      <div className="text-red-500 font-outfit text-sm mt-1">
                        {errors.documentFile}
                      </div>
                    )}
                  </div>
                )}
              </Field>
  
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
                      resetForm({ values: value });
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
  
        {/* Confirmation Modal */}
        <ConfirmationModal
          open={isConfirmModalOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          message="Are you sure you want to upload this document? This action cannot be undone."
        />
      </div>
    );
  };
  
  export const AnimateEnterExit = ({
    children,
    initial = { opacity: 0, scale: 0.8 },
    animate = { opacity: 1, scale: 1 },
    exit = { opacity: 0, scale: 0.8 },
    transition = { duration: 0.6 },
  }) => {
    return (
      <motion.div
        className="w-full h-full absolute top-0 left-0 font-outfit"
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  };