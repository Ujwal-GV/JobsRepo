import React, { useState, useEffect } from "react";
import MainContext from "../../components/MainContext";
import { useJobContext } from '../../contexts/JobContext';
import { AuthContext } from '../../contexts/AuthContext';
import { FaCheckCircle, FaEye, FaTrash } from "react-icons/fa";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { useNavigate } from "react-router-dom";
import { industryOptions, employmentOptions, jobLocations } from "../../../assets/dummyDatas/Data"
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import styles for ReactQuill
import Select from "react-select";
import { AutoComplete, Spin, message } from "antd";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

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
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [fetchedSkills, setFetchedSkills] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchAllSkills = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8087/skills/");
      if (res.data) {
        setOptions(res.data);
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

    setOptions(filteredOptions);
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
    setOptions(fetchedSkills);
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
          className="w-full mt-7 md:mt-5 h-10 focus:shadow-none border rounded-md"
        />
      </Spin>
    </div>
  );
};

const QualificationSelector = ({ defaultQualifications = [], onChange = () => {}, title="" }) => {
  const [selectQualifications, setSelectQualifications] = useState(defaultQualifications);
  const [options, setOptions] = useState([]);
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
        setOptions(fetchedOptions);
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

    setOptions(filteredOptions);
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
      message.error("Category already selected");
      return;
    }

    const selectedQualification = fetchedQualifications.find((qualification) => qualification.value === value);
    const newQualification = selectedQualification || { label: value, value };

    setSelectQualifications([...selectQualifications, newQualification]);
    setSearchValue("");
    setOptions(fetchedQualifications);
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
          placeholder="Search for a category"
          value={searchValue}
          className="w-full mt-7 md:mt-5 h-10 bg-black focus:shadow-none border rounded-md"
        />
      </Spin>
    </div>
  );
};


