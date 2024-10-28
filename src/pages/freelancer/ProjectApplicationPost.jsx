import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobContext } from '../../contexts/JobContext';
import { useMutation } from "@tanstack/react-query";
import MainContext from "../../components/MainContext";
import { AuthContext } from '../../contexts/AuthContext';
import { FaCheckCircle, FaEye, FaTrash } from "react-icons/fa";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { jobTypes, employmentOptions, jobLocations } from "../../../assets/dummyDatas/Data"
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import styles for ReactQuill
import Select from "react-select";
import { AutoComplete, Spin, message } from "antd";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { TimePicker } from 'antd';
import { axiosInstance } from '../../utils/axiosInstance';
import CustomBreadCrumbs from '../../components/CustomBreadCrumbs';
import { CiHome, CiUser } from 'react-icons/ci';
import { LuLoader2 } from 'react-icons/lu';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const VerticalBar = () => {
  return <div className="w-0 h-5 border-r border-black"></div>;
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

const SkillSelector = ({ defaultSkills = [], onChange = () => {}, isOptionalChecked, setOptionalSkills, title="" }) => {
  const [selectSkills, setSelectSkills] = useState(defaultSkills.map(skill => skill.value));
  const [options, setChoices] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [fetchedSkills, setFetchedSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllSkills();
  }, []);

  const fetchAllSkills = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/skills/");
      if (res.data) {
        const skills = res.data.map(skill => ({ label: skill.value, value: skill.value }));
        setChoices(skills);
        setFetchedSkills(skills);
      } else {
        message.error("Something Went Wrong");
      }
    } catch (error) {
      message.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

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

    setChoices(filteredOptions);
  };

  const handleDelete = (label) => {
    const skillsAfterDelete = selectSkills.filter(skill => skill !== label);
    setSelectSkills(skillsAfterDelete);
    onChange(skillsAfterDelete);

    if (isOptionalChecked) {
      setOptionalSkills(skillsAfterDelete);
    }
  };

  const handleSelect = (value) => {
    const alreadySelected = selectSkills.includes(value);

    if (alreadySelected) {
      message.error("Skill already selected");
      return;
    }

    setSelectSkills([...selectSkills, value]);
    setSearchValue("");
    setChoices(fetchedSkills);
    onChange([...selectSkills, value]);

    if (isOptionalChecked) {
      setOptionalSkills((prev) => [...prev, value]);
    }
  };

  return (
    <div className="flex flex-row">
      <Spin spinning={loading}>
        <div className="flex flex-wrap gap-1 w-full items-start">
          {selectSkills.map((data) => (
            <Tag
              val={data}
              key={data}
              close={true}
              onClick={() => handleDelete(data)}
            />
          ))}
        </div>

        <AutoComplete
          allowClear
          onSearch={handleSearch}
          onSelect={handleSelect}
          options={options}
          placeholder="Search for a skill"
          value={searchValue}
          className="w-[12rem] h-10 mt-2 focus:shadow-none border rounded-md"
        />
      </Spin>
    </div>
  );
};

const DueDateTimePicker = ({ dueDate, setDueDate }) => {
    const [selectedDate, setSelectedDate] = useState(dueDate);
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
      setDueDate(date);
    };
  
    return (
      <div className="mt-4">
        <KeyHighlightsListItem key={"1"} title="Due Date" value={null} />
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          className="react-datepicker font-outfit"
          placeholderText="Select due date"
        />
      </div>
    );
  };

