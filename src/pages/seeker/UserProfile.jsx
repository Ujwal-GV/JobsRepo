import React, { useEffect, useState } from "react";
import MainContext from "../../components/MainContext";
import ProfileAvatar from "../../components/ProfileAvatar";
import InputBox from "../../components/InputBox";
import { MdEmail, MdEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { skillsData } from "../../../assets/dummyDatas/Data";
import { AutoComplete, message } from "antd";

const UserProfile = () => {
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [educationModalOpen, setEducationModalOpen] = useState(false);



  const [profileSkills,setProfileSkills]  = useState([])


  const handleSkillsChange = (val)=>{
    setProfileSkills(val);
  }

  return (
    <MainContext>
      <div className="w-full h-screen bg-slate-50 ">
        <div className="w-full h-screen overflow-y-auto relative overflow-x-hidden mx-auto  md:max-w-[80%] lg:max-w-[70%] bg-slate-100 py-5 font-outfit">
          <div className="flex center w-full  ">
            <div className="w-[200px] h-[200px] flex center relative rounded-full  bg-white">
              <ProfileAvatar />
            </div>
          </div>

          <ProfileInputWrapper>
            <InputBox placeholder="FullName" />
          </ProfileInputWrapper>

          <ProfileInputWrapper>
            <InputBox
              placeholder="Email"
              name={"email"}
              disable={true}
              value="shivuroopesh6362@gmail.com"
              icon={<MdEmail />}
            />
          </ProfileInputWrapper>
          <ProfileInputWrapper>
            <InputBox placeholder="Mobile" />
          </ProfileInputWrapper>
          <ProfileInputWrapper>
            <ProfileGender key={"gender"} value="Male" />
          </ProfileInputWrapper>

          <ProfileInputWrapper>
            <ProfileInfoField
              title="Skills"
              editOnClick={() => setSkillModalOpen(true)}
            >
              <div className="flex flex-wrap gap-1 w-full">
                {
                  profileSkills.length === 0  ?  <div className="w-full center flex">No Skills Selected</div>   : <>{profileSkills.map((skill)=><Tag val={skill.value}  key={skill.label}/>)}</>
                }
              </div>
            </ProfileInfoField>
          </ProfileInputWrapper>

          <ProfileInputWrapper>
            <ProfileInfoField
              title="Education"
              editOnClick={() => setEducationModalOpen(true)}
            >
              <div className="flex flex-wrap gap-1 w-full">
                <Tag val={"Software Engineering"} className="border-none" />
                <Tag val={"Engineer"} />
                <Tag val={"Software Engineering"} />
                <Tag val={"Engineer"} />
                <Tag val={"Engineer"} />
              </div>
            </ProfileInfoField>
          </ProfileInputWrapper>

          <ProfileSkillModal
            open={skillModalOpen}
            onClose={() => setSkillModalOpen(false)}
            defaulsSkills={profileSkills}
            onChange={handleSkillsChange}
          />

          <ProfileEducationModal
            open={educationModalOpen}
            onClose={() => setEducationModalOpen(false)}
          />
        </div>
      </div>
    </MainContext>
  );
};

export default UserProfile;

const ProfileInputWrapper = ({ children }) => (
  <div className="flex flex-col mt-3 center w-full">
    <div className="w-[90%] md:w-[500px]">{children}</div>
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

const ProfileGender = ({ value = "" }) => {
  const Genderdata = ["Male", "Female", "Transgender"];

  const [val, setVal] = useState(value);

  const handleChange = (v) => {
    setVal(v);
  };

  const handleDelete = () => {
    setVal("");
  };

  return (
    <div className="w-full h-fit flex justify-start items-center gap-3 bg-gray-200 rounded-lg p-2 ps-4 ">
      <span>Gender :</span>
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

const ProfileInfoField = ({ editOnClick = () => {}, title = "", children }) => {
  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-3 bg-gray-200 rounded-lg p-2 ps-4 cursor-pointer">
      <div className="flex justify-between items-center w-full">
        <span>{title} :</span>{" "}
        <MdEdit className="hover:text-orange-600" onClick={editOnClick} />
      </div>
      {children}
    </div>
  );
};

//Modals Forms for all

const ProfileSkillModal = ({
  open,
  onClose = () => {},
  defaulsSkills = [],
  onChange = ()=>{},
}) => {
  const [selectSkills, setSelectSkills] = useState(defaulsSkills);
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState(""); // For managing input value
  
  const handleSearch = (value) => {
    setSearchValue(value); 
    const filteredOptions = skillsData
      .filter((skill) =>
        skill.label.toLowerCase().includes(value.toLowerCase())
      )
      .map((skill) => ({
        label: skill.label,
        value: skill.value,
      }));

    if (value && !filteredOptions.some(option => option.value.toLowerCase() === value.toLowerCase())) {
      filteredOptions.push({
        label: value, 
        value, 
      });
    }

    setOptions(filteredOptions);
  };



  const handleDelete =(label)=>{
   
    const skillsAfterDelete = selectSkills.filter((skill)=>skill.label.toLowerCase() !== label.toLowerCase())
    setSelectSkills(skillsAfterDelete);
  }

  // Handle selecting a skill from the AutoComplete dropdown
  const handleSelect = (value) => {

    // Check if the skill is already selected
    const alreadySelected = selectSkills.some(
      (skill) => skill.value === value
    );

    if (alreadySelected) {
      message.error('Skill already selected');
      return;
    }

    const selectedSkill = skillsData.find((skill) => skill.value === value);

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
        'absolute top-0 left-0 w-full h-full bg-slate-200 profile-modal p-7 md:p-10 ' +
        (open ? 'profile-modal-show ' : ' ')
      }
    >
      <FaArrowLeft
        className="absolute top-2 left-2 md:top-5 md:left-5 cursor-pointer"
        onClick={()=>{onClose();setSelectSkills(defaulsSkills)}}
      />
      <h1 className="mt-10">Select skills</h1>

      <div className="flex flex-wrap gap-1 w-full min-h-40">
        {selectSkills.map((data) => (
          <Tag val={data.value} key={data.label} close={true} onClick={()=>handleDelete(data.label)} />
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
          <button className="btn-orange px-4 py-2 tracking-widest" onClick={()=>{
      onChange(selectSkills); onClose()}}>Save</button>
          <button className="btn-orange-outline px-4 py-2 " onClick={()=>{onClose();setSelectSkills(defaulsSkills)}}>Cancle</button>
      </div>
    </div>
  );
};






const ProfileEducationModal = ({ open, onClose = () => {} }) => {
  return (
    <div
      className={
        "absolute top-[0] left-0 w-full h-screen bg-slate-200  profile-modal p-7 md:p-10 " +
        (open ? "profile-modal-show " : " ")
      }
    >
      <FaArrowLeft
        className="absolute top-2 left-2 md:top-5 md:left-5 cursor-pointer"
        onClick={onClose}
      />
      <div>Education Select Modal</div>
    </div>
  );
};