const SubCategorySelector = ({
  defaultSubCategories = [],
  onChange = () => {},
  title = "",
}) => {
  const [selectSubCategories, setSelectSubCategories] = useState(defaultSubCategories);
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [fetchedSubCategories, setFetchedSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllSubCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8087/qualifications/");
      // console.log(res.data);
      
      if (res.data) {
        const allValues = Object.values(res.data).flat();4

        const uniqueValues = Array.from(new Set(allValues));
        
        const fetchedOptions = uniqueValues.map((subCategory) => ({
          label: subCategory,
          value: subCategory,
        }));

        // console.log("Allvalues", fetchedOptions);
        setOptions(fetchedOptions);
        setFetchedSubCategories(fetchedOptions);
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
    fetchAllSubCategories();
  }, []);

  const handleSearch = (value) => {
    setSearchValue(value);
    const filteredOptions = fetchedSubCategories
      .filter((subCategory) =>
        subCategory.label.toLowerCase().includes(value.toLowerCase())
      )
      .map((subCategory) => ({
        label: subCategory.label,
        value: subCategory.value,
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
    const subCategoriesAfterDelete = selectSubCategories.filter(
      (subCategory) => subCategory.label.toLowerCase() !== label.toLowerCase()
    );
    setSelectSubCategories(subCategoriesAfterDelete);
    onChange(subCategoriesAfterDelete);
  };

  const handleSelect = (value) => {
    const alreadySelected = selectSubCategories.some(
      (subCategory) => subCategory.value === value
    );

    if (alreadySelected) {
      message.error("Subcategory already selected");
      return;
    }

    const selectedSubCategory = fetchedSubCategories.find(
      (subCategory) => subCategory.value === value
    );
    const newSubCategory = selectedSubCategory || { label: value, value };

    setSelectSubCategories([...selectSubCategories, newSubCategory]);
    setSearchValue("");
    setOptions(fetchedSubCategories);
    onChange([...selectSubCategories, newSubCategory]);
  };

  return (
    <div className="flex flex-row">
      <Spin spinning={loading}>
        <KeyHighlightsListItem key={"1"} title={title} value={null} />
        <div className="flex flex-wrap gap-1 w-full mt-2 items-start">
          {selectSubCategories.map((data) => (
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
          placeholder="Search for a category"
          value={searchValue}
          className="w-full mt-7 md:mt-5 h-10 bg-black focus:shadow-none border rounded-md"
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
    providerName: "",
    // location: "",
    industry: "",
    jobDescription: "",
    experience: "",
    department: "",
    jobRole: "",
    employmentType: "",
    education: "",
    package: "",
    skills: [], // Initialize skills as an empty array
    optionalSkills: [], // Initialize optionalSkills as an empty array
  });

  useEffect(() => {
    if (isOptionalChecked) {
      setJobDetails((prev) => ({ ...prev, optionalSkills: [...prev.skills] }));
    }
  }, [jobDetails.skills, isOptionalChecked]);

  const [location, setLocation] = useState(null);
  const [locationsList, setLocationsList] = useState(jobLocations);

  const handleLocationChange = (selectedOption) => {
    setLocation(selectedOption);
    // Add new location if it's not already in the list
    if (selectedOption && !locationsList.find(loc => loc.value === selectedOption.value)) {
      setLocationsList([...locationsList, selectedOption]);
    }
  };

  const currencyOptions = [
    { value: 'INR', label: 'INR' },
    { value: 'USD', label: 'USD' },
  ];

  const navigate = useNavigate();

  const handleSaveClick = () => {
    if (!jobDetails.title || !jobDetails.companyName || !jobDetails.jobDescription) {
      alert("Please fill in all required fields: Job Title, Company Name, and Job Description.");
      return;
    }
    setSaved((prev) => !prev);
    navigate(-1);
  };

  const handleBackClick = () => {
    navigate(-1);
  }

  // const handleDeleteClick = (id) => {
  //   const updatedJobs = jobs.filter((job) => job.id !== id);
  //   setJobs(updatedJobs);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleIndustryChange = (e) => {
    setJobDetails((prev) => ({ ...prev, industry: e.target.value }));
  };

  const handleEmploymentChange = (e) => {
    setJobDetails((prev) => ({ ...prev, employmentType: e.target.value }));
  };

  const handleOptionalChange = (e) => {
    setIsOptionalChecked(e.target.checked);
    if (e.target.checked) {
      setJobDetails((prev) => ({ ...prev, optionalSkills: [...prev.skills] }));
    } else {
      setJobDetails((prev) => ({ ...prev, optionalSkills: [] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jobDetails.title && jobDetails.companyName  && jobDetails.jobDescription) {
      const newJob = {
        ...jobDetails,
        currency: currency ? currency.value : 'INR',
        id: Math.random().toString(36).substring(7),
        applicationId: "APP-" + Math.floor(100000 + Math.random() * 900000), // Generate unique Application ID
      };
      setJobs((prevJobs) => [...prevJobs, newJob]);
      console.log("New Jobs added:" , newJob);
      
      setJobDetails({
        title: "",
        companyName: "",
        providerName: "",
        // location: "",
        industry: "",
        jobDescription: "",
        experience: "",
        department: "",
        jobRole: "",
        employmentType: "",
        education: "",
        package: "",
        skills: [], // Reset skills
        optionalSkills: [], // Reset optionalSkills
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
                  name="providerName"
                  placeholder="Enter Provider Name"
                  value={jobDetails.providerName}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </h3>

              <div className="flex items-center gap-2 mt-3">
                <span className="font-light">Experience:</span>
                <input
                  type="text"
                  name="experience"
                  placeholder="Enter Experience (in years)"
                  value={jobDetails.experience}
                  onChange={handleChange}
                  className="border rounded-lg p-2"
                  required
                />
                {/* <VerticalBar /> */}
                {/* <span>Posted Jobs: {jobs.length}</span> */}
              </div>

              <hr className="mt-10 mb-2" />
              <div className="flex flex-col justify-between items-start">
                <div>
                  <span>Vacancies: {jobs.vacancies}</span>
                    <input
                      type="number"
                      name="vacancies"
                      placeholder="Enter the vacancies"
                      value={jobDetails.vacancies}
                      onChange={handleChange}
                      className="border rounded-lg p-2"
                  />
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            {/* <div className="w-full rounded-xl mt-8 h-fit bg-white p-5 md:p-10 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">Key Highlights</h1>
              <ul className="mt-3">
                Industry
                {/* <li className="flex flex-col mb-4 mt-4">
                  <KeyHighlightsListItem
                    key={'1-1'}
                    title="Industry"
                  />
                  <div className="flex flex-col mt-4">
                    {industryOptions.map((option) => (
                      <label key={option.id} className="flex items-center mb-2 mx-7">
                        <input
                          type="radio"
                          name="industry"
                          value={option.label}
                          checked={jobDetails.industry === option.label}
                          onChange={handleIndustryChange}
                          className="mr-2 cursor-pointer accent-orange-600"
                          required
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </li>
              </ul>
            </div> */}

            {/* Qualification Section */}
            <div className="w-full rounded-xl ml-0 mb-8 h-fit bg-white p-5 mt-8 md:p-10 font-outfit">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">Qualifications</h1>
              <ul className="mt-3">
                {/* Required Qualification */}
                <li className="flex flex-col md:flex flex-col items-start mb-4">
                  <div className="w-full lg:w-full flex flex-col lg:flex-col gap-4 md:gap-2">
                    <QualificationSelector
                      defaultQualifications={jobDetails.qualifications || []}
                      onChange={(selectedQualifications) => {
                        setJobDetails((prev) => ({
                          ...prev,
                          qualifications: selectedQualifications,
                        }));
                      }}
                      title="Category"
                    />
                  </div>
                </li>

                <li className="flex flex-col md:flex flex-col items-start mb-4">
                  <div className="w-full lg:w-full flex flex-col lg:flex-col gap-4 md:gap-2">
                    <SubCategorySelector
                      defaultSubCategories={jobDetails.subCategories || []}
                      onChange={(selectedSubCategories) => {
                        setJobDetails((prev) => ({
                          ...prev,
                          subCategories: selectedSubCategories,
                        }));
                      }}
                      title="Sub Category"
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
                <li className="flex flex-col md:flex-row mb-4">
                  <KeyHighlightsListItem
                    key={"1"}
                    title="Location"
                    value={null}
                  />
                  <div className="flex flex-col w-auto md:ml-4 mt-2 w-full md:w-auto">
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
                      className="w-auto md:w-auto lg:w-auto sm:w-auto border rounded-lg cursor-pointer"
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

                {/* Role */}
                <li className="flex flex-col md:flex-col items-start mb-4">
                  <div className="w-full lg:w-full flex flex-col lg:flex-row gap-4 md:gap-2">
                    <div className="flex flex-col mt-4 w-full lg:w-[55%]">
                      <KeyHighlightsListItem
                        key={"1-1"}
                        title="Role"
                        value={null}
                      />
                    </div>
                    <div className="flex flex-col w-full p-2 lg:w-[45%]">
                      <input
                        type="text"
                        name="jobRole"
                        placeholder="Enter the Job Role / Title"
                        value={jobDetails.jobRole}
                        onChange={handleChange}
                        className="w-full md:w-auto border rounded-lg p-2"
                      />
                    </div>
                  </div>
                </li>

                {/* Employment Type */}
                <li className="flex flex-col mb-4 mt-8">
                  <KeyHighlightsListItem
                    key={'1-3'}
                    title="Employment Type"
                  />
                  <div className="flex flex-col mt-4">
                    {employmentOptions.map((option) => (
                      <label key={option.id} className="flex items-center mb-2 mx-7">
                        <input
                          type="radio"
                          name="employmentType"
                          value={option.label}
                          checked={jobDetails.employmentType === option.label}
                          onChange={handleEmploymentChange}
                          className="mr-2 cursor-pointer accent-orange-600"
                          required
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </li>

                {/* Package */}
                <li className="flex flex-col md:flex-row items-start mb-4">
                  <div className="w-full lg:w-ful flex flex-col lg:flex-row gap-4 md:gap-2 ">
                    <div className="flex flex-col mt-4 w-[1/2] lg:w-[45%]">
                      <KeyHighlightsListItem
                        key={"1-4"}
                        title="Package"
                        value={null}
                      />
                    </div>
                    <div className="flex flex-col md:flex flex-row w-3/4 p-2 lg:w-[55%]">
                      <input
                        type="text"
                        name="package"
                        placeholder="Enter the Package"
                        value={jobDetails.package}
                        onChange={handleChange}
                        className="w-full md:w-full border rounded-lg p-2 mb-3 md:mb-0 md:mr-3"
                      />
                      <Select
                        value={currency}
                        onChange={setCurrency}
                        options={currencyOptions}
                        className="w-full mt-2 md:w-1/2 sm:w-1/4 font-outfit"
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
                      defaultSkills={jobDetails.skills || []}
                      onChange={(selectedSkills) => {
                        setJobDetails((prev) => ({
                          ...prev,
                          skills: selectedSkills,
                        }));
                      }}
                      title="Required Skills"
                      optionalSkills={jobDetails.optionalSkills || []}
                      setOptionalSkills={(skills) => setJobDetails((prev) => ({ ...prev, optionalSkills: skills }))}
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
                        defaultSkills={jobDetails.optionalSkills || []} // Default to current optional skills
                        onChange={(selectedSkills) => {
                          setJobDetails((prev) => ({
                            ...prev,
                            optionalSkills: selectedSkills,
                          }));
                        }}
                        title="Optional Skills"
                        optionalSkills={jobDetails.optionalSkills || []}
                        setOptionalSkills={(skills) => setJobDetails((prev) => ({ ...prev, optionalSkills: skills }))}
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
                    value={jobDetails.jobDescription}
                    onChange={(content) => setJobDetails((prev) => ({ ...prev, jobDescription: content }))}
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