import React, { useState } from 'react';
import { Select } from 'antd';

const CustomAutoComplete
= ({
  placeholder,
  name,
  value,
  onChange=()=>{},
  disable,
  options,
  customClass = '',
  animate = false,
  icon,
  loading
}) => {
  const [focused, setFocus] = useState(false);
  
  const onSelectChange = (value) => {
    onChange(value); // Call the onChange function passed as prop
  };

  return (
    <div
      className={
        "w-full  border-gray rounded-md center bg-transition " +
        (animate ? (focused ? "bg-white " : "bg-gray-200 ") : "bg-white ") +
        customClass
      }
    >
      {icon ? icon : <></>}

      <Select
        loading={loading}
        allowClear
        onClear={()=>onChange("")}
        className={`w-full custom-select  h-11`} // Add the custom class here
        placeholder={placeholder}
        name={name}
        value={value}
        variant='borderless'
        onChange={onSelectChange}
        disabled={disable}
        showSearch
        options={options} // Pass the options prop
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </div>
  );
};




export default CustomAutoComplete
