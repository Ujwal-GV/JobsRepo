import React, { useEffect, useState, useContext } from "react";
import MainContext from "../../components/MainContext";
import ProfileAvatar from "../../components/ProfileAvatar";
import InputBox from "../../components/InputBox";
import { MdEmail, MdEdit, MdDelete, MdPerson } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaArrowLeft, FaCircleCheck } from "react-icons/fa6";
import axios from "axios";
import "antd/dist/reset.css";
import { FaPhoneAlt, FaCheckCircle, FaSave, FaLocationArrow, FaFileAlt } from "react-icons/fa";
import { IoIosMale, IoIosFemale, IoMdTransgender } from "react-icons/io";
import { TbMoodEmptyFilled } from "react-icons/tb";
import { Field, Form, Formik } from "formik";
import { BiSolidUser ,BiGroup, BiSolidBadgeCheck, BiKey } from "react-icons/bi";
import { Input } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CustomBreadCrumbs from "../../components/CustomBreadCrumbs";
import { CiEdit, CiHome, CiUser } from "react-icons/ci";
import { FaInstagram, FaFacebook, FaTwitter, FaGlobe } from "react-icons/fa";
import { useJobContext } from '../../contexts/JobContext'
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../Loading";
import toast from "react-hot-toast";
import { useGetProviderProfileData } from "../provider/queries/ProviderProfileQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance, getError } from '../../utils/axiosInstance';
import { urlValidationSchema } from "../../formikYup/ValidationSchema";


const { TextArea } = Input;

