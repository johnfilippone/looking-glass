import React from 'react';
import { NavLink } from 'react-router-dom';
import './ContextMenu.css';

function ContextMenu(props) {
    const menuWidth = 200;
    const menuHeight = 100;
    const position = getMenuPosition(props.clickPosition, menuWidth, menuHeight);

    const menuStyle = {
        display: props.active ? 'block' : 'none',
        width: menuWidth,
        height: menuHeight,
        left: position.xPosition,
        top: position.yPosition
    };

    function getMenuPosition(clickCoords, menuWidth, menuHeight) {
        const clickCoordsX = clickCoords.xPosition;
        const clickCoordsY = clickCoords.yPosition;
        let position = {
            xPosition: clickCoordsX,
            yPosition: clickCoordsY
        };

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if ( (windowWidth - clickCoordsX) < menuWidth+4 ) {
            position.xPosition = (windowWidth - menuWidth+4)-0;
        } else {
            position.xPosition = clickCoordsX-0;
        }

        // menu.style.top = clickCoordsY + "px";
        if ( Math.abs(windowHeight - clickCoordsY) < menuHeight+4) {
            position.yPosition = (windowHeight - menuHeight+4)-0;
        } else {
            position.yPosition = clickCoordsY-0;
        }

        return position;
    }

    return (
        <div id="context-menu" className={'ContextMenu'} style={menuStyle}>
            <ul>
                <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
                <li><NavLink to='/webs'>Research Webs</NavLink></li>
                <li><NavLink to='/datasets'>Datasets</NavLink></li>
            </ul>
        </div>
    );
}

export default ContextMenu;
