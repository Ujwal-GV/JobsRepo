import { createContext, useContext, useState } from 'react';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  const [links, setLinks] = useState({
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",
  });
  const [summary, setSummary] = useState([]);

  const updateLinks = (newLinks) => {
    setLinks(newLinks);
  };

  const updateSummary = (newSummary) => {
    setSummary(newSummary);
  };

  return (
    <JobContext.Provider value={{ 
        jobs, 
        setJobs,
        links,
        summary,
        updateLinks,
        updateSummary,
       }}>
      {children}
    </JobContext.Provider>
  );
};

// Custom hook maintained for easier context usage
export const useJobContext = () => {
  return useContext(JobContext);
};
