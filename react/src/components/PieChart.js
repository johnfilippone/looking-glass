import React from 'react';
import { Pie } from 'react-chartjs-2';
import './PieChart.css';

function PieChart(props) {
    return (
        <div className='PieChart'>
            <Pie {...props} />
        </div>
    );
}

export default PieChart;

