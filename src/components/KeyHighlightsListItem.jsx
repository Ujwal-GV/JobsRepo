import React from "react";
import { SiListmonk } from "react-icons/si";

const KeyHighlightsListItem = ({ title = "", value = "" ,icon="" }) => {
  return (
    <li className="flex items-center justify-start">
     {
      icon ?  icon   :  <SiListmonk className="mr-2 text-orange-600" />
     }
      <span className="font-semibold">{title ? `${title} :` :""}</span> <span className="ms-1">{value}</span>
    </li>
  );
};

export default KeyHighlightsListItem;
