import React, { useState } from "react";
import SeekerTable from "./components/SeekerTable";

const AdminUserControlPanel = () => {

  const tablesTypes = ["Seekers","Providers","Freelancers"]

  const [activeTable, setActiveTable] = useState("Seekers");

  const handleActiveTableChange = (table) => {
    setActiveTable(table);
  };

  return (
    <>
      <article className="w-full p-4">
        <h1 className="text-[2.2rem] text-center">Users List</h1>
        <div className="w-full flex justify-center items-center gap-3">
          
          {
           tablesTypes.map((table,idx)=>{
            return (<button key={idx}
              className={"px-3 py-1 rounded-lg "+(activeTable ===table ? "bg-[#0c1a32] text-white " :"")}
              onClick={() => handleActiveTableChange(table)}
            >
              {table}
            </button>)
           })   
          }
        </div>
      </article>

      <section className="w-full p-4">
       
         <SeekerTable/>
      </section>
    </>
  );
};

export default AdminUserControlPanel;