const ProjectApplicationPost = () => {
  const [saved, setSaved] = useState(false);
  const { jobs, setJobs } = useJobContext();
  const { userRole, profileData } = useContext(AuthContext);
    
  const [jobDetails, setJobDetails] = useState({
    name: "",
    description: "",
    amount: "",
    dueTime: "",
    providerName: profileData?.name,
    skills: [],
  });

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const {
      name,
      description,
      amount,
      dueTime,
      skills,
    } = jobDetails;
  
    if (!name || !description || !dueTime || skills.length === 0) {
      message.error("Please enter all required details");
      return;
    }
  
    if (isNaN(amount)) {
      message.error("Amount must be valid numbers");
      return;
    }

    const projectData = {
      description,
      cost: {
        amount: Number(amount),
      }, 
      name,
      dueTime,
      skills,
    };
  
    mutation.mutate(projectData);
  };

  const submitProjectApplication = async (projectData) => {
    const response = await axiosInstance.post('/projects/create', projectData);
    console.log("RESPONSE:", response.data);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: submitProjectApplication,
    onSuccess: (data) => {
      console.log("Data:", data);
      toast.success('Project posted successfully!');
      navigate('/freelancer', { replace: true });
    },
    onError: (error) => {
        console.log(error);
        
      const { message } = error.response.data;
      console.error(message);
      toast.error(message);
    },
  });

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate('/login');
      toast.error("Please login to post a project");
    }
  }, [navigate]);

  return (
    <MainContext>
      <div className="w-full flex center py-2 sticky pt-8 bg-slate-100">
        <CustomBreadCrumbs
          items={[
            {
              path: "/freelancer",
              icon: <CiHome />,
              title: "Home",
            },
            { title: "Post Project", icon: <CiUser /> },
          ]}
        />
      </div>
      {/* Wrapper for the entire content */}
      <div className="w-full mx-auto min-h-screen bg-gray-100 py-3 px-3 md:py-3 md:px-6 lg:px-3 flex flex-col gap-10">
        
        {/* Top Section: Company and Person Details */}
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="w-full lg:w-[55%] job-apply-section flex flex-col mx-auto relative">
          
            {/* Company and Person Details */}
            <div className="w-full rounded-xl h-fit bg-white p-5 md:p-5 mb-8 font-outfit">
              <img 
                src={profileData?.img} 
                alt="Freelancer Logo" 
                className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover mb-4 absolute top-4 right-4" 
              />

            <h1 className="text-[1.3rem] md:text-2xl font-semibold">
              <input
                  type="text"
                  name="providerName"
                  placeholder="Enter Freelancer Name"
                  value={jobDetails.providerName}
                  onChange={handleChange}
                  className="w-full border mb-4 rounded-lg p-2"
                  readOnly
                />
              </h1>

              <h1 className="text-[1.3rem] w-3/4 md:text-2xl font-bold border-b-2 rounded-b-md border-y-gray-200">
              <KeyHighlightsListItem key={"1"} title="Project title" value={null} />
              <input
                  type="text"
                  name="name"
                  placeholder="Enter Project Title"
                  value={jobDetails.name}
                  onChange={handleChange}
                  className="w-full border mb-4 rounded-lg p-2"
                  required
                />
              </h1>
              <hr className="mt-5 mb-2" />
              <ul className="mt-3">

              <li className='flex flex-col md:flex flex-col items-start mb-4'>
              <KeyHighlightsListItem className="mt-3" key={"1"} title="Cost" value={null} />
                    <input
                      type="number"
                      name="amount"
                      placeholder="Enter the Cost"
                      value={jobDetails.amount}
                      onChange={handleChange}
                      className="cost-input w-[12rem] border mt-4 ml-4 rounded-lg p-3"
                  />
              </li>

              <KeyHighlightsListItem key={"1-1"} title="Skills" value={null} />
                {/* Required Skills */}
                <li className="flex flex-col md:flex-row mb-4">
                  <div className="flex flex-col w-auto md:ml-4 mt-2 ml-4 w-full md:w-auto">
                    <SkillSelector
                      defaultSkills={jobDetails.skills || []}
                      onChange={(selectedSkills) => {
                        setJobDetails((prev) => ({
                          ...prev,
                          skills: selectedSkills,
                        }));
                      }}
                    />
                  </div>
                </li>

                <li className="flex flex-col md:flex-row mb-4">
                <DueDateTimePicker
                    dueDate={jobDetails.dueTime}
                    setDueDate={(date) =>
                    setJobDetails((prev) => ({ ...prev, dueTime: date }))
                    }
                />
                </li>
              </ul>
            </div>

            <div className="w-full lg:w-full mt-5 md:mt-0 flex-1 flex flex-col gap-2 h-fit bg-white rounded-lg p-5 md:p-5">
              <h1 className="text-xl md:text-2xl font-outfit text-orange-600">
                About Project
              </h1>
              <div className="mt-4">
                <label className="block text-md ml-2 font-medium text-gray-800 font-outfit">
                  Project Description
                </label>
                <div className="mt-1 bg-gray-200 p-2 rounded-lg shadow-sm font-outfit">
                  <ReactQuill
                    theme="snow"
                    value={jobDetails.description}
                    onChange={(content) => setJobDetails((prev) => ({ ...prev, description: content }))}
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
              
              <div className="flex flex-row items-center mt-4 gap-2 sxl: flex flex-row">
                  <button
                    className="btn-orange-outline px-3 py-1 flex center gap-1"
                    onClick={handleBackClick}
                  >
                    {"Back"}
                  </button>
                  <button
                    type= "submit"
                    disabled={mutation.isPending}
                    className="btn-orange-outline px-3 py-1 flex center gap-1"
                  >
                     {
                      mutation.isPending &&  <LuLoader2 className="animate-spin-slow " />
                     }
                    {saved ? (
                      <FaCheckCircle className="text-orange-600" />
                    ) : (
                      <></>
                    )}
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
            </div>
        </form>
      </div>
    </MainContext>
  );
};

export default ProjectApplicationPost;