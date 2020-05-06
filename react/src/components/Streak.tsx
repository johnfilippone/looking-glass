import React from 'react';
import './Streak.css';

// TODO add condition; right now it counts toward the streak as long as there is any entry for the date
// expects dates to be sorted in decending order and to not have date duplicates
function Streak(props: any) {
    let streak = 0;
    let activeStreak = true;
    let lookbackNumerator = 0;
    let lookbackCount = 0;
    let currentDay = new Date();
    currentDay.setDate(currentDay.getDate() - 1);
    const datesAreOnSameDay = (first: any, second: any) => {
        return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
    };

    for (let i = 0; i < props.dates.length; i++) {
        // Make sure we are looking at a date before today
        const dateEntry = new Date(props.dates[i]);
        if (!dateEntry || dateEntry.toString() === 'Invalid Date' || dateEntry > currentDay) continue;

        // Stop looking if we already reached the max lookback days
        if (lookbackCount > props.lookback) break;
        lookbackCount++;

        if (datesAreOnSameDay(dateEntry, currentDay)) {
            if (activeStreak) streak++;
            lookbackNumerator++;
        } else {
            activeStreak = false;
        }

        currentDay.setDate(currentDay.getDate() - 1);
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
