import React from "react";
import { SiListmonk } from "react-icons/si";

const KeyHighlightsListItem = ({
  title = "",
  value = "",
  icon = "",
  margin = "0",
  className ,
  valueClasses
}) => {
  return (
    <li className={"flex items-start justify-start "+className}>
      <span className="font-semibold text-nowrap flex center gap-1">
        {icon ? icon : <SiListmonk className="mr-0 md:mr-1 text-orange-600 text-sm" />}
        {title ? `${title} :` : ""}
      </span>{" "}
      <span className={`ms-1 md:m-${margin} `+ valueClasses}>{value}</span>
    </li>
  );
};

export default KeyHighlightsListItem;
