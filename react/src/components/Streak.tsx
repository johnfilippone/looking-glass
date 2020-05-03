import React from 'react';
import './Streak.css';

function Streak(props: any) {
    return (
        <div className="Streak">
            <div className="streak-title">{props.title}</div>
            <div className="streak-number">{props.streak}</div>
            <div className="streak-retro">{props.retroNumerator}/{props.retroDenominator}</div>
        </div>
    );
}

export default Streak;

