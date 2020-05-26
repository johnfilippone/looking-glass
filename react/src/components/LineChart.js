import React from 'react';
import { Line } from 'react-chartjs-2';
import './LineChart.css';

function LineChart(props) {
    return (
        <div className='LineChart'>
            <Line {...props} />
        </div>
    );
}

export default LineChart;
