import React from 'react';
import './EventList.css';

function EventList(props: any) {
    let events = props.data;
    events = events.filter((event: any) => {
        const eventCompleteDate = new Date(event[4]);
        return eventCompleteDate >= props.startDate && eventCompleteDate < props.endDate && event[1] > props.significance;
    });

    const listItems = events.map((row: any) => {
        return <li>{row[0]}</li>;
    });
    return (
        <div className='EventList'>
            <div className='event-list-title'>{props.title}</div>
            <ul>{listItems} </ul>
        </div>
    );
}

export default EventList;
