import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const InputBox = ({
  name,
  value = "",
  type = "text",
  placeholder = "",
  icon = "",
  customClass = "",
  onChange = () => {},
  onBlur = () => {},
  disable = false,
  animate = true,
}) => {
  const [focused, setFocus] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(true);

  const handlePasswordVisible = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div
      className={
        "w-full p-3 border-gray  rounded-md  center bg-transition " +
        (animate ? (focused ? "bg-white " : "bg-gray-200 ") : "bg-white ") +
        customClass
      }
    >
      {icon ? icon : <></>}
      <input
        placeholder={placeholder}
        name={name}
        value={value ? value : ""}
        onChange={onChange}
        disabled={disable}
        type={
          type.toLowerCase() === "password"
            ? passwordVisible
              ? "password"
              : "text"
            : type
        }
        className={
          "flex-1 ml-2 flex text-gray-600  placeholder:text-black bg-transition " +
          (animate ? (focused ? "bg-white" : "bg-gray-200") : "bg-white") +
          (type.toLowerCase() === "password" ? " pr-2" : "")
        }
        onFocus={() => setFocus(true)}
        onBlur={(e) => {
          setFocus(false);
          onBlur(e);
        }}
      />

      {type.toLowerCase() === "password" ? (
        passwordVisible ? (
          <FaEye onClick={handlePasswordVisible} className="cursor-pointer" />
        ) : (
          <FaEyeSlash
            onClick={handlePasswordVisible}
            className="cursor-pointer"
          />
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default InputBox;
