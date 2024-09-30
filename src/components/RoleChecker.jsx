import React, { useState } from "react";
import { motion } from "framer-motion";

const RoleChecker = ({
  data = ["User1", "User2"],
  defaultSelectedIndex,
  onChange = () => {},
  wrapperCustomClass="",
  itemClassName="",
  indicatorClassName=""
}) => {
  const [selectIndex, setSelectedIndex] = useState(defaultSelectedIndex || 0);
  const handleChange = (i, selectedData) => {
    setSelectedIndex(i);
    onChange({ i, selectedData });
  };
  return (
    <div className={"w-fit h-full p-2 flex center gap-2 " + (wrapperCustomClass)}>
      {data.map((d, i) => (
        <div
          className={"p-1 relative cursor-pointer "+itemClassName}
          key={i}
          onClick={() => handleChange(i, d)}
        >
          {d}{" "}
          {i === selectIndex && (
            <motion.div
              layoutId="underline"
              className={"absolute -bottom-1 h-1 w-full bg-orange-600  "+indicatorClassName}
            />
          )}{" "}
        </div>
      ))}
    </div>
  );
};

export default RoleChecker;
