import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from "chart.js";
import Chart from 'chart.js/auto';

const BarChartComponent = ({ data, options }) => {
    return <Bar data={data} options={options} />;
};

export default BarChartComponent;
