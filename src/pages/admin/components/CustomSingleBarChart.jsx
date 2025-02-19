import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomSingleBarChart = ({ data, xAxisKey, barKey, barColor = "#8884d8" }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart 
          data={data} 
          margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} tick={{ fill: "#8884d8", fontSize: 12, fontWeight: "400" , }} />
          <YAxis tick={{ fill: "#82ca9d", fontSize: 12, fontStyle: "italic" }}/>
          <Tooltip cursor={{fill:"#5f728b80"}} />
          <Bar dataKey={barKey} fill={barColor} barSize={20}  />
        </BarChart>
      </ResponsiveContainer>
    </div>
    
  );
};

export default CustomSingleBarChart;
