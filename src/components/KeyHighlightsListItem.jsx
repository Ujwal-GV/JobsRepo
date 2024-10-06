import React from "react";
import { SiListmonk } from "react-icons/si";

const KeyHighlightsListItem = ({ title = "", value = "" ,icon="", margin="0" }) => {
  return (
    <li className="flex items-center justify-start">
     {
      icon ?  icon   :  <SiListmonk className="mr-2 text-orange-600" />
     }
      <span className="font-semibold">{title ? `${title} :` :""}</span> <span className={`ms-1 md:m-${margin}`}>{value}</span>
    </li>
  );
};

export default KeyHighlightsListItem;
