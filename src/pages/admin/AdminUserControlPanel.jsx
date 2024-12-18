import React, { useState } from "react";
import SeekerTable from "./components/SeekerTable";
import ProviderTable from "./components/ProviderTable";
import FreelancerTable from "./components/FreelancerTable";

const AdminUserControlPanel = () => {

  const tablesTypes = ["Seekers","Providers","Freelancers"]

  const [activeTable, setActiveTable] = useState("Seekers");

  const handleActiveTableChange = (table) => {
    setActiveTable(table);
  };

  return (
    <>
      <article className="w-full p-4">
        <h1 className="text-[2.2rem] text-center text-white">Users List</h1>
        <div className="w-full flex justify-center items-center gap-3">
          
          {
           tablesTypes.map((table,idx)=>{
            return (<button key={idx}
              className={"px-3 py-1 rounded-lg text-white "+(activeTable ===table ? "bg-gray-800 bg-opacity-50 text-white border border-gray-700 " :"")}
              onClick={() => handleActiveTableChange(table)}
            >
              {table}
            </button>)
           })   
          }
        </div>
      </article>

      <section className="w-full p-4 bg-gray-800 bg-opacity-50 text-gray-200">
       
       {
         activeTable === "Seekers" ?  <SeekerTable/> : null
       }

       {
         activeTable === "Providers" ?  <ProviderTable/> : null
       }

       {
         activeTable === "Freelancers" ?  <FreelancerTable/> : null
       }
        
      </section>
    </>
  );
};

export default AdminUserControlPanel;
