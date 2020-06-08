import React from 'react';
import ContextMenu from '../ContextMenu';
import './Web.css';

function Web(props) {
    return (
        <div className='Web' onClick={props.clickListener} onContextMenu={props.toggleContextMenuOn}>
            Research Webs
        </div>
    );
}

export default Web;

