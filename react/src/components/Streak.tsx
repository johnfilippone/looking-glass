import React from 'react';
import './Streak.css';

// TODO currently this is dependent on getting mm/dd/yyyy date format from the spreadsheet
function Streak(props: any) {
    let currentDay = new Date();
    currentDay.setDate(currentDay.getDate() - 1);

    let dateMap = {} as any;
    for (let i = 0; i < props.dates.length; i++) {
        const dateEntry = new Date(props.dates[i]);
        if (!dateEntry || dateEntry.toString() === 'Invalid Date' || dateEntry > currentDay) continue;
        dateMap[props.dates[i]] = true;
    }

    let streak = 0;
    let activeStreak = true;
    let lookbackNumerator = 0;
    let lookbackCount = 0;
    while (lookbackCount < props.lookback || activeStreak) {
        lookbackCount++;
        let formattedCurrentDay = (currentDay.getMonth() + 1) + '/' + currentDay.getDate() + '/' +  currentDay.getFullYear();
        if (dateMap.hasOwnProperty(formattedCurrentDay)) {
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
            <div className='streak-retro'>{lookbackNumerator}/{props.lookback}</div>
        </div>
    );
}

export default Streak;
