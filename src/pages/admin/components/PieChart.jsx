import React from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';

const PieChart = ({data}) => {
  const config = {
    data,
    angleField: 'users',
    colorField: 'date',
    label: {
      text: 'users',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
    height: 550,
    width: 550,
  };
  return <Pie {...config} />;
};

export default PieChart


