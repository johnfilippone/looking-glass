import React from 'react';
import './Countdown.css';

const msPerDay = 86400000;

function Countdown(props: any) {
    const timestampDifference = props.date - Date.now();
    let daysLeft = timestampDifference <= 0 ? 0 : Math.ceil(timestampDifference/msPerDay);
    return (
        <div className="Countdown">
            <div className="countdown-title">{props.title}</div>
            <div className="countdown-number">{daysLeft}</div>
        </div>
    );
}

export default Countdown;
