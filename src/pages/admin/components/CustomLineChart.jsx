import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomLineChart = ({ data, xAxis = "x-axis", yAxis = "y-axis" }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        {/* Grid for better visualization */}
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        
        {/* X-Axis configuration */}
        <XAxis 
          dataKey={xAxis} 
          tick={{ fontSize: 12, fill: '#0c1a32' }} 
          stroke="#0c1a32" 
        />
        
        {/* Y-Axis configuration */}
        <YAxis 
          tick={{ fontSize: 12, fill: '#0c1a32' }} 
          stroke="#0c1a32" 
        />
        
        {/* Tooltip for showing details on hover */}
        <Tooltip 
          contentStyle={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }} 
          itemStyle={{ color: '#0c1a32' }} 
        />
        
        {/* Line with points */}
        <Line
          type="monotone"
          dataKey={yAxis}
          stroke="#0c1a32"
          strokeWidth={2}
          activeDot={{ r: 8 }} // Enlarged active dot on hover
          dot={{ r: 4, fill: 'red', stroke: 'red', strokeWidth: 2 }} // Custom style for dots
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
