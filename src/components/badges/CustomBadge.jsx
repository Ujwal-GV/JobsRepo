import React from "react";

const CustomBadge = ({
  text = "badge",
  bgcolor = "orange",
  text_color = "white",
}) => {
  return (
    <div
      className={`p-[2px] md:p-1 rounded-full w-fit text-[0.6rem] md:text-[0.7rem] border-[1px]`}
      style={{ color: text_color, background: bgcolor ,borderColor:text_color}}
    >
      {text}
    </div>
  );
};

export default CustomBadge;