const ProviderProfile = () => {
  const navigate = useNavigate();
  const [personalDetailsModelOpen, setpersonalDetailsModelOpen] = useState(false);
  const [summaryModelOpen, setSummaryModelOpen] = useState(false);
  const [companyLinkModel, setCompanyLinkModel] = useState(false);

  const { profileData } = useContext(AuthContext);

  console.log("Provider_Details:", profileData);
  
  useEffect(() => {
    if(profileData!==null){
      setPersonalDetails((prev)=> {
        return {
          company_id: profileData?.company_id || "",
          companyName: profileData?.company_name || "",
          email: profileData?.email || "",
          mobile: profileData?.mobile || "",
          location: profileData?.location || "",
        }
      });

      setCompanySummary(profileData?.description);
      const links = {};
      profileData.company_links.forEach((link, idx) => {
        links[idx] = { title: link.title, url: link.url };
      });
      setCompanyLinksList(links);
    }
  }, [profileData]);

  const [personalDetails, setPersonalDetails] = useState({
    // companyName: profileData?.company_name || "",
    email: profileData?.email || "",
    mobile: profileData?.mobile || "",
    location: profileData?.location || "",
  });

  const [providerProfileImg, setProviderProfileImg] = useState(profileData?.img?.url);
  const [companySummary, setCompanySummary] = useState("");
  const [companyLinksList, setCompanyLinksList] = useState({});
  const [compayLinks, setCompanyLinks] = useState({});

  const handlePersonalDetails = (newDetails) => {
    providerProfilePersonalDetailsUpdateMutation.mutate(newDetails);
  };

  const handleSummaryChange = (newSummary) => {
    companySummaryMutation.mutate(newSummary);
  };

   const freezeBody = () => {
    document.body.classList.add("no-scroll");
  };

  const freeBody = () => {
    document.body.classList.remove("no-scroll");
  };

  const queryClient = useQueryClient();
  const {data,isLoading:profileDataLoading,isFetching} = useGetProviderProfileData();
  console.log(profileDataLoading,isFetching);


  const updateProviderProfile = async (val) => {
    // console.log("Values:", val);
    const data ={"location":val.location,"email":val.email,"mobile":val.mobile}
    // console.log("Data_Update:", data);
    const res = await axiosInstance.put("/provider/update", data);
    // console.log("Response_Data", res.data);
    return res.data;
  };

  const providerProfilePersonalDetailsUpdateMutation = useMutation({
    mutationKey: ["provider_profile_update"],
    mutationFn: updateProviderProfile,
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
      queryClient.invalidateQueries({ queryKey: ["provider_profile"] });
    },
    onError: (error) => {
      const { message } = getError(error);
      console.log(error);
      if (message) {
        toast.error(message);
      } else {
        toast.error("Something Went Wrong");
      }
    },
  });


  const uploadProfilePhoto = async(url)=>{
    const data = {"img":url}
    const res = await axiosInstance.put("/provider/update",data);
    return res.data;  
  }

  const providerProfilePhotoUploadMutation = useMutation({
    mutationKey:["provider_upload_profile"],
    mutationFn:uploadProfilePhoto,
    onSuccess:(val,variables)=>{
       toast.success("Profile Photo Updated Sucessfully");
       queryClient.invalidateQueries({ queryKey: ["provider_profile"] });
      //  console.log(val , variables)
       setProviderProfileImg(variables);
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

  const companyLinksUpdate = async (val) => {
    const data = Object.values(val).map(link => ({ title: link.title, url: link.url }));
    const res = await axiosInstance.put("/provider/update", { company_links: data });
    return res.data;
  }

  const companyLinksMutation = useMutation({
    mutationKey: ['provider_links_update'],
    mutationFn: companyLinksUpdate,
    onSuccess: (val) => {
      toast.success("Company website links updated successfully");
      setCompanyLinkModel(false);
      queryClient.invalidateQueries({ queryKey: ['provider_profile'] });
    },
    onError: (error) => {
      const { message } = getError(error);
      toast.error(message || "Something Went Wrong");
    },
  });

  const handleAddLink = (data) => {
    const updatedLinks = { ...companyLinksList, [Object.keys(companyLinksList).length]: data };
    setCompanyLinksList(updatedLinks);
    companyLinksMutation.mutate(updatedLinks);
    setCompanyLinkModel(false);
  };

  const handleDeleteLink = (link) => {
    const updatedLinks = { ...companyLinksList };
    const index = Object.keys(updatedLinks).find(key => updatedLinks[key].url === link.url);
    if (index) {
      delete updatedLinks[index];
      setCompanyLinksList(updatedLinks);
      companyLinksMutation.mutate(updatedLinks);
      queryClient.invalidateQueries({ queryKey: ['provider_profile'] });
    }
  };

  const companySummaryUpdate = async(val) => {
    const data = {"description": val};
    const res = await axiosInstance.put("/provider/update", data);
    return res.data;
  }

  const companySummaryMutation = useMutation({
    mutationKey: ['provide_summary_update'],
    mutationFn: companySummaryUpdate,
    onSuccess: (val, variables) => {
      toast.success("Company Description Updated Successfully");
      setSummaryModelOpen(false);
      freeBody();
      setCompanySummary(variables);
      queryClient.invalidateQueries[{ queryKey: 'provider_profile' }];
    },
    onError: (error) => {
      const { message } = getError(error);
      console.log(error);
      if (message) {
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  if(profileDataLoading || isFetching)
  {
    return <Loading/>
  }

  return (
    <MainContext>
      <div className="w-full h-screen bg-slate-50 ">
        <div className="w-full h-screen overflow-y-auto relative overflow-x-hidden mx-auto  mt-2 md:max-w-[80%] lg:max-w-[70%] bg-slate-100 pb-5 px-2 md:px-0 font-outfit ">
          {/* BreadCrumbs */}

          <div className="w-full flex center py-3 sticky pt-2   bg-slate-100">
            <CustomBreadCrumbs
              items={[
                {
                  path: "/provider",
                  icon: <CiHome />,
                  title: "Home",
                },
                { title: "Profile", icon: <CiUser /> },
              ]}
            />
          </div>

          {/* Avatar and PersonalDetails */}


          <div className="flex center flex-col w-[95%] md:flex-row md:w-full gap-2 relative top-0 pt-2   h-fit mx-auto">

            <div className="w-[200px] h-[200px] flex center relative rounded-full  bg-white">
              <ProfileAvatar url={providerProfileImg} onChange={(val)=>providerProfilePhotoUploadMutation.mutate(val)} />
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
              <h1 className="flex justify-start text-3xl font-bold items-center gap-1">
                <BiSolidBadgeCheck className="text-orange-600" />
                {personalDetails.companyName || "Company Name"}
              </h1>
              <hr className="m-2" />
              <h1 className="flex justify-start items-center gap-1">
                <BiKey className="text-orange-600" />
                {personalDetails.company_id || "Company ID"}
              </h1>
              <h1 className="flex justify-start items-center gap-1">
                <MdEmail className="text-orange-600" />
                {personalDetails.email || "Email"}
              </h1>
              <h1 className="flex justify-start items-center gap-1">
                {" "}
                <FaPhoneAlt className="text-orange-600" />{" "}
                {personalDetails.mobile || "Mobile"}
              </h1>
              <h1 className="flex justify-start items-center gap-1">
                {" "}
                <FaLocationArrow className="text-orange-600" />{" "}
                {personalDetails.location || "Location"}
              </h1>
            </div>
          </div>

          {/* Other Profile Details */}

          <div className="w-[100%] mx-auto flex flex-wrap center p-1 border-t pt-2  mt-2">
            <DeatilsBadge
              icon={<BiSolidBadgeCheck className="text-green-600" />}
              title="Jobs Posted"
              val={profileData?.job_details?.jobs?.length || 0}
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
                <CompanyInfoField
                  title="Company Link"
                  icon={"Add"}
                  editOnClick={() => {
                    setCompanyLinkModel(true);
                    freezeBody();
                  }}
                >
                  <div className="flex flex-wrap gap-1 w-full pb-2">
                    {/* {console.log("companyLinksList:", companyLinksList)} */}

                    {/* If no links are added */}
                    {Object.keys(companyLinksList).length === 0 ? (
                      <div className="w-full gap-1 center flex">
                        <TbMoodEmptyFilled /> Add Company Links
                      </div>
                    ) : (
                      <div className="w-full h-full bg-white p-2 rounded-lg overflow-hidden text-ellipsis">
                        {/* Map over the company links */}
                        {Object.values(companyLinksList).map((idata, idx) => {
                          // console.log("idata inside map:", idata);

                          return (
                            <div key={idx} className="flex items -center gap-2 mb-2">
                              <CompanyLinksField
                                key={idata.url}
                                companyLinksDetails={{ ...idata }}
                                onDeleteLink={(link) => {
                                  // handleCompanyLinkChange({
                                  //   ...idata,
                                  //   index: idx,
                                  // });
                                  handleDeleteLink(link);
                                  setCompanyLinks(idata);
                                }}
                              >
                                <FaGlobe className="text-gray-500" />
                                <a
                                  href={idata.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500"
                                  key={idata.url}
                                >
                                  {idata.title || idata.url}
                                </a>
                              </CompanyLinksField>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CompanyInfoField>
              </CompanyInputWrapper>

              {/* Company Summary Section */}
              <CompanyInputWrapper>
                <CompanyInfoField
                  title="Company Description"
                  icon={companySummary === "" ? "Add" : "Edit"}
                  editOnClick={() => {
                    setSummaryModelOpen(true);
                    freezeBody();
                  }}
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
                  
          {summaryModelOpen && (
                <AnimateEnterExit transition={{ duration: 0.2 }} position="!fixed">
                <CompanySummaryModel
                    open={summaryModelOpen}
                    onClose={() => {
                      setSummaryModelOpen(false);
                      freeBody();
                    }}
                    value={ companySummary }
                    onSummaryChange={handleSummaryChange}
                />
                </AnimateEnterExit>
            )}

          {companyLinkModel && (
            <AnimateEnterExit transition={{ duration: 0.2 }} position="!fixed">
              <CompanyLinkModel
                open={companyLinkModel}
                onClose={() => {
                  setCompanyLinkModel(false);
                }}
                value={{}}
                addCompanyLinks={handleAddLink}
              />
            </AnimateEnterExit>
          )}
      </AnimatePresence>
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
          "w-[120px] h-[120px] sm:w-[150px] sm:h-[150pxx] relative cursor-pointer  flex-shrink-0 my-1 md:!my-0  center flex gap-1 border-[1px] bg-white rounded-3xl px-3  mx-2 flex-col " +
          (hovered && " !border-orange-600")
        }
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
    companyLinksDetails,
    onDeleteLink = () => {},
  }) => {
    return (
      <div className="w-full h-fit flex justify-between items-center gap-3 bg-white rounded-lg p-2 ps-4 relative">
        <div className="flex flex-row gap-4 items-center">
          <FaGlobe className="text-gray-500" />
          <a
            href={companyLinksDetails.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            {companyLinksDetails.title || companyLinksDetails.url}
          </a>
        </div>

        <div className="flex justify-end">
          <MdDelete
            className="text-gray-800 cursor-pointer"
            onClick={() => onDeleteLink(companyLinksDetails)}
          />
        </div>
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
      email: null,
      mobile: null,
      location: null,
      companyName: null,
      company_id: null,
    },
  }) => {
    return (
      <div
        className={
          "absolute top-[0] left-0 w-full flex center h-full bg-black profile-modal p-7 md:p-10 " +
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
    value = {},
    addCompanyLinks = () => {},
  }) => {
    const [data, setData] = useState(value);
  
    useEffect(() => {
      setData(value);
    }, [value]);
  
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
  
          <h1 className="mb-5 mx-4 ml-5">Add Company Links</h1>
  
          <Formik
            initialValues={data}
            enableReinitialize={true}
            validationSchema={urlValidationSchema}
            onSubmit={(data, { resetForm }) => {
              addCompanyLinks(data);
              onClose();
              resetForm();
            }}
          >
            {({ values, handleChange, errors, touched, setFieldValue, resetForm }) => (
              <Form>
                {/* Company Title */}
                <Field name="title">
                  {({ field }) => (
                    <InputBox
                      animate={false}
                      {...field}
                      value={field.value}
                      placeholder="Link Title"
                      customClass="mt-4"
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  )}
                </Field>
  
                <Field name="url">
                  {({ field }) => (
                    <div>
                      <InputBox
                        type="url"
                        animate={false}
                        {...field}
                        value={field.value}
                        placeholder="Enter the link"
                        customClass="mt-4"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      {errors.url && touched.url && (
                        <div className="text-red-500 font-outfit text-sm mt-1 ml-4">{errors.url}</div>
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
  
          <h1 className="mb-5 mx-4 ml-5">Add Profile Summary</h1>
  
          <Formik
            initialValues={{ description: value }}
            enableReinitialize={true}
            onSubmit={(data, { resetForm }) => {
              onSummaryChange(data.description);
              onClose();
            }}
          >
            {({ setFieldValue, resetForm, values }) => (
              <Form>
                <Field name="description">
                  {({ field }) => (
                    <TextArea
                      variant="borderless"
                      rows={4}
                      allowClear
                      className="!max-h-[600px] font-outfit bg-white"
                      placeholder="Enter Company Description"
                      maxLength={2000}
                      {...field}
                      value={values.description}
                      onChange={(e) => field.onChange(e)}
                    />
                  )}
                </Field>
                <h2 className="text-gray-500 font-extralight text-sm text-end">
                  {new String(values.description).length}/2000
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