import React from 'react';
import './DailyProgress.css';

function DailyProgress(props: any) {
    let valueString = '';
    let value = 0;
    if (props.data.length > 0) {
        const parameterIndex = props.data[0].indexOf(props.parameter);
        const today = new Date();
        const formattedDate = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();
        for (let i = 0; i < props.data.length; i++) {
            const rowLabel = props.data[i][0];
            if (rowLabel !== formattedDate + ' Total') continue;
            valueString = props.data[i][parameterIndex];
            // TODO make this conversion a utility function (may not be needed if using a database)
            if (valueString.split(':').length === 3) {
                const components = valueString.split(':');
                value = (+components[0]) * 60 * 60 + (+components[1]) * 60 + (+components[2]);
            } else {
                value = parseFloat(valueString.replace('$', '').replace('%', ''));
            }
            break;
        }
    }

    let progress = 0;
    if (value > props.goal) {
        progress = 1;
    } else if (value < 0) {
        progress = 0;
    } else {
        progress = value / props.goal
    }
    const dashOffset = props.width - (progress * props.width);

    return (
        <div className='DailyProgress'>
            <div className='daily-progress-title'>{props.title}</div>
            <div className='daily-progress-value'>{value} out of {props.goal} {props.unit}</div>
            <svg width={props.width} height={props.height}>
                <path
                    className="bg"
                    stroke="#ccc"
                    d={`M0 ${props.height/2}, ${props.width} ${props.height/2}`} style={{strokeWidth: props.height}}>
                </path>
                <path
                    className="meter"
                    stroke="#09c"
                    d={`M0 ${props.height/2}, ${props.width} ${props.height/2}`} style={{strokeWidth: props.height, strokeDasharray: props.width, strokeDashoffset: dashOffset}}>
                </path>
            </svg>
        </div>
    );
}

export default DailyProgress;

