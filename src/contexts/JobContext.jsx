import { createContext, useContext, useState } from 'react';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [links, setLinks] = useState({
    website: "",
  });
  const [summary, setSummary] = useState([]);

  return (
    <JobContext.Provider value={{ 
        jobs, 
        setJobs,
        links,
        setLinks,
        summary,
        setSummary,
    }}>
      {children}
    </JobContext.Provider>
  );
};

// Custom hook for easier context usage
export const useJobContext = () => {
  return useContext(JobContext);
};