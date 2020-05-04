import React from 'react';
import './Dashboard.css';
import ContextMenu from './ContextMenu';
import Countdown from './Countdown';
import Streak from './Streak';
import { Line } from 'react-chartjs-2';
import { request } from 'graphql-request'

class Dashboard extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            contextMenuActive: false,
            contextMenuClickPosition: { xPosition: 0, yPosition: 0 },
            weightData: [],
            connectingData: [],
            studyData: [],
            practiceData: [],
            exerciseData: []
        };

        this.toggleContextMenu = this.toggleContextMenu.bind(this);
        this.getClickPosition = this.getClickPosition.bind(this);
        this.getSheet = this.getSheet.bind(this);
        this.buildLineData = this.buildLineData.bind(this);
    }

    async componentDidMount() {
        const weightData = await this.getSheet('1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Metrics')
        const connectingData = await this.getSheet('1ucWB8jjQIYJa_K4K0NsDA9owCeWYs1buClTVvE2JqJw', 'Connecting Volume');
        const studyData = await this.getSheet('1fvxCxuE0Rg67YpsYkvVxY-qjm_5gZVVTo5NvMEo22TE', 'Study Log Pivot');
        const practiceData = await this.getSheet('1ucWB8jjQIYJa_K4K0NsDA9owCeWYs1buClTVvE2JqJw', 'Practice Log Pivot');
        const exerciseData = await this.getSheet('1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Exercise Log Pivot');
        this.setState({
            weightData: weightData.sheets,
            connectingData: connectingData.sheets,
            studyData: studyData.sheets,
            practiceData: practiceData.sheets,
            exerciseData: exerciseData.sheets
        });
    }

    async getSheet(spreadsheetId: any, range: any) {
        return request('http://localhost:4000/graphql', `{ sheets(spreadsheetId:"${spreadsheetId}", range:"${range}") }`);
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

    buildLineData(xValues: any, lines: any) {
        return {
            labels: xValues,
            datasets: lines.map((line: any) => {
                return {
                    label: line.label,
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
                    data: line.data
                }
            })
        };
    }

    render() {
        let weightSheet = this.state.weightData;
        const weightDates = weightSheet.slice(3).filter((data: any) => { return data[1]; }).map((data: any) => { return data[0]; });
        const weightLine = {label: 'Body Weight (lbs)', data: weightSheet.slice(3).filter((data: any) => { return data[1]; }).map((data: any) => { return parseFloat(data[1]); })};
        const weightChartData = this.buildLineData(weightDates, [weightLine]);

        let connectingData = this.state.connectingData;
        const connectingDates = connectingData.slice(1).filter((data: any) => { return data[7] && data[8]; }).map((data: any) => { return data[0]; });
        const maxLine = {label: 'Max dbs', data: connectingData.slice(1).filter((data: any) => { return data[7] && data[8]; }).map((data: any) => { return parseFloat(data[8]); })};
        const avgLine = {label: 'Avg dbs', data: connectingData.slice(1).filter((data: any) => { return data[7] && data[8]; }).map((data: any) => { return parseFloat(data[7]); })};
        const connectingChartData = this.buildLineData(connectingDates, [maxLine, avgLine]);

        const studySheet = this.state.studyData;
        const studyData = studySheet.map((entry: any) => { return entry[0]; });
        const practiceSheet = this.state.practiceData;
        const practiceData = practiceSheet.map((entry: any) => { return entry[0]; });
        const exerciseSheet = this.state.exerciseData;
        const exerciseData = exerciseSheet.map((entry: any) => { return entry[0]; });

        return (
            <div className='Dashboard' onContextMenu={this.toggleContextMenu}>
                <Countdown title='Days until TX' date={Date.parse('01 Aug 2020 00:00:00 GMT')} />
                <Countdown title='Days to End of Diet' date={Date.parse('21 June 2020 00:00:00 GMT')} />
                <Streak title='Study Streak' dates={studyData} lookback={7} />
                <Streak title='Practice Streak' dates={practiceData} lookback={7} />
                <Streak title='Exercise Streak' dates={exerciseData} lookback={7} />
                <Line data={weightChartData} />
                <Line data={connectingChartData} />
                <ContextMenu active={this.state.contextMenuActive} clickPosition={this.state.contextMenuClickPosition} />
            </div>
        )
    }
}


export default Dashboard;
