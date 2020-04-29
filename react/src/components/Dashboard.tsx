import React from 'react';
import './Dashboard.css';
import ContextMenu from './ContextMenu';

class Dashboard extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            contextMenuActive: false,
            contextMenuPosition: { xPosition: 0, yPosition: 0 }
        };

        this.toggleContextMenu = this.toggleContextMenu.bind(this);
        this.getClickPosition = this.getClickPosition.bind(this);
    }

    toggleContextMenu(e: any) {
        e.preventDefault();
        this.setState({
            contextMenuActive: !this.state.contextMenuActive,
            contextMenuPosition: this.getClickPosition(e)
        });
    }

    getClickPosition(e: any) {
        let posx = 0;
        let posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return {
            xPosition: posx,
            yPosition: posy
        };
    }

    render() {
        return (
            <div className="Dashboard" onContextMenu={this.toggleContextMenu}>
                <ContextMenu active={this.state.contextMenuActive} clickPosition={this.state.contextMenuPosition} />
            </div>
        )
    }
}


export default Dashboard;
