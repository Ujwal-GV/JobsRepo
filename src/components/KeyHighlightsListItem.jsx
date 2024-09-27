import React from "react";
import { SiListmonk } from "react-icons/si";

const KeyHighlightsListItem = ({ title = "", value = "" }) => {
  return (
    <li className="flex items-center justify-start">
      <SiListmonk className="mr-2 text-orange-600" />
      <span className="font-semibold">{title} :</span> <span className="ms-1">{value}</span>
    </li>
  );
};

export default KeyHighlightsListItem;
