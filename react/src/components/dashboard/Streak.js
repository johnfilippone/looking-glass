import React from 'react';
import './Streak.css';

// expects dates to be sorted in decending order and to not have date duplicates
function Streak(props) {
    let streak = 0;
    let activeStreak = true;
    let lookbackNumerator = 0;
    let lookbackCount = 0;
    let currentDay = new Date();
    currentDay.setDate(currentDay.getDate());
    const datesAreOnSameDay = (first, second) => {
        return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
    };

    for (let i = 0; i < props.data.length; i++) {
        // Make sure we are looking at a date before today
        const dateEntry = new Date(props.data[i][0]);
        if (!dateEntry || dateEntry.toString() === 'Invalid Date' || dateEntry > currentDay) continue;

        // Update the current day until it equals the entry we are looking at
        while (!datesAreOnSameDay(dateEntry, currentDay)) {
            currentDay.setDate(currentDay.getDate() - 1);
            lookbackCount++;
        }

        // Stop looking if we already reached the max lookback days
        if (lookbackCount >= props.lookback) break;

        if (props.condition(props.data[i])) {
            if (activeStreak) streak++;
            lookbackNumerator++;
        } else {
            activeStreak = false;
        }

    }

    return (
        <div className='Streak'>
            <div className='streak-title'>{props.title}</div>
            <div className='streak-number'>{streak}</div>
            <div className='streak-lookback'>{lookbackNumerator}/{props.lookback}</div>
        </div>
    );
}

export default Streak;
