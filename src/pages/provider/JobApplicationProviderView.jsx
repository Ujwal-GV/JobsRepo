import React, { useEffect, useState } from 'react';
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
import { axiosInstance } from '../../utils/axiosInstance';

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
  const [selectSkills, setSelectSkills] = useState(defaultSkills);
  const [options, setChoices] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [fetchedSkills, setFetchedSkills] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchAllSkills = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8087/skills/");
      if (res.data) {
        setChoices(res.data);
        setFetchedSkills(res.data);
      } else {
        message.error("Something Went Wrong");
      }
    } catch (error) {
      message.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSkills();
  }, []);

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
    const skillsAfterDelete = selectSkills.filter(
      (skill) => skill.label.toLowerCase() !== label.toLowerCase()
    );
    setSelectSkills(skillsAfterDelete);
    onChange(skillsAfterDelete);

    if (isOptionalChecked) {
      setOptionalSkills(skillsAfterDelete);
    }
  };

  const handleSelect = (value) => {
    const alreadySelected = selectSkills.some((skill) => skill.value === value);

    if (alreadySelected) {
      message.error("Skill already selected");
      return;
    }

    const selectedSkill = fetchedSkills.find((skill) => skill.value === value);
    const newSkill = selectedSkill || { label: value, value };

    setSelectSkills([...selectSkills, newSkill]);
    setSearchValue("");
    setChoices(fetchedSkills);
    onChange([...selectSkills, newSkill]);

    if (isOptionalChecked) {
      setOptionalSkills((prev) => [...prev, newSkill]);
    }
  };

  const handleOptionalChange = (e) => {
    setIsOptionalChecked(e.target.checked);
    if (e.target.checked) {
      setOptionalSkills(selectSkills); // Copy required skills to optional skills
    } else {
      setOptionalSkills([]); // Reset optional skills if unchecked
    }
  };

  return (
    <div className="flex flex-row">
      <Spin spinning={loading}>
        <KeyHighlightsListItem key={"1"} title={title} value={null} />
        <div className="flex flex-wrap gap-1 w-full mt-2 items-start">
          {selectSkills.map((data) => (
            <Tag
              val={data.value}
              key={data.label}
              close={true}
              onClick={() => handleDelete(data.label)}
            />
          ))}
        </div>

        < AutoComplete
          allowClear
          onSearch={handleSearch}
          onSelect={handleSelect}
          options={options}
          placeholder="Search for a skill"
          value={searchValue}
          className="w-[12rem] mt-7 md:mt-5 h-10 focus:shadow-none border rounded-md"
        />
      </Spin>
    </div>
  );
};

