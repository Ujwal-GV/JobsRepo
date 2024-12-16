import React from 'react'
import { Line } from '@ant-design/plots';
const LineChart = ({data,xAxis="x-axis",yAxis="y-axis"}) => {

const config = {
        data,
        xField: xAxis,
        yField: yAxis,
        point: {
          size: 6, // Marker size
          shape: 'circle', // Marker shape
          style: {
            fill: 'red', 
            stroke: 'red', 
            lineWidth: 2, 
          }
        },
        interaction: {
          tooltip: {
            marker: false,
          },
        },
        style: {
          lineWidth: 2,
          stroke: '#0c1a32'
        },
        animation: {
            appear: {
              animation: 'path-in', // The animation type
              duration: 4000, // Duration of the animation in milliseconds
              easing: 'easeInOut', // Easing function for the animation
            },
          },
      };

  return (
    <Line {...config} />
  )
}

export default LineChart
