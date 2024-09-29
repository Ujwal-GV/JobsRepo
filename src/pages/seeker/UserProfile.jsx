import React, { useEffect, useState } from "react";
import MainContext from "../../components/MainContext";
import ProfileAvatar from "../../components/ProfileAvatar";
import InputBox from "../../components/InputBox";
import { MdEmail, MdEdit, MdDelete, MdPerson } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaArrowLeft, FaCircleCheck } from "react-icons/fa6";
import { skillsData } from "../../../assets/dummyDatas/Data";
import { AutoComplete, DatePicker, message, Spin } from "antd";
import axios from "axios";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { FaPhoneAlt, FaSave } from "react-icons/fa";
import { IoIosMale, IoIosFemale, IoMdTransgender } from "react-icons/io";
import { TbMoodEmptyFilled } from "react-icons/tb";
import { Field, Form, Formik } from "formik";
import { CiEdit } from "react-icons/ci";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { AiFillProject } from "react-icons/ai";
import { Input } from "antd";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { AnimatePresence, motion } from "framer-motion";


const { TextArea } = Input;

const UserProfile = () => {
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [educationModalOpen, setEducationModalOpen] = useState(false);
  const [personalDetailsModalOpen, setPersonalDetailsModalOpen] =
    useState(false);
  const [intershipModalOpen, setInternShipModalOpen] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  const [profileSkills, setProfileSkills] = useState([]);

  const [profileEducationDetails, setEducationDetails] = useState({
    qualification: null,
    college: null,
    percentage: null,
    passedYear: null,
  });

  const [personalDetails, setPersonalDetails] = useState({
    fullName: "shivuroopesh",
    email: "shivuroopesh6362@gmail.com",
    mobile: "6362379895",
    gender: "Male",
  });

  const [listOfIntership, setListOfIntership] = useState({});
  const [intershipDetails, setIntershipDetails] = useState({});

  const [profileSummary, setProfileSummary] = useState("");

  const handleSkillsChange = (val) => {
    setProfileSkills(val);
  };

  const handleEducatioDetails = (val) => {
    setEducationDetails((prev) => {
      return { ...prev, ...val };
    });
  };

  const handlePersonalDetails = (val) => {
    setPersonalDetails((prev) => {
      return { ...prev, ...val };
    });
  };

  const handleIntershipDetails = (val) => {
    setIntershipDetails((prev) => {
      return { ...val };
    });
  };

  const addIntershipDataToList = (val, modify = false) => {
    if (!modify) {
      const index = Object.keys(listOfIntership).length;
      const newData = { [`${index}`]: { ...val } };
      setListOfIntership((prev) => {
        return { ...prev, ...newData };
      });
    } else {
      setListOfIntership((prev) => {
        return { ...prev, ...val };
      });
    }
  };

  const handleSummaryChange = (val) => {
    setProfileSummary(val);
  };

  return (
    <MainContext>
      <div className="w-full h-screen bg-slate-50 ">
        <div className="w-full h-screen overflow-y-auto relative overflow-x-hidden mx-auto  mt-2 md:max-w-[80%] lg:max-w-[70%] bg-slate-100 pb-5 px-2 md:px-0 font-outfit ">
          {/* Avatar and PersonalDetails */}

          <div className="flex center flex-col w-[95%] md:flex-row md:w-full gap-2 sticky top-0 pt-2   h-fit mx-auto">
            <div className="w-[200px] h-[200px] flex center relative rounded-full  bg-white">
              <ProfileAvatar />
            </div>
            <div className="bg-white w-full md:w-[500px] h-full  p-3 md:p-7 rounded-xl relative">
              <MdEdit
                className="absolute top-2 right-2  cursor-pointer"
                onClick={() => setPersonalDetailsModalOpen(true)}
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

          <div className="w-[60%]   mx-auto flex flex-col gap-2 md:gap-0 sm:flex-row justify-evenly items-center p-1 border-t mt-2">
            <DeatilsBadge
              icon={<BiSolidBadgeCheck className="text-green-600" />}
              title="Jobs Applied"
              val={100}
            />
            <DeatilsBadge
              icon={<FaSave className=" text-orange-600" />}
              title="Saved"
              val={10}
            />
            <DeatilsBadge
              icon={<AiFillProject className="text-green-600 rotate-180" />}
              title="Projects Applied"
              val={100}
            />
          </div>
          <div className="w-full  h-80 max-w-[90%] md:w-full mx-auto mt-4 flex flex-col lg:flex-row gap-2">
            {/* Section 1 */}

            <div className="part-1 flex-1">
              <ProfileInputWrapper>
                <ProfileInfoField
                  title="Profile Summary"
                  icon={profileSummary.trim() === "" ? "Add" : "Edit"}
                  editOnClick={() => setSummaryModalOpen(true)}
                >
                  <div className="flex flex-wrap gap-1 w-full pb-2 ">
                    {!profileSummary ? (
                      <div className="w-full gap-1 center flex">
                        <TbMoodEmptyFilled /> Add Summary About Your Profile
                      </div>
                    ) : (
                      <>
                        <div className="w-full h-full bg-white p-2 rounded-lg overflow-hidden text-ellipsis">
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
                  editOnClick={() => setSkillModalOpen(true)}
                >
                  <div className="flex flex-wrap gap-1 w-full md:min-h-[100px]">
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
                  editOnClick={() => setEducationModalOpen(true)}
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
            </div>
            <div className="part-2 flex-1">
              <ProfileInputWrapper>
                <ProfileInfoField
                  title="Internship"
                  editOnClick={() => {
                    setInternShipModalOpen(true), setIntershipDetails({});
                  }}
                >
                  <div className="w-full md:min-h-[100px] flex center flex-col">
                    {Object.keys(listOfIntership).length !== 0 ? (
                      <>
                        {Object.values(listOfIntership).map((idata, idx) => (
                          <div
                            className="flex w-full justify-start items-center gap-1 "
                            key={idx}
                          >
                            <KeyHighlightsListItem
                              icon={
                                <FaCircleCheck className="text-green-700" />
                              }
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
            </div>
          </div>

          <ProfileSkillModal
            open={skillModalOpen}
            onClose={() => setSkillModalOpen(false)}
            defaulsSkills={profileSkills}
            onChange={handleSkillsChange}
          />

          <ProfileEducationModal
            open={educationModalOpen}
            onClose={() => setEducationModalOpen(false)}
            onChange={handleEducatioDetails}
            value={profileEducationDetails}
          />

          <ProfilePersonalDetailsModal
            open={personalDetailsModalOpen}
            onClose={() => setPersonalDetailsModalOpen(false)}
            value={personalDetails}
            onChange={handlePersonalDetails}
          />

          <ProfileIntershipModal
            open={intershipModalOpen}
            onClose={() => setInternShipModalOpen(false)}
            value={intershipDetails}
            addInterShipData={addIntershipDataToList}
          />
        </div>
      </div>
      <AnimatePresence>
              
          {summaryModalOpen && (
            <AnimateEnterExit transition={{duration:0.2}}>
              <ProfileSummaryModal
              open={summaryModalOpen}
              onClose={() => setSummaryModalOpen(false)}
              value={profileSummary}
              onSummaryChange={handleSummaryChange}
            />
            </AnimateEnterExit>
          )}
             

          </AnimatePresence>
    </MainContext>
  );
};

export default UserProfile;

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

const ProfileInfoField = ({
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
            {profileEducationDetails.percentage} %{" "}
          </span>
        </div>
      )}
      {profileEducationDetails.passedYear && (
        <div className="flex items-center justify-start gap-1">
          <span>Passed Year : </span>
          <span className="font-semibold flex-1 flex">
            {profileEducationDetails.passedYear}{" "}
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
    <div
      className={
        "flex flex-col gap-0 w-full  bg-white rounded-lg mb-2 p-2  md:px-1 "
      }
    >
      <h1 className="mb-1 text-[1.1rem] flex justify-start items-center gap-2">
        {profileIntershipDetails.company}{" "}
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
        const res = await axios.get("http://localhost:5000/skills/");
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

  // Handle selecting a skill from the AutoComplete dropdown
  const handleSelect = (value) => {
    // Check if the skill is already selected
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
    setOptions([]); // Clear options dropdown
  };

  return (
    <div
      className={
        "absolute top-0 flex center   left-0 w-full h-full bg-slate-200 profile-modal p-7 md:p-10 " +
        (open ? "profile-modal-show " : " ")
      }
    >
      <FaArrowLeft
        className="absolute top-2 left-2 md:top-5 md:left-5 cursor-pointer"
        onClick={() => {
          onClose();
          setSelectSkills(defaulsSkills);
        }}
      />
      <div className="w-[90%] lg:w-[50%] h-fit border border-white p-3 md:p-10 rounded-lg">
        <Spin className="w-full h-full" size="large" spinning={loading}>
          <h1 className="mt-1">Select skills</h1>

          <div className="flex flex-wrap gap-1 w-full min-h-40">
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
            className="w-full mt-7 md:mt-10 h-10 focus:shadow-none"
            placeholder="Search for a skill"
            options={options}
            onSearch={handleSearch}
            onSelect={handleSelect}
            value={searchValue}
          />
          <div className="w-full flex center mt-5 gap-4">
            <button
              className="btn-orange px-4 py-2 tracking-widest"
              onClick={() => {
                onChange(selectSkills);
                onClose();
              }}
            >
              Save
            </button>
            <button
              className="btn-orange-outline px-4 py-2 "
              onClick={() => {
                onClose();
                setSelectSkills(defaulsSkills);
              }}
            >
              Cancle
            </button>
          </div>
        </Spin>
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
  },
}) => {
  const [data, setData] = useState({ ...value });

  const currentYear = dayjs().year();

  const onYearChange = (date, dateString) => {
    setData((prev) => {
      return { ...prev, passedYear: dateString };
    }); // Get selected year as a string
  };

  const disableFutureYears = (current) => {
    return current && current.year() > currentYear; // Disable years greater than the current year
  };

  return (
    <div
      className={
        "absolute top-[0] left-0 w-full flex center h-screen bg-slate-200  profile-modal p-7 md:p-10 " +
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
        <InputBox
          key={"Qualification/Degree"}
          name="qualification"
          placeholder="Qualification/Degree"
          value={data.qualification}
          onChange={(e) =>
            setData((prev) => {
              return { ...prev, qualification: e.target.value };
            })
          }
        />
        <InputBox
          key={"college"}
          placeholder="Institude Name /College"
          customClass="mt-4"
          value={data.college}
          onChange={(e) =>
            setData((prev) => {
              return { ...prev, college: e.target.value };
            })
          }
        />
        <InputBox
          key={"percentage"}
          placeholder="Enter Percentage"
          customClass="mt-4"
          value={data.percentage}
          onChange={(e) =>
            setData((prev) => {
              return { ...prev, percentage: e.target.value };
            })
          }
        />

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
            className="btn-orange px-3 border py-1 border-transparent tracking-widest"
            onClick={() => {
              onChange(data);
              onClose();
            }}
          >
            Save
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
        "absolute top-[0] left-0 w-full flex center h-screen bg-slate-200 profile-modal p-7 md:p-10 " +
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

const ProfileIntershipModal = ({
  open,
  onClose = () => {},
  addInterShipData = () => {},
  value,
}) => {
  const [data, setData] = useState({ ...value });

  return (
    <div
      className={
        "absolute top-0 left-0 w-full flex center h-screen bg-slate-200 profile-modal p-7 md:p-10 " +
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
            onClick={() => {}}
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
        "absolute top-0 left-0 w-full flex center h-screen bg-slate-50 md:bg-slate-100 profile-modal p-4 md:p-10 " +
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
