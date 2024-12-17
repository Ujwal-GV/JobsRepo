import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [ "#EC4899", "#10B981","#6366F1", "#885CF6",];

const CustomPieChart = ({data}) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label //Outspread values
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;


const CustomLegend = ({ payload }) => {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }} className="flex justify-center items-center gap-[6px]">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
          {/* Circle marker */}
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%", // Makes the marker circular
              backgroundColor: entry.color,
              marginRight: "1px",
            }}
          ></div>
          <span className="text-white font-thin" style={{ fontSize: "11px", }}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};
