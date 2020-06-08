import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import ContextMenu from './components/ContextMenu';
import Dashboard from './components/dashboard/Dashboard';
import Web from './components/web/Web';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            contextMenuActive: false,
            contextMenuClickPosition: { xPosition: 0, yPosition: 0 }
        };
        this.toggleContextMenuOn = this.toggleContextMenuOn.bind(this);
        this.toggleContextMenuOff = this.toggleContextMenuOff.bind(this);
        this.clickListener = this.clickListener.bind(this);
        this.clickInsideElement = this.clickInsideElement.bind(this);
        this.getClickPosition = this.getClickPosition.bind(this);
    }

    toggleContextMenuOn(e) {
        e.preventDefault();
        this.setState({
            contextMenuActive: true,
            contextMenuClickPosition: this.getClickPosition(e)
        });
    }

    toggleContextMenuOff(e) {
        e.preventDefault();
        this.setState({
            contextMenuActive: false
        });
    }

    clickListener(e) {
        if (this.state.contextMenuActive) {
            if (this.clickInsideElement(e, 'ContextMenu')) {
                // handle menu links
            } else {
                e.preventDefault();
                this.toggleContextMenuOff(e);
            }
        }
    }

    clickInsideElement(e, className) {
        var el = e.srcElement || e.target;
        if ( el.classList.contains(className) ) {
            return el;
        } else {
            while (el = el.parentNode) {
                if ( el.classList && el.classList.contains(className) ) {
                    return el;
                }
            }
        }
        return false;
    }

    getClickPosition(e) {
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
            <div className='App'>
                <BrowserRouter>
                    <Switch>
                        <Redirect path='/' to='/dashboard' exact />
                        <Route path='/dashboard' render={() => <Dashboard clickListener={this.clickListener} toggleContextMenuOn={this.toggleContextMenuOn} /> } />
                        <Route path='/webs' render={() => <Web clickListener={this.clickListener} toggleContextMenuOn={this.toggleContextMenuOn} /> } />
                    </Switch>
                    <ContextMenu active={this.state.contextMenuActive} clickPosition={this.state.contextMenuClickPosition} />
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