const QualificationSelector = ({ defaultQualifications = [], onChange = () => {}, title="" }) => {
  const [selectQualifications, setSelectQualifications] = useState(defaultQualifications);
  const [options, setChoices] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [fetchedQualifications, setFetchedQualifications] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchAllQualifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8087/qualifications/");
      // console.log(res.data);
      if (res.data) {
        const fetchedOptions = Object.keys(res.data).map((key) => ({
          label: key,
          value: key,
        }));
        setChoices(fetchedOptions);
        setFetchedQualifications(fetchedOptions);
      } else {
        message.error("Something Went Wrong");
      }
    } catch (error) {
      message.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQualifications();
  }, []);

  const handleSearch = (value) => {
    setSearchValue(value);
    const filteredOptions = fetchedQualifications
      .filter((qualification) =>
        qualification.label.toLowerCase().includes(value.toLowerCase())
      )
      .map((qualification) => ({
        label: qualification.label,
        value: qualification.value,
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
    const qualificationsAfterDelete = selectQualifications.filter(
      (qualification) => qualification.label.toLowerCase() !== label.toLowerCase()
    );
    setSelectQualifications(qualificationsAfterDelete);
    onChange(qualificationsAfterDelete);
  };

  const handleSelect = (value) => {
    const alreadySelected = selectQualifications.some((qualification) => qualification.value === value);

    if (alreadySelected) {
      message.error("Qualification already selected");
      return;
    }

    const selectedQualification = fetchedQualifications.find((qualification) => qualification.value === value);
    const newQualification = selectedQualification || { label: value, value };

    setSelectQualifications([...selectQualifications, newQualification]);
    setSearchValue("");
    setChoices(fetchedQualifications);
    onChange([...selectQualifications, newQualification]);
  };

  return (
    <div className="flex flex-row">
      <Spin spinning={loading}>
        <KeyHighlightsListItem key={"1"} title={title} value={null} />
        <div className="flex flex-wrap gap-1 w-full mt-2 items-start">
          {selectQualifications.map((data) => (
            <Tag
              val={data.value}
              key={data.label}
              close={true}
              onClick={() => handleDelete(data.label)}
            />
          ))}
        </div>

        < AutoComplete
          allowClear
          onSearch={handleSearch}
          onSelect={handleSelect}
          options={options}
          placeholder="Search for qualification"
          value={searchValue}
          className="w-[12rem] mt-7 md:mt-5 h-10 bg-black focus:shadow-none border rounded-md"
        />
      </Spin>
    </div>
  );
};

const SpecializationSelector = ({
  defaultSpecializations = [],
  onChange = () => {},
  title = "",
}) => {
  const [selectSpecializations, setSelectSpecializations] = useState(defaultSpecializations);
  const [options, setChoices] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [fetchedSpecializations, setFetchedSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllSpecializations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8087/qualifications/");
      // console.log(res.data);
      
      if (res.data) {
        const allValues = Object.values(res.data).flat();4

        const uniqueValues = Array.from(new Set(allValues));
        
        const fetchedOptions = uniqueValues.map((specialization) => ({
          label: specialization,
          value: specialization,
        }));

        // console.log("Allvalues", fetchedOptions);
        setChoices(fetchedOptions);
        setFetchedSpecializations(fetchedOptions);
      } else {
        message.error("Something went wrong");
      }
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSpecializations();
  }, []);

  const handleSearch = (value) => {
    setSearchValue(value);
    const filteredOptions = fetchedSpecializations
      .filter((specialization) =>
        specialization.label.toLowerCase().includes(value.toLowerCase())
      )
      .map((specialization) => ({
        label: specialization.label,
        value: specialization.value,
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
    const specializationsAfterDelete = selectSpecializations.filter(
      (specialization) => specialization.label.toLowerCase() !== label.toLowerCase()
    );
    setSelectSpecializations(specializationsAfterDelete);
    onChange(specializationsAfterDelete);
  };

  const handleSelect = (value) => {
    const alreadySelected = selectSpecializations.some(
      (specialization) => specialization.value === value
    );

    if (alreadySelected) {
      message.error("Specialization already selected");
      return;
    }

    const selectedSpecialization = fetchedSpecializations.find(
      (specialization) => specialization.value === value
    );
    const newSpecialization = selectedSpecialization || { label: value, value };

    setSelectSpecializations([...selectSpecializations, newSpecialization]);
    setSearchValue("");
    setChoices(fetchedSpecializations);
    onChange([...selectSpecializations, newSpecialization]);
  };

  return (
    <div className="flex flex-row">
      <Spin spinning={loading}>
        <KeyHighlightsListItem key={"1"} title={title} value={null} />
        <div className="flex flex-wrap gap-1 w-full mt-2 items-start">
          {selectSpecializations.map((data) => (
            <Tag
              val={data.value}
              key={data.label}
              close={true}
              onClick={() => handleDelete(data.label)}
            />
          ))}
        </div>

        < AutoComplete
          allowClear
          onSearch={handleSearch}
          onSelect={handleSelect}
          options={options}
          placeholder="Search for specialization"
          value={searchValue}
          className="w-[12rem] bg-black mt-7 md:mt-5 h-10 focus:shadow-none border rounded-md"
        />
      </Spin>
    </div>
  );
};

const JobApplicationProviderView = () => {
  const [saved, setSaved] = useState(false);
  const { jobs, setJobs } = useJobContext();
  const { userRole } = React.useContext(AuthContext);
  
  const [currency, setCurrency] = useState({ value: 'INR', label: 'INR' });
  const [isOptionalChecked, setIsOptionalChecked] = useState(false); 
  const [jobDetails, setJobDetails] = useState({
    title: "",
    companyName: "Google",
    vacancy: "",
    postedBy: "",
    location: "",
    description: "",
    experience: "",
    department: "",
    job_role: "",
    salaryMin: "",
    salaryMax: "",
    experienceMin: "",
    experienceMax: "",
    type: "",
    specification: [],
    qualification: [],
    must_skills: [],
    other_skills: [],
  });

  useEffect(() => {
    if (isOptionalChecked) {
      setJobDetails((prev) => ({ ...prev, other_skills: [...prev.must_skills] }));
    }
  }, [jobDetails.must_skills, isOptionalChecked]);

  const [location, setLocation] = useState(null);
  const [locationsList, setLocationsList] = useState(jobLocations);

  const [jobType, setJobType] = useState(null);
  const [jobTypeList, setJobTypeList] = useState(jobTypes);

  const handleLocationChange = (selectedOption) => {
    setLocation(selectedOption);
    // Add new location if it's not already in the list
    if (selectedOption && !locationsList.find(loc => loc.value === selectedOption.value)) {
      setLocationsList([...locationsList, selectedOption]);
    }
  };

  const handleJobTypeChange = (selectedOption) => {
    setJobType(selectedOption);
    // Add new job type if it's not already in the list
    if (selectedOption && !jobTypeList.find(loc => loc.value === selectedOption.value)) {
      setJobTypeList([...jobTypeList, selectedOption]);
    }
  };

  const currencyOptions = [
    { value: 'INR', label: 'INR' },
    { value: 'USD', label: 'USD ' },
  ];

  const navigate = useNavigate();

  const handleSaveClick = async(jobDetails) => {
    if (!jobDetails.title || !jobDetails.companyName || !jobDetails.description) {
      message.error("Please enter all details");
      return;
    }
    const response = await axiosInstance.post('/jobs/create', jobDetails);
    console.log("RESPONSE:", response.data);
    return response.data;
    setSaved((prev) => !prev);
    navigate(-1);
  };

  const handleBackClick = () => {
    navigate(-1);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmploymentChange = (e) => {
    setJobDetails((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleOptionalChange = (e) => {
    setIsOptionalChecked(e.target.checked);
    if (e.target.checked) {
      setJobDetails((prev) => ({ ...prev, other_skills: [...prev.must_skills] }));
    } else {
      setJobDetails((prev) => ({ ...prev, other_skills: [] }));
    }
  };

  // Define the mutation function
  const submitJobApplication = async (jobDetails) => {
    const response = await axiosInstance.post('/jobs/create', jobDetails);
    console.log("RESPONSE:", response.data);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: submitJobApplication,
    onSuccess: (data) => {
      console.log(data);
      window.replace('/provider/main');
      console.log('Job posted successfully:', data);
    },
    onError: (error) => {
      const { message } = error.response.data;
      console.log(message);
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jobDetails.title && jobDetails.companyName  && jobDetails.description) {
      const newJob = {
        ...jobDetails,
        currency: currency ? currency.value : 'INR',
      };
      setJobs((prevJobs) => [...prevJobs, newJob]);
      console.log("New Jobs added:" , newJob);
 
    setJobDetails({
      title: "",
      companyName: "Google",
      vacancy: "",
      postedBy: "",
      location: "",
      description: "",
      experience: "",
      department: "",
      job_role: "",
      salaryMin: "",
      salaryMax: "",
      experienceMin: "",
      experienceMax: "",
      type: "",
      specification: [],
      qualification: [],
      must_skills: [],
      other_skills: [],
    });

    mutation.mutate({
      title: jobDetails.title,
      description: jobDetails.description,
      vacancy: jobDetails.vacancy,
      experience: {
        min: jobDetails.experienceMin,
        max: jobDetails.experienceMax,
      },
      package: {
        min: jobDetails.salaryMin,
        max: jobDetails.salaryMax,
      },
      location: jobDetails.location,
      qualification: jobDetails.qualification,
      specification: jobDetails.specification,
      must_skills: jobDetails.must_skills,
      other_skills: jobDetails.other_skills,
      type: jobDetails.type,
      postedBy: jobDetails.postedBy,
      job_role: jobDetails.job_role,
    });
  }
};
    
    const handleViewClick = (job) => {
      navigate(`/provider/post-job/${job.id}`, { state: { job } }); // Set selected job to display the details
    };

  return (
    <MainContext>
      {/* Wrapper for the entire content */}
      <div className="w-full mx-auto min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10 flex flex-col gap-10">
        
        {/* Top Section: Company and Person Details */}
        <form onSubmit={handleSubmit} className="w-full lg:w-[55%] job-apply-section flex flex-col mx-auto relative">
          
            {/* Company and Person Details */}
            <div className="w-full rounded-xl h-fit bg-white p-5 md:p-5 font-outfit">
              <img 
                src="/Logo.png" 
                alt="Company Logo" 
                className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover mb-4 absolute top-4 right-4" 
              />
              <h1 className="text-[1.3rem] md:text-2xl font-bold">
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Job Title"
                  value={jobDetails.title}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </h1>
              <h1 className="text-[1.3rem] md:text-2xl font-semibold">
                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter Company Name"
                  value={jobDetails.companyName}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required readOnly
                />
              </h1>
              <h3 className="font-light mt-5">
                Posted by: 
                <input
                  type="text"
                  name="postedBy"
                  placeholder="Enter Provider Name"
                  value={jobDetails.postedBy}
                  onChange={handleChange}
                  className="w-full border rounded -lg p-2"
                  required
                />
              </h3>

              <div className="flex flex-col md:flex-row items-start">
                <div className="flex flex-col mt-4 w-full lg:w-[45%]">
                  <KeyHighlightsListItem key={"1"} title="Experience" value={null} />
                </div>
                <div className="flex flex-col md:flex-row w-full p-2 lg:w-[55%]">
                  <input
                    type="number"
                    name="experienceMin"
                    placeholder="Min Experience"
                    value={jobDetails.experienceMin}
                    onChange={handleChange}
                    className="w-full md:w-1/2 lg:w-full border rounded-lg p-2 mb-2 md:mb-0 md:mr-3"
                  />
                  <input
                    type="number"
                    name="experienceMax"
                    placeholder="Max Experience"
                    value={jobDetails.experienceMax}
                    onChange={handleChange}
                    className="w-full md:w-1/2 lg:w-full border rounded-lg p-2 mb-2 md:mb-0"
                  />
                </div>
              </div>

              <hr className="mt-4 mb-2" />
              <div className="flex flex-col justify-between items-start">
                <div>
                  <span>Vacancies: {jobs.vacancy}</span>
                    <input
                      type="number"
                      name="vacancy"
                      placeholder="Enter the vacancies"
                      value={jobDetails.vacancy}
                      onChange={handleChange}
                      className="border rounded-lg p-2"
                  />
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            {/* Qualification Section */}
            <div className="w-full rounded-xl ml-0 mb-8 h-fit bg-white p-5 mt-8 md:p-10 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">Qualifications</h1>
              <ul className="mt-3">
                {/* Required Qualification */}
                <li className="flex flex-col md:flex flex-col items-start mb-4">
                  <div className="w-full lg:w-full flex flex-col lg:flex-col gap-4 md:gap-2">
                    <QualificationSelector
                      defaultQualifications={jobDetails.qualification || []}
                      onChange={(selectedQualifications) => {
                        setJobDetails((prev) => ({
                          ...prev,
                          qualification: selectedQualifications,
                        }));
                      }}
                      title="Qualification"
                    />
                  </div>
                </li>

                <li className="flex flex-col md:flex flex-col items-start mb-4">
                  <div className="w-full lg:w-full flex flex-col lg:flex-col gap-4 md:gap-2">
                    <SpecializationSelector
                      defaultSpecializations={jobDetails.specification || []}
                      onChange={(selectedSpecializations) => {
                        setJobDetails((prev) => ({
                          ...prev,
                          specification: selectedSpecializations,
                        }));
                      }}
                      title="Specialization"
                    />
                  </div>
                </li>

                {/* Job Role */}
                <li className="flex flex-col md:flex flex-col items-start mb-4">
                <KeyHighlightsListItem key={"1-2"} title="Job Role" value={null} />
                <div className="lg:w-[12rem] flex flex-col lg:flex-col gap-4 md:gap-2 mt-5">
                  <Select
                    value={jobDetails.job_role ? { label: jobDetails.job_role, value: jobDetails.job_role } : null}
                    onChange={(selectedOption) => {
                      setJobDetails((prev) => ({
                        ...prev,
                        job_role: selectedOption ? selectedOption.value : ""
                      }));
                    }}
                    options={jobTypeList}
                    placeholder="Select Job Type"
                    isClearable
                    onInputChange={(inputValue) => {
                      if (inputValue && !jobTypeList.find(loc => loc.value === inputValue)) {
                        setJobTypeList([...jobTypeList, { label: inputValue, value: inputValue }]);
                      }
                    }}
                    noOptionsMessage={() => "Type to add a new Job Type"}
                    className="sm:w-[12rem] lg:w-[12rem] md:w-[12rem] xsl:w-[12rem] h-10 bg-black text-black focus:shadow-none border rounded-md"
                    styles={{
                      placeholder: (provided) => ({
                        ...provided,
                        fontSize: '0.9rem',
                        color: 'black',
                      }),
                    }}
                  />
                </div>
              </li>
              </ul>
            </div>

            {/* More Details */}
            <div className="w-full rounded-xl h-fit bg-white p-5 md:p-10 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">More Details</h1>
              <ul className="mt-3">

                {/* Location */}
                <li className="flex flex-col md:flex flex-col items-start mb-4">
                  <KeyHighlightsListItem
                    key={"1"}
                    title="Location"
                    value={null}
                  />
                  <div className="lg:w-[12rem] flex flex-col lg:flex-col gap-4 md:gap-2 mt-5">
                    <Select
                      value={jobDetails.location ? { label: jobDetails.location, value: jobDetails.location } : null}
                      onChange={(selectedOption) => {
                        setJobDetails((prev) => ({
                          ...prev,
                          location: selectedOption ? selectedOption.value : ""
                        }));
                      }}
                      options={locationsList}
                      placeholder="Enter Location"
                      isClearable
                      onInputChange={(inputValue) => {
                        if (inputValue && !locationsList.find(loc => loc.value === inputValue)) {
                          setLocationsList([...locationsList, { label: inputValue, value: inputValue }]);
                        }
                      }}
                      noOptionsMessage={() => "Type to add a new location"}
                      className="sm:w-[12rem] lg:w-[12rem] md:w-[12rem] xsm:w-[12rem] h-10 bg-black text-black focus:shadow-none border rounded-md cursor-pointer"
                      styles={{
                        placeholder: (provided) => ({
                          ...provided,
                          fontSize: '0.9rem',
                          color: 'black',
                        }),
                      }}
                    />
                  </div>
                </li>

                {/* Department */}
                <li className="flex flex-col md:flex-col items-start mb-4">
                  <div className="w-full lg:w-full flex flex-col lg:flex-row gap-4 md:gap-2">
                    <div className="flex flex-col mt-4 w-full lg:w-[55%]">
                      <KeyHighlightsListItem
                        key={"1"}
                        title="Department"
                        value={null}
                      />
                    </div>
                    <div className="flex flex-col w-full p-2 lg:w-[45%]">
                      <input
                        type="text"
                        name="department"
                        placeholder="Enter the Department"
                        value={jobDetails.department}
                        onChange={handleChange}
                        className="w-full md:w-auto border rounded-lg p-2"
                      />
                    </div>
                  </div>
                </li>

                {/* Employment Type */}
                <li className="flex flex-col mb-4 mt-8">
                  <KeyHighlightsListItem
                    key={'1-2'}
                    title="Employment Type"
                  />
                  <div className="flex flex-col mt-4">
                    {employmentOptions.map((option) => (
                      <label key={option.id} className="flex items-center mb-2 mx-7">
                        <input
                          type="radio"
                          name="employmentType"
                          value={option.label}
                          checked={jobDetails.type === option.label}
                          onChange={handleEmploymentChange}
                          className="mr-2 cursor-pointer accent-orange-600"
                          required
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </li>
      
                <li className="flex flex-col md:flex-row items-start mb-4">
                  <div className="w-full lg:w-full flex flex-col lg:flex-row gap-4 md:gap-2">
                    <div className="flex flex-col mt-4 w-full lg:w-[45%]">
                      <KeyHighlightsListItem key={"1-3"} title="Salary" value={null} />
                    </div>
                    <div className="flex flex-col md:flex-row w-full p-2 lg:w-[55%]">
                      <input
                        type="number"
                        name="salaryMin"
                        placeholder="Min Salary"
                        value={jobDetails.salaryMin}
                        onChange={handleChange}
                        className="w-full md:w-1/2 lg:w-full border rounded-lg p-2 mb-3 md:mb-0 md:mr-3"
                      />
                      <input
                        type="number"
                        name="salaryMax"
                        placeholder="Max Salary"
                        value={jobDetails.salaryMax}
                        onChange={handleChange}
                        className="w-full md:w-1/2 lg:w-full border rounded-lg p-2 mb-3 md:mb-0 md:mr-3"
                      />
                      <Select
                        value={currency}
                        onChange={setCurrency}
                        options={currencyOptions}
                        className="w-[10rem] md:w-1/2 lg:w-full font-outfit"
                      />
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Skills Section */}
            <div className="w-full rounded-xl ml-0 mb-8 h-fit bg-white p-5 mt-8 md:p-10 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">Skills</h1>
              <ul className="mt-3">
                {/* Required Skills */}
                <li className="flex flex-col md:flex-row mb-4">
                  <div className="flex flex-col w-auto md:ml-4 mt-2 w-full md:w-auto">
                    <SkillSelector
                      defaultSkills={jobDetails.must_skills || []}
                      onChange={(selectedSkills) => {
                        setJobDetails((prev) => ({
                          ...prev,
                          must_skills: selectedSkills,
                        }));
                      }}
                      title="Required Skills"
                      other_skills={jobDetails.other_skills || []}
                      setOptionalSkills={(must_skills) => setJobDetails((prev) => ({ ...prev, other_skills: must_skills }))}
                    />
                  </div>
                </li>
                {/* Optional Skills */}
                <li className="flex flex-col md:flex-row mb-4">
                  <div className="flex flex-col w-auto md:ml-4 mt-2 w-full md:w-auto">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="copy-skills-checkbox"
                        checked={isOptionalChecked}
                        onChange={handleOptionalChange}
                      />
                      <label htmlFor="copy-skills-checkbox" className="ml-2">
                        Copy Required Skills to Optional Skills
                      </label>
                    </div>

                    {/* Conditional Skill Selector for Optional Skills */}
                    {!isOptionalChecked && (
                      <SkillSelector
                        defaultSkills={jobDetails.other_skills || []} 
                        onChange={(selectedSkills) => {
                          setJobDetails((prev) => ({
                            ...prev,
                            other_skills: selectedSkills,
                          }));
                        }}
                        title="Optional Skills"
                        other_skills={jobDetails.other_skills || []}
                        setOptionalSkills={(must_skills) => setJobDetails((prev) => ({ ...prev, other_skills: must_skills }))}
                      />
                    )}
                  </div>
                </li>
              </ul>
            </div>

            <div className="w-full lg:w-full mt-5 md:mt-0 flex-1 flex flex-col gap-2 h-fit bg-white rounded-lg p-5 md:p-5">
              <h1 className="text-xl md:text-2xl font-outfit text-orange-600">
                About Company
              </h1>
              <div className="mt-4">
                <label className="block text-md ml-2 font-medium text-gray-800 font-outfit">
                  Job Description
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
        </form>
      </div>
    </MainContext>
  );
};

export default JobApplicationProviderView;