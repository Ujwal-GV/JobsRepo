import React, { useRef } from "react";

const AdvanceProfileAvathar = ({ className }) => {

    const fileInput = useRef()

    const handleOpenFile = ()=>{
        fileInput.current.click();
    }

  return (
    <div
      className={"w-full h-full flex rounded-full bg-red-500 overflow-hidden cursor-pointer"}
      onClick={handleOpenFile}
    >
        <input type="file"  className="hidden" ref={fileInput}/>
      <img
        src="https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8="
        alt=""
        className="w-full h-full object-cover"
      />

    </div>
  );
};

export default AdvanceProfileAvathar;
