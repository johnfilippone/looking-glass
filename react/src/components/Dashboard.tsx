import React from 'react';
import './Dashboard.css';
import ContextMenu from './ContextMenu';
import { Line } from 'react-chartjs-2';
import { request } from 'graphql-request'

class Dashboard extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            contextMenuActive: false,
            contextMenuClickPosition: { xPosition: 0, yPosition: 0 },
            weightData: {dates: [], lbs: []}
        };

        this.toggleContextMenu = this.toggleContextMenu.bind(this);
        this.getClickPosition = this.getClickPosition.bind(this);
        this.getWeightData = this.getWeightData.bind(this);
    }

    componentDidMount() {
        this.getWeightData();
    }

    getWeightData() {
        request('http://localhost:4000/graphql', `{ weight }`).then(data => {
            let dates = data.weight.slice(1).filter((data: any) => {
                return data[1];
            }).map((data: any) => {
                return data[0];
            });
            let lbs = data.weight.slice(1).filter((data: any) => {
                return data[1];
            }).map((data: any) => {
                return parseFloat(data[1]);
            });
            this.setState({ weightData: {dates, lbs }});
        });
    }

    toggleContextMenu(e: any) {
        e.preventDefault();
        this.setState({
            contextMenuActive: !this.state.contextMenuActive,
            contextMenuClickPosition: this.getClickPosition(e)
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
        const weightData = this.state.weightData;
        const data = {
            labels: weightData.dates,
            datasets: [{
                label: 'My First dataset',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: weightData.lbs
            }]
        };
        return (
            <div className="Dashboard" onContextMenu={this.toggleContextMenu}>
                <Line data={data} />
                <ContextMenu active={this.state.contextMenuActive} clickPosition={this.state.contextMenuClickPosition} />
            </div>
        )
    }
}


export default Dashboard;
