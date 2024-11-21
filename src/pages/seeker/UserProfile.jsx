import React, { useContext, useEffect, useRef, useState } from "react";
import MainContext from "../../components/MainContext";
import ProfileAvatar from "../../components/ProfileAvatar";
import InputBox from "../../components/InputBox";
import { MdEmail, MdEdit, MdDelete, MdPerson } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { skillsData } from "../../../assets/dummyDatas/Data";
import { AutoComplete, DatePicker, message, Select, Spin } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { FaPhoneAlt, FaSave } from "react-icons/fa";
import { IoIosMale, IoIosFemale, IoMdTransgender } from "react-icons/io";
import { TbMoodEmptyFilled } from "react-icons/tb";
import { Field, Form, Formik } from "formik";
import { CiEdit, CiHome, CiUser } from "react-icons/ci";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { AiFillProject } from "react-icons/ai";
import { Input } from "antd";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { AnimatePresence, motion } from "framer-motion";
import CustomBreadCrumbs from "../../components/CustomBreadCrumbs";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import { HiBadgeCheck } from "react-icons/hi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance, getError } from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../Loading";
import { useGetProfileData } from "./queries/ProfileQuery";
import { LuLoader2 } from "react-icons/lu";
import { HiOutlineEye } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { userPersonalDetailsSchema } from "../../formikYup/ValidationSchema";
import SomethingWentWrong from "../../components/SomethingWentWrong";

const { TextArea } = Input;

