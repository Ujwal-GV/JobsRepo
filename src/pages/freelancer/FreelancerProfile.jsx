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
import { Input } from "antd";
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


const { TextArea } = Input;

const FreelancerProfile = () => {
  const navigate = useNavigate();
  const [personalDetailsModelOpen, setpersonalDetailsModelOpen] = useState(false);

  const { profileData, setProfileData } = useContext(AuthContext);
  const [freelancerId, setFreelancerId] = useState(null);
  console.log("Freelancer_Details:", profileData);
  
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
  console.log(profileDataLoading,isFetching);


  const updateFreelancerProfile = async (val) => {
    console.log("Values:", val);
    const data ={"email":val.email,"mobile":val.mobile}
    console.log("Data_Update:", data);
    const res = await axiosInstance.put("/freelancer/update", data);
    console.log("Response_Data", res.data);
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
       console.log(val , variables)
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
          <div className="w-full h-fit-screen overflow-y-auto relative overflow-x-hidden mx-auto  mt-2 md:max-w-[80%] lg:max-w-[70%] bg-slate-100 pb-5 px-2 md:px-0 font-outfit ">
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
                <h1 className="flex justify-start text-3xl font-bold items-center gap-1">
                  <BiSolidBadgeCheck className="text-orange-600" />
                  {personalDetails.name || "Freelancer Name"}
                </h1>
                <hr className="m-2" />
                <h1 className="flex justify-start items-center gap-1">
                  <BiKey className="text-orange-600" />
                  {personalDetails.freelancer_id || "Freelancer ID"}
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
              </div>

              <div className="w-[100%] mx-auto flex flex-wrap center p-1 border-t pt-2  mt-2">
              <DeatilsBadge
                icon={<BiSolidBadgeCheck className="text-green-600" />}
                title="Projects Posted"
                val={profileData?.project_details?.projects?.length || 0}
                // onClick={() => navigate(`/freelancer/projects-posted/${freelancerId}`)}
              />
              <DeatilsBadge
                icon={<BiGroup className="text-orange-600" />}
                title="Followers"
                val={profileData?.followers?.length || 0}
              />
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
        </AnimatePresence>
      </MainContext>
    );
  }
};

export default FreelancerProfile;

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