const UserProfile = () => {
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [educationModalOpen, setEducationModalOpen] = useState(false);
  const [personalDetailsModalOpen, setPersonalDetailsModalOpen] =
    useState(false);
  const [intershipModalOpen, setInternShipModalOpen] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  const navigate = useNavigate();

  //Auth Context

  const { profileData  , setProfileData} = useContext(AuthContext);

  useEffect(() => {
    if (profileData !== null) {
      setPersonalDetails((prev) => {
        return {
          fullName: profileData?.name || "",
          email: profileData?.email || "",
          mobile: profileData?.mobile || "",
          gender: profileData?.profile_details?.gender || "",
        };
      });

      setProfileImg(profileData?.profile_details?.profileImg);
      setProfileSummary(profileData?.profile_details?.summary);
      setProfileSkills(
        profileData?.profile_details?.skills?.map((d) => {
          return { value: d, label: d };
        })
      );
      setEducationDetails((prev) => {
        return {
          qualification: profileData?.education_details?.qualification,
          college: profileData?.education_details?.institute_name,
          percentage: profileData?.education_details?.percentage,
          passedYear: profileData?.education_details?.yearOfPassout,
          specification: profileData?.education_details?.specification,
        };
      });

      const IntershipDetails = {};

      profileData?.internship_details?.forEach((d, idx) => {
        IntershipDetails[idx] = {
          company: d.company_name,
          project: d.project,
          description: d.project_description,
          startDate: d.start_month,
          endDate: d.end_month,
        };
      });
      setListOfIntership((prev) => {
        return { ...IntershipDetails };
      });
    }
  }, [profileData]);

  const [profileSkills, setProfileSkills] = useState([]);

  const [profileEducationDetails, setEducationDetails] = useState({
    qualification: null,
    specification: null,
    college: null,
    percentage: null,
    passedYear: null,
  });

  const [personalDetails, setPersonalDetails] = useState({
    fullName: profileData?.name || "",
    email: profileData?.email || "",
    mobile: profileData?.mobile || "",
    gender: profileData?.profile_details?.gender || "",
  });

  const [profileImg, setProfileImg] = useState("");

  const [listOfIntership, setListOfIntership] = useState({});
  const [intershipDetails, setIntershipDetails] = useState({});

  const [profileSummary, setProfileSummary] = useState("");

  const handleSkillsChange = (val) => {
    profileSkillsMutation.mutate(val);
  };

  const handleEducatioDetails = (val) => {
    profileEducationMutation.mutate(val);
  };

  const handlePersonalDetails = (val) => {
    profilePersonalDetailsUpdateMutation.mutate(val);
  };

  const handleIntershipDetails = (val) => {
    setIntershipDetails((prev) => {
      return { ...val };
    });
  };

  const addIntershipDataToList = (val = {}, modify = false) => {
    let data = {};
    if (!modify) {
      const index = Object.keys(listOfIntership).length;
      const newData = { [`${index}`]: { ...val } };
      data = { ...data, ...listOfIntership, ...newData };
    } else {
      data = { ...data, ...listOfIntership, ...val };
    }
    profileIntershipMutation.mutate(data);
  };

  const deleteIntershipDataFromList = (removedIndex = -1) => {
    if (
      removedIndex !== -1 &&
      removedIndex + 1 <= Object.values(listOfIntership).length
    ) {
      const removedData = {};
      let i = 0;
      Object.keys(listOfIntership).forEach((d, idx) => {
        if (idx !== removedIndex) {
          removedData[i++] = listOfIntership[idx];
        }
      });
      profileIntershipMutation.mutate(removedData);
    }
  };

  const handleSummaryChange = (val) => {
    profileSummaryMutation.mutate(val);
  };

  //  Removes Scroll Behaviour of the body
  const freezeBody = () => {
    document.body.classList.add("no-scroll");
  };

  const freeBody = () => {
    document.body.classList.remove("no-scroll");
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries(["profile"]);
  }, []);

  const {
    data,
    isLoading: profileDataLoading,
    isFetching,
    isSuccess,
    isError,error
  } = useGetProfileData();

  const updatePersonalDetailsProfile = async (val) => {
    const data = {
      name: val.fullName,
      "profile_details.gender": val.gender,
      email: val.email,
      mobile: val.mobile,
    };
    const res = await axiosInstance.put("/user/update", data);
    return res.data;
  };

  const profilePersonalDetailsUpdateMutation = useMutation({
    mutationKey: ["profile_update"],
    mutationFn: updatePersonalDetailsProfile,
    onSuccess: (val, variables) => {
      toast.success("Profile Updated");
      setPersonalDetailsModalOpen(false);
      freeBody();
      setPersonalDetails((prev) => {
        return {
          ...prev,
          ...variables,
        };
      });
      setProfileData(val)
      queryClient.invalidateQueries({ queryKey: ["profile"] });
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

  const uploadProfilePhoto = async (url) => {
    const data = { "profile_details.profileImg": url };
    const res = await axiosInstance.put("/user/update", data);
    return res.data;
  };

  const profilePhotoUploadMutation = useMutation({
    mutationKey: ["upload_profile"],
    mutationFn: uploadProfilePhoto,
    onSuccess: (val, variables) => {
      toast.success("Profile Photo Updated Sucessfully");
      setProfileData(val)
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setProfileImg(variables);
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

  const profileSummaryUpdate = async (val) => {
    const data = { "profile_details.summary": val };
    const res = await axiosInstance.put("/user/update", data);
    return res.data;
  };

  const profileSummaryMutation = useMutation({
    mutationKey: ["profile_update_summary"],
    mutationFn: profileSummaryUpdate,
    onSuccess: (val, variables) => {
      toast.success("Profile Summary Updated");
      setSummaryModalOpen(false);
      freeBody();
      setProfileSummary(variables);
      setProfileData(val)
      queryClient.invalidateQueries({ queryKey: ["profile"] });
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

  const profileSkillsUpdate = async (val) => {
    const data = [];
    for (let d of val) {
      data.push(d["label"]);
    }

    const res = await axiosInstance.put("/user/update", {
      "profile_details.skills": data,
    });
    return res.data;
  };

  const profileSkillsMutation = useMutation({
    mutationKey: ["profile_update_skills"],
    mutationFn: profileSkillsUpdate,
    onSuccess: (val, variables) => {
      toast.success("Skills Updated");
      setSkillModalOpen(false);
      freeBody();
      setProfileSkills((prev) => [...variables]);
      setProfileData(val)
      queryClient.invalidateQueries({ queryKey: ["profile"] });
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

  const profileEducationUpdate = async (val) => {
    const data = {
      "education_details.qualification": val.qualification,
      "education_details.specification": val.specification,
      "education_details.institute_name": val.college,
      "education_details.percentage": val.percentage,
      "education_details.yearOfPassout": val.passedYear,
    };
    const res = await axiosInstance.put("/user/update", data);
    return res.data;
  };

  const profileEducationMutation = useMutation({
    mutationKey: ["profile_update_education"],
    mutationFn: profileEducationUpdate,
    onSuccess: (val, variables) => {
      toast.success("Profile Updated");
      setEducationModalOpen(false);
      freeBody();
      setEducationDetails((prev) => {
        return { ...prev, variables };
      });
      setProfileData(val)
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
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

  const profileInternshipUpdate = async (val) => {
    const data = [];

    const intershipData = Object.values(val);

    intershipData.forEach((d) => {
      data.push({
        company_name: d.company,
        project: d.project,
        project_description: d.description,
        start_month: d.startDate,
        end_month: d.endDate,
      });
    });

    const res = await axiosInstance.put("/user/update", {
      internship_details: data,
    });
    return res.data;
  };

  const profileIntershipMutation = useMutation({
    mutationKey: ["profile_update_internship"],
    mutationFn: profileInternshipUpdate,
    onSuccess: (val, variables) => {
      toast.success("Profile Updated");
      setInternShipModalOpen(false);
      freeBody();
      setListOfIntership((prev) => {
        return { ...prev, ...variables };
      });
      setProfileData(val)
      queryClient.invalidateQueries({ queryKey: ["profile"] });
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

  if (profileDataLoading) {
    return <Loading />;
  }

  if(isError || error)
  {
    return <SomethingWentWrong/>
  }

  if(isSuccess)
  {
    return (
      <MainContext>
        <div className="w-full min-h-screen bg-slate-50 p-5">
          <div className="w-full min-h-screen  relative overflow-x-hidden mx-auto  mt-2 md:max-w-[80%] lg:max-w-[70%] bg-slate-100 pb-5 px-2 md:px-0 font-outfit ">
            {/* BreadCrumbs */}
  
            <div className="w-full flex center py-3 pt-2   bg-slate-100">
              <CustomBreadCrumbs
                items={[
                  {
                    path: "/",
                    icon: <CiHome />,
                    title: "Home",
                  },
                  { title: "Profile", icon: <CiUser /> },
                ]}
              />
            </div>
  
            {/* Avatar and PersonalDetails */}
            <div className="flex center flex-col w-[95%] md:flex-row md:w-full gap-2  h-fit mx-auto">
              <div className="w-[200px] h-[200px] flex center relative rounded-full  bg-white">
                <ProfileAvatar
                  url={profileImg}
                  onChange={(val) => profilePhotoUploadMutation.mutate(val)}
                />
              </div>
  
              {/* Profile Application Deatils */}
  
              <div className="bg-white w-full md:w-[500px] h-full  p-3 md:p-7 rounded-xl relative">
                <MdEdit
                  className="absolute top-2 right-2  cursor-pointer"
                  onClick={() => {
                    setPersonalDetailsModalOpen(true);
                    freezeBody();
                  }}
                />
                <h1>{personalDetails.fullName}</h1>
                <h1 className="flex justify-start items-center gap-1">
                  <MdEmail className="text-orange-600" />
                  {personalDetails.email}
                </h1>
                <h1 className="flex justify-start items-center gap-1">
                  <FaPhoneAlt className="text-orange-600" />
                  {personalDetails.mobile || "Mobile"}
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
  
            <div className="w-[100%]   mx-auto flex flex-wrap center p-1 border-t pt-2  mt-2">
              <DeatilsBadge
                icon={<BiSolidBadgeCheck className="text-green-600" />}
                title="Jobs Applied"
                val={profileData?.application_applied_info?.jobs?.length || 0}
                onClick={() => navigate("/user/applied-job-list")}
              />
              <DeatilsBadge
                icon={<FaSave className=" text-orange-600" />}
                title="Saved"
                val={profileData?.saved_info?.jobs?.length}
                onClick={() => navigate("/user/saved-job-list")}
              />
              <DeatilsBadge
                icon={<AiFillProject className="text-green-600 rotate-180" />}
                title="Projects Applied"
                val={profileData?.application_applied_info?.projects?.length || 0}
              />
               <DeatilsBadge
                icon={<AiFillProject className="text-orange-600 rotate-180" />}
                title="Following"
                val={profileData?.follwing?.length || 0}
                onClick={()=>navigate("/user/company/following")}
              />
            </div>
            <div className="w-full   max-w-[90%] md:w-full mx-auto mt-4 flex flex-col  gap-2">
              {/* Section 1 */}
  
              {/* <div className="part-1 flex-1"> */}
              <ProfileInputWrapper>
                <ProfileInfoField
                  title="Profile Summary"
                  icon={profileSummary?.trim() === "" ? "Add" : "Edit"}
                  editOnClick={() => {
                    setSummaryModalOpen(true);
                    freezeBody();
                  }}
                >
                  <div className="flex flex-wrap gap-1 w-full pb-2 ">
                    {!profileSummary ? (
                      <div className="w-full gap-1 center flex">
                        <TbMoodEmptyFilled /> Add Summary About Your Profile
                      </div>
                    ) : (
                      <>
                        <div className="w-full h-full text-wrap bg-white p-2 rounded-lg  break-words text-gray-500 font-roboto">
                          {profileSummary}
                        </div>
                      </>
                    )}
                  </div>
                </ProfileInfoField>
              </ProfileInputWrapper>
  
              <ProfileInputWrapper>
                <ProfileInfoField
                  title="Skills"
                  editOnClick={() => {
                    setSkillModalOpen(true);
                    freezeBody();
                  }}
                >
                  <div className="flex flex-wrap gap-1 w-full md:max-h-[100px] custom-scroll-nowidth overflow-auto">
                    {profileSkills.length === 0 ? (
                      <div className="w-full gap-1 center flex">
                        <TbMoodEmptyFilled /> No Skills Selected
                      </div>
                    ) : (
                      <>
                        {profileSkills.map((skill) => (
                          <Tag val={skill.value} key={skill.label} />
                        ))}
                      </>
                    )}
                  </div>
                </ProfileInfoField>
              </ProfileInputWrapper>
  
              <ProfileInputWrapper>
                <ProfileInfoField
                  title="Education"
                  icon={
                    Object.values(profileEducationDetails).some(
                      (s) => s !== null && s !== ""
                    )
                      ? "Edit"
                      : "Add"
                  }
                  editOnClick={() => {
                    setEducationModalOpen(true);
                    freezeBody();
                  }}
                >
                  <div className="w-full md:min-h-[100px] flex center">
                    {Object.values(profileEducationDetails).some(
                      (s) => s !== null && s !== ""
                    ) ? (
                      <EducationCard
                        profileEducationDetails={profileEducationDetails}
                        key={"edu-card"}
                      />
                    ) : (
                      <div className="flex center w-full ">
                        <TbMoodEmptyFilled /> No Data Found
                      </div>
                    )}
                  </div>
                </ProfileInfoField>
              </ProfileInputWrapper>
              {/* </div>
              <div className="part-2 flex-1"> */}
              <ProfileInputWrapper>
                <ProfileInfoField
                  title="Internship"
                  editOnClick={() => {
                    setInternShipModalOpen(true), setIntershipDetails({});
                    freezeBody();
                  }}
                >
                  <div className="w-full md:min-h-[100px] flex center flex-col">
                    {Object.keys(listOfIntership).length !== 0 ? (
                      <>
                        {Object.values(listOfIntership).map((idata, idx) => (
                          <div
                            className="flex w-full justify-start items-start gap-1 "
                            key={idx}
                          >
                            <KeyHighlightsListItem
                              icon={<HiBadgeCheck className="text-green-700" />}
                            />
                            <InternShipCard
                              key={idata.company}
                              profileIntershipDetails={{ ...idata }}
                              onEditCLick={() => {
                                handleIntershipDetails({
                                  ...idata,
                                  index: idx,
                                });
                                setInternShipModalOpen(true);
                              }}
                            />
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="flex center w-full ">
                        <TbMoodEmptyFilled /> No Data Found
                      </div>
                    )}
                  </div>
                </ProfileInfoField>
              </ProfileInputWrapper>
              {/* </div> */}
  
              <ProfileInputWrapper>
                <ProfileInfoField
                  title="Resume"
                  editOnClick={() => {}}
                  showIcon={false}
                >
                  <ResumeUploader />
                </ProfileInfoField>
              </ProfileInputWrapper>
            </div>
  
            {/* All Modals  */}
          </div>
        </div>
        <AnimatePresence>
          {skillModalOpen && (
            <AnimateEnterExit transition={{ duration: 0.2 }} position="!fixed">
              <ProfileSkillModal
                saveLoading={profileSkillsMutation.isPending}
                open={skillModalOpen}
                onClose={() => {
                  setSkillModalOpen(false);
                  freeBody();
                }}
                defaulsSkills={profileSkills}
                onChange={handleSkillsChange}
              />
            </AnimateEnterExit>
          )}
  
          {educationModalOpen && (
            <AnimateEnterExit transition={{ duration: 0.2 }} position="!fixed">
              <ProfileEducationModal
                saveLoading={profileEducationMutation.isPending}
                open={educationModalOpen}
                onClose={() => {
                  setEducationModalOpen(false);
                  freeBody();
                }}
                onChange={handleEducatioDetails}
                value={profileEducationDetails}
              />
            </AnimateEnterExit>
          )}
  
          {personalDetailsModalOpen && (
            <AnimateEnterExit transition={{ duration: 0.2 }} position="!fixed">
              <ProfilePersonalDetailsModal
                open={personalDetailsModalOpen}
                onClose={() => {
                  setPersonalDetailsModalOpen(false);
                  freeBody();
                }}
                value={personalDetails}
                onChange={handlePersonalDetails}
              />
            </AnimateEnterExit>
          )}
  
          {summaryModalOpen && (
            <AnimateEnterExit transition={{ duration: 0.2 }} position="!fixed">
              <ProfileSummaryModal
                open={summaryModalOpen}
                onClose={() => {
                  setSummaryModalOpen(false);
                  freeBody();
                }}
                value={profileSummary}
                onSummaryChange={handleSummaryChange}
              />
            </AnimateEnterExit>
          )}
  
          {intershipModalOpen && (
            <AnimateEnterExit transition={{ duration: 0.2 }} position="!fixed">
              <ProfileIntershipModal
                open={intershipModalOpen}
                onClose={() => {
                  setInternShipModalOpen(false);
                  freeBody();
                }}
                value={intershipDetails}
                addInterShipData={addIntershipDataToList}
                onDeleteInternship={deleteIntershipDataFromList}
              />
            </AnimateEnterExit>
          )}
        </AnimatePresence>
      </MainContext>
    );
  }
};

export default UserProfile;

const DeatilsBadge = ({
  icon = "",
  title = "",
  val = "",
  onClick = () => {},
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

const ProfileInputWrapper = ({ children }) => (
  <div className="flex flex-col mt-3 center w-full">
    <div className="w-full ">{children}</div>
  </div>
);

const Tag = ({ close = false, onClick = () => {}, val, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={
        "rounded-full cursor-pointer center gap-1 bg-slate-50 h-10 border hover:border-gray-950  px-3 text-sm " +
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
        "w-full h-fit flex justify-start items-center gap-3 bg-white rounded-lg p-2 ps-4 " +
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

const ProfileInfoField = ({
  editOnClick = () => {},
  title = "",
  children,
  icon = "Add",
  showIcon = true,
}) => {
  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-3 bg-white rounded-lg p-2 ps-4 ">
      <div className="flex justify-between items-center w-full">
        <span className="text-[1rem] ">{title} :</span>
        {showIcon && (
          <span
            className="text-orange-600 cursor-pointer"
            onClick={editOnClick}
          >
            {icon}
          </span>
        )}
      </div>
      {children}
    </div>
  );
};

const EducationCard = ({ profileEducationDetails }) => {
  return (
    <div className={"flex flex-col gap-1 w-full  bg-white rounded-lg mb-2 p-2"}>
      {profileEducationDetails.qualification && (
        <div className="flex items-center justify-start gap-1">
          <span>Qualification/Degree :</span>{" "}
          <span className="font-semibold flex-1 flex">
            {profileEducationDetails.qualification}
          </span>
        </div>
      )}
      {profileEducationDetails.specification && (
        <div className="flex items-center justify-start gap-1">
          <span>Specifiction :</span>{" "}
          <span className="font-semibold flex-1 flex">
            {profileEducationDetails.specification}
          </span>
        </div>
      )}
      {profileEducationDetails.college && (
        <div className="flex items-center justify-start gap-1">
          <span>College : </span>
          <span className="font-semibold flex-1 flex">
            {profileEducationDetails.college}
          </span>
        </div>
      )}
      {profileEducationDetails.percentage && (
        <div className="flex items-center justify-start gap-1">
          <span>Scored : </span>
          <span className="font-semibold flex-1 flex">
            {profileEducationDetails.percentage}
          </span>
        </div>
      )}
      {profileEducationDetails.passedYear && (
        <div className="flex items-center justify-start gap-1">
          <span>Passed Year : </span>
          <span className="font-semibold flex-1 flex">
            {profileEducationDetails.passedYear}
          </span>
        </div>
      )}
    </div>
  );
};

const InternShipCard = ({
  profileIntershipDetails,
  onEditCLick = () => {},
}) => {
  return (
    <div className={"flex flex-col gap-0 w-full  bg-white rounded-lg mb-2  "}>
      <h1 className="mb-1 text-[1.1rem] flex justify-start items-center gap-2">
        {profileIntershipDetails.company}
        <CiEdit
          className="cursor-pointer hover:text-orange-600"
          onClick={() => onEditCLick()}
        />
      </h1>
      <h1 className="text-sm">
        {profileIntershipDetails.startDate} , {profileIntershipDetails.endDate}
      </h1>
    </div>
  );
};

//Modals Forms for all

const ProfileSkillModal = ({
  open,
  onClose = () => {},
  defaulsSkills = [],
  onChange = () => {},
  saveLoading = false,
}) => {
  const [selectSkills, setSelectSkills] = useState(defaulsSkills);
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [fetchedSkills, setFetchedSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllSkills = async () => {
    if (open) {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/skills");
        if (res.data) {
          setOptions(res.data);
          setFetchedSkills(res.data);
        } else {
          message.error("Something Went Wrong");
        }
      } catch (error) {
        setFetchedSkills(skillsData); // remove after API intigration
        message.error("Something Went Wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAllSkills();
  }, [open]);

  const handleSearch = (value) => {
    setSearchValue(value);
    const filteredOptions = fetchedSkills
      .filter((skill) =>
        skill.label.toLowerCase().includes(value.toLowerCase())
      )
      .map((skill) => ({
        label: skill.label,
        value: skill.value,
      }));

    if (
      value &&
      !filteredOptions.some(
        (option) => option.value.toLowerCase() === value.toLowerCase()
      )
    ) {
      filteredOptions.push({
        label: value,
        value,
      });
    }

    setOptions(filteredOptions);
  };

  const handleDelete = (label) => {
    const skillsAfterDelete = selectSkills.filter(
      (skill) => skill.label.toLowerCase() !== label.toLowerCase()
    );
    setSelectSkills(skillsAfterDelete);
  };

  const handleSelect = (value) => {
   const alreadySelected = selectSkills.some((skill) => skill.value === value);

    if (alreadySelected) {
      message.error("Skill already selected");
      return;
    }

    const selectedSkill = fetchedSkills.find((skill) => skill.value === value);

    if (!selectedSkill) {
      const newSkill = { label: value, value };
      setSelectSkills([...selectSkills, newSkill]);
    } else {
      // Add the existing skill to selectSkills
      setSelectSkills([...selectSkills, selectedSkill]);
    }

    // Clear input and options after selection
    setSearchValue(""); // Clear input field
    setOptions(fetchedSkills); // Clear options dropdown
  };

  return (
    <div
      className={
        "absolute top-0 flex center   left-0 w-full h-full bg-slate-200 profile-modal p-7 md:p-10 " +
        (open ? "profile-modal-show " : " ")
      }
    >
      <div className="w-[90%] relative lg:w-[50%] h-fit border bg-gray-100 border-white p-3 md:p-10 rounded-lg">
        <FaArrowLeft
          className="absolute top-2 left-2 md:top-5 md:left-5 cursor-pointer"
          onClick={() => {
            onClose();
            setSelectSkills(defaulsSkills);
          }}
        />
         <h1 className="mt-5">Select skills</h1>

          <div className="flex flex-wrap gap-1 w-full  items-start">
            {selectSkills.map((data) => (
              <Tag
                val={data.value}
                key={data.label}
                close={true}
                onClick={() => handleDelete(data.label)}
              />
            ))}
          </div>

          <AutoComplete
            notFoundContent={loading ? <Spin size="small"  className="w-full flex center"/> : null}
            onChange={(value) => {
              if (value.trim().length === 0) {
                setSearchValue("");
              }
            }}
            className="w-full mt-7 md:mt-10 h-10 focus:shadow-none"
            placeholder="Search for a skill"
            options={options}
            onSearch={handleSearch}
            onSelect={handleSelect}
            value={searchValue}
          />
          <div className="w-full flex center mt-5 gap-4">
            <button
              className="btn-orange px-4 py-2 tracking-widest flex center gap-1"
              onClick={() => {
                onChange(selectSkills);
              }}
            >
              {saveLoading && <LuLoader2 className="animate-spin-slow " />} Save
            </button>
            <button
              className="btn-orange-outline px-4 py-2 "
              onClick={() => {
                onClose();
                setSelectSkills(defaulsSkills);
              }}
            >
              Cancel
            </button>
          </div>
        
      </div>
    </div>
  );
};

const ProfileEducationModal = ({
  open,
  onClose = () => {},
  onChange = () => {},
  value = {
    qualification: null,
    college: null,
    percentage: null,
    passedYear: null,
    specification: null,
  },
  saveLoading = false,
}) => {
  const [data, setData] = useState({ ...value });
  const [loading, setLoading] = useState(false);
  const [qualification, setQualification] = useState([]);
  const marksTypeItems = [
    { label: "Percentage", symbol: "%" },
    { label: "CGPA", symbol: "cgpa" },
  ];

  useEffect(() => {
    marksTypeItems.forEach((d, i) => {
      if (value.percentage?.includes(d.symbol)) {
        setMarksType(i);
      }
    });
  }, []);

  const [marksType, setMarksType] = useState(0);

  //Fertched Qualification data
  const [fetchedData, setFetchedData] = useState(null);

  const [selectedQualification, setSelectQualification] = useState(
    data.qualification
  );
  const [selectedSpecification, setSelectedSpecification] = useState(
    data.specification
  );

  const currentYear = dayjs().year();

  const onYearChange = (date, dateString) => {
    setData((prev) => {
      return { ...prev, passedYear: dateString };
    }); // Get selected year as a string
  };

  const fetchQualification = async () => {
    if (open) {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/qualifications/");
        if (res.data) {
          setQualification(Object.keys(res.data));
          setFetchedData(res.data);
        } else {
          message.error("Something Went Wrong");
        }
      } catch (error) {
        // remove after API intigration
        message.error("Something Went Wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchQualification();
  }, [open]);

  const disableFutureYears = (current) => {
    return current && current.year() > currentYear; // Disable years greater than the current year
  };

  return (
    <div
      className={
        "absolute top-[0] left-0 w-full flex center h-full bg-slate-200  profile-modal p-7 md:p-10 " +
        (open ? "profile-modal-show " : " ")
      }
    >
      <div className="border relative w-[90%] lg:w-[50%] p-5 md:p-8 bg-gray-100 border-white rounded-lg">
        <FaArrowLeft
          className="absolute top-2 left-2 md:top-5 md:left-5 cursor-pointer"
          onClick={() => {
            setData({ ...value });
            onClose();
          }}
        />
        <h1 className="mb-5">Add Highest Qualification Details</h1>

        <CustomAutoComplete
          loading={loading}
          value={selectedQualification}
          placeholder={"Search Qualification"}
          options={
            !loading &&
            qualification.map((d) => {
              return { label: d, value: d };
            })
          }
          onChange={(val) => {
            if (val) {
              setSelectQualification(val);
              setSelectedSpecification("");
            }
            setData((prev) => {
              return { ...prev, qualification: val };
            });
          }}
        />

        <CustomAutoComplete
          loading={loading}
          value={selectedSpecification}
          placeholder={"Search Specification"}
          customClass="mt-4"
          options={
            !loading &&
            (selectedQualification
              ? fetchedData !== null &&
                fetchedData[`${selectedQualification}`]?.map((d) => {
                  return { value: d, label: d };
                })
              : [])
          }
          onChange={(va) => {
            setSelectedSpecification(va);
            setData((prev) => {
              return { ...prev, specification: va };
            });
          }}
        />

        <InputBox
          key={"college"}
          placeholder="Institude Name /College"
          customClass="mt-4"
          value={data.college}
          animate={false}
          onChange={(e) =>
            setData((prev) => {
              return { ...prev, college: e.target.value };
            })
          }
        />
        <InputBox
          key={"percentage"}
          placeholder="Enter Percentage / CGPA"
          customClass="mt-4"
          value={data.percentage?.replace(/%|cgpa/gi, "").trim()}
          animate={false}
          onChange={(e) =>
            setData((prev) => {
              return { ...prev, percentage: e.target.value?.trim() };
            })
          }
        />

        <div className="flex flex-wrap gap-1 mt-2">
          {marksTypeItems.map((d, idx) => (
            <div
              key={idx}
              onClick={() => setMarksType(idx)}
              className={
                "p-1 bg-white rounded-full cursor-pointer border-[1px] border-transparent text-sm " +
                (marksType === idx ? "!border-black" : "")
              }
            >
              {d.label}
            </div>
          ))}
        </div>

        <DatePicker
          picker="year"
          onChange={onYearChange}
          placeholder="Passed Out Year"
          className="w-full mt-5 py-2 "
          value={data.passedYear ? dayjs(data.passedYear, "YYYY") : null}
          disabledDate={disableFutureYears} // Use the disabledDate prop to limit the selection
        />
        <div className="w-full mt-4 center gap-3">
          <button
            className="btn-orange px-3 border py-1 border-transparent tracking-widest flex center gap-1"
            onClick={() => {
              onChange({
                ...data,
                percentage: (
                  data["percentage"]?.replace(/%|cgpa/gi, "") +
                  " " +
                  (data["percentage"] !=="" ? marksTypeItems[marksType].symbol : "")
                ).trim(),
              });
            }}
          >
            {saveLoading && <LuLoader2 className="animate-spin-slow " />} Save
          </button>
          <button
            className="btn-orange-outline px-3 py-1"
            onClick={() => {
              onClose();
              setData({ ...value });
            }}
          >
            Cancel
          </button>
        </div>
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
        "absolute top-[0] left-0 w-full flex center h-full bg-slate-200 profile-modal p-7 md:p-10 " +
        (open ? "profile-modal-show " : " ")
      }
    >
      <div className="border relative w-[90%] lg:w-[50%] p-5 md:p-8 bg-gray-100 border-white rounded-lg">
        <FaArrowLeft
          className="absolute top-2 left-2 md:top-5 md:left-5 cursor-pointer"
          onClick={() => {
            onClose();
          }}
        />
        <h1 className="mb-5">Personal Details</h1>

        <Formik
          initialValues={value}
          enableReinitialize={true} // Ensure form resets when modal opens again with new values
          validationSchema={userPersonalDetailsSchema}
          onSubmit={(data, { resetForm }) => {
            onChange(data);
            resetForm();
          }}
        >
          {({ setFieldValue, resetForm, values }) => (
            <Form>
              {/* Full Name with Icon */}
              <Field name="fullName">
                {({ field, meta }) => (
                  <div>
                    <InputBox
                      animate={false}
                      {...field}
                      icon={<MdPerson />} // Icon for full name
                      placeholder="Full Name"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e); // Formik's handleChange
                      }}
                    />
                    {/* Error message for Full Name */}
                    {meta.touched && meta.error && (
                      <div className="text-[0.7rem] text-red-500">{meta.error}</div>
                    )}
                  </div>
                )}
              </Field>

              {/* Email with Icon */}
              <Field name="email">
                {({ field, meta }) => (
                  <div>
                    <InputBox
                      animate={false}
                      {...field}
                      disable={true}
                      icon={<MdEmail />} // Icon for email
                      placeholder="Email"
                      customClass="mt-4"
                      value={field.value}
                      disabled={true} // Assuming email is non-editable
                    />
                    {/* Error message for Email */}
                    {meta.touched && meta.error && (
                      <div className="text-[0.7rem] text-red-500">{meta.error}</div>
                    )}
                  </div>
                )}
              </Field>

              {/* Mobile with Icon */}
              <Field name="mobile">
                {({ field, meta }) => (
                  <div>
                    <InputBox
                      animate={false}
                      {...field}
                      icon={<FaPhoneAlt />} // Icon for mobile
                      placeholder="Enter Mobile"
                      customClass="mt-4"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e); // Formik's handleChange
                      }}
                    />
                    {/* Error message for Mobile */}
                    {meta.touched && meta.error && (
                      <div className="text-[0.7rem] text-red-500">{meta.error}</div>
                    )}
                  </div>
                )}
              </Field>

              {/* Gender */}
              <Field name="gender">
                {({ field, meta }) => (
                  <div>
                    <ProfileGender
                      key={values.gender}
                      {...field}
                      customClass="mt-4"
                      value={values.gender}
                      onChange={(val) => {
                        setFieldValue("gender", val); // Custom handler for select
                      }}
                    />
                    {/* Error message for Gender */}
                    {meta.touched && meta.error && (
                      <div className="text-[0.7rem] text-red-500">{meta.error}</div>
                    )}
                  </div>
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

const ProfileIntershipModal = ({
  open,
  onClose = () => {},
  addInterShipData = () => {},
  value,
  onDeleteInternship = () => {},
}) => {
  const [data, setData] = useState({ ...value });

  return (
    <div
      className={
        "absolute top-0 left-0 w-full flex center h-full bg-slate-200 profile-modal p-7 md:p-10 " +
        (open ? "profile-modal-show " : " ")
      }
    >
      <div className="border relative w-[90%] lg:w-[50%] p-5 md:p-8 bg-gray-100 border-white rounded-lg">
        <FaArrowLeft
          className="absolute top-2 left-2 md:top-5 md:left-5 cursor-pointer"
          onClick={() => {
            onClose();
          }}
        />
        {(value.index || value.index === 0) && (
          <MdDelete
            className="absolute top-2 right-2 md:top-5 md:right-5 cursor-pointer"
            onClick={() => {
              onDeleteInternship(value.index);
            }}
          />
        )}
        <h1 className="mb-5">Add Internship Details</h1>

        <Formik
          initialValues={value}
          enableReinitialize={true}
          onSubmit={(data, { resetForm }) => {
            if (value.index || value.index === 0) {
              const { index, ...rest } = data;
              addInterShipData({ [`${index}`]: { ...rest } }, true);
            } else {
              addInterShipData(data);
            }
            resetForm();
            onClose();
          }}
        >
          {({ setFieldValue, resetForm, values }) => (
            <Form>
              <Field name="company">
                {({ field }) => (
                  <InputBox
                    animate={false}
                    {...field}
                    value={field.value}
                    placeholder="Company Name"
                    onChange={(e) => {
                      field.onChange(e); // Call Formik's handleChange // Call your custom onChange
                    }}
                  />
                )}
              </Field>
              <Field name="project">
                {({ field }) => (
                  <InputBox
                    animate={false}
                    {...field}
                    value={field.value}
                    placeholder="Project Name"
                    customClass="mt-4"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                )}
              </Field>

              <Field name="description">
                {({ field }) => (
                  <InputBox
                    animate={false}
                    {...field}
                    value={field.value}
                    placeholder="Description about project"
                    customClass="mt-4"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                )}
              </Field>

              <InterShipDateRange
                endDate={values.endDate}
                startDate={values.startDate}
                onEndDateChange={(val) => {
                  setFieldValue("endDate", val);
                }}
                onStartDateChange={(val) => {
                  setFieldValue("startDate", val);
                }}
              />

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

const ProfileSummaryModal = ({
  open,
  onClose = () => {},
  value,
  onSummaryChange = () => {},
}) => {
  return (
    <div
      className={
        "absolute top-0 left-0 w-full flex center h-full bg-slate-200 md:bg-slate-100 profile-modal p-4 md:p-10 " +
        (open ? "profile-modal-show " : " ")
      }
    >
      <div className="border relative w-[98%]   lg:w-[50%] p-5 md:p-8 bg-gray-100 border-white rounded-lg">
        <FaArrowLeft
          className="absolute top-2 left-2 md:top-5 md:left-5 cursor-pointer"
          onClick={() => {
            onClose();
          }}
        />

        <h1 className="mb-5 mt-3">Add Profile Summary</h1>

        <Formik
          initialValues={{ summary: value }}
          enableReinitialize={true}
          onSubmit={(data, { resetForm }) => {
            onSummaryChange(data.summary);
          }}
        >
          {({ setFieldValue, resetForm, values }) => (
            <Form>
              <Field name="summary">
                {({ field }) => (
                  <TextArea
                    variant="borderless"
                    rows={4}
                    allowClear
                    className="!max-h-[600px] bg-white "
                    placeholder="Enter Profile Summary"
                    maxLength={200}
                    {...field}
                    value={values.summary}
                    onChange={(e) => field.onChange(e)}
                  />
                )}
              </Field>
              <h2 className="text-gray-500 font-extralight text-sm text-end">
                {new String(values.summary).length}/200
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

const ResumeUploader = () => {
  const inputRef = useRef();
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const { profileData, setProfileData } = useContext(AuthContext);

  useEffect(() => {
    if (profileData && profileData !== null) {
      setFileName(profileData?.profile_details?.resume?.fileName);
      setFileUrl(profileData?.profile_details?.resume?.url);
    }
  }, [profileData]);

  const updateResume = async (val) => {
    const res = await axiosInstance.put("/user/update", val);
    return res.data;
  };

  const resumeUploadMutation = useMutation({
    mutationKey: ["resume_upload"],
    mutationFn: updateResume,
    onSuccess: (val, varibles) => {
      toast.success("Resume Uploaded ");
      const { fileName, url } = val;
      setFileName(fileName);
      setFileUrl(url);
      setProfileData(val);
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

  function extractPublicId(url) {
    const parts = url.split("/"); // Split the URL by "/"

    // Find the index of the "resumes" part and return the resumes part with the file name
    const resumeIndex = parts.indexOf("resumes");

    if (resumeIndex !== -1 && parts[resumeIndex + 1]) {
      return `resumes/${parts[resumeIndex + 1]}`;
    } else {
      return null; // Return null if not found
    }
  }

  const handleFileChange = async (e) => {
    const files = e.target.files; // Access the files array
    if (files.length > 0) {
      const file = files[0];
      if (file.type !== "application/pdf") {
        toast.error("Unsupported File");
        inputRef.current.value = null;
        return;
      }
      const maxSizeInBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error("File size must be less than 2MB.");
        inputRef.current.value = null;
        return;
      }
      setLoading(true);

      try {
        if (fileUrl && fileName !== "") {
          const res = await axiosInstance.post("/uploader/delete-resume", {
            id: extractPublicId(fileUrl),
          });
        }
        const formData = new FormData();
        formData.append("resume", file);

        const res = await axiosInstance.post("/uploader/resume", formData);
        if (res.data.success) {
          setFileName(res.data.fileName);
          setFileUrl(res.data.url);

          const data = {
            "profile_details.resume.url": res.data.url,
            "profile_details.resume.fileName": res.data.fileName,
          };
          resumeUploadMutation.mutate(data);
        }
      } catch (error) {
        const { message } = getError(error);
        if (message) {
          toast.error(message);
        } else {
          toast.error("Something Went Wrong");
        }
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("No file selected.");
    }
  };

  return (
    <div className="w-full p-3 flex justify-start items-center">
      <input
        type="file"
        placeholder="upload Resume"
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
        accept=".pdf"
      />
      <div
        className={
          "px-3 py-2 cursor-pointer rounded-full bg-orange-600 text-white flex center gap-1 " +
          (loading || resumeUploadMutation.isPending
            ? " !cursor-not-allowed "
            : " ")
        }
        onClick={() => inputRef.current.click()}
      >
        {resumeUploadMutation.isPending || loading ? (
          <LuLoader2 className="animate-spin-slow " />
        ) : (
          <></>
        )}
        Upload
      </div>
      {!fileName || !fileUrl ? (
        <span className="text-sm ms-1">Upload Resume</span>
      ) : (
        <span className="text-sm ms-1">
          <span className="flex center gap-2 ms-1">
            {fileName && (
              <span>
                {fileName.length > 10
                  ? fileName.slice(0, 11) + "...."
                  : fileName}
              </span>
            )}
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ms-1  center inline-flex"
              >
                <HiOutlineEye />
              </a>
            )}
          </span>
        </span>
      )}
    </div>
  );
};

// date Picker

const { MonthPicker } = DatePicker;

const InterShipDateRange = ({
  endDate = null,
  startDate = null,
  onStartDateChange = () => {},
  onEndDateChange = () => {},
}) => {
  // Initialize state with props
  const [selectedStartDate, setSelectedStartDate] = useState(
    startDate ? dayjs(startDate) : null
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    endDate ? dayjs(endDate) : null
  );

  const currentMonth = dayjs().startOf("month");

  useEffect(() => {
    setSelectedStartDate(startDate ? dayjs(startDate) : null);
    setSelectedEndDate(endDate ? dayjs(endDate) : null);
  }, [startDate, endDate]);

  const handleStartChange = (date) => {
    setSelectedStartDate(date);
    onStartDateChange(date.format("YYYY-MM"));
    if (selectedEndDate && date && date.isAfter(selectedEndDate)) {
      onStartDateChange(null);
      setSelectedEndDate(null);
    }
  };

  const handleEndChange = (date) => {
    setSelectedEndDate(date);
    onEndDateChange(date.format("YYYY-MM"));
  };

  // Disable months that are before the start date and after the current month
  const disableStartDate = (current) => {
    return current > currentMonth; // Disable future months
  };

  const disableEndDate = (current) => {
    return current < dayjs(selectedStartDate) || current > currentMonth; // Disable months before start date and after current month
  };

  return (
    <div className="flex justify-between gap-1 items-center h-10 mt-4">
      <MonthPicker
        placeholder="Start month"
        value={selectedStartDate}
        className="font-outfit"
        onChange={handleStartChange}
        disabledDate={disableStartDate} // Disable future months for start date
        style={{ width: "45%", height: "100%" }} // Adjust width for better alignment
      />

      <MonthPicker
        placeholder="End month"
        value={selectedEndDate}
        onChange={handleEndChange}
        className="font-outfit"
        disabledDate={disableEndDate} // Disable months accordingly
        disabled={!selectedStartDate} // Disable end month picker until start month is selected
        style={{ width: "45%", height: "100%" }} // Adjust width for better alignment
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
  position = "absolute",
}) => {
  return (
    <motion.div
      className={"w-full h-full top-0 left-0 font-outfit " + position}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};
