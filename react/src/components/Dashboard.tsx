import React from 'react';
import ContextMenu from './ContextMenu';
import Countdown from './Countdown';
import Streak from './Streak';
import DailyProgress from './DailyProgress';
import { Line, Pie } from 'react-chartjs-2';
import { request } from 'graphql-request';
import './Dashboard.css';

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
            exerciseData: [],
            exerciseWeekData: [],
            practiceWeekData: []
        };

        this.toggleContextMenu = this.toggleContextMenu.bind(this);
        this.getClickPosition = this.getClickPosition.bind(this);
        this.getSheet = this.getSheet.bind(this);
        this.buildLineChartInput = this.buildLineChartInput.bind(this);
        this.buildPieChartInput = this.buildPieChartInput.bind(this);
    }

    async componentDidMount() {
        let promises = [
            this.getSheet('1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Metrics'),
            this.getSheet('1ucWB8jjQIYJa_K4K0NsDA9owCeWYs1buClTVvE2JqJw', 'Connecting Volume'),
            this.getSheet('1fvxCxuE0Rg67YpsYkvVxY-qjm_5gZVVTo5NvMEo22TE', 'Study Log Pivot'),
            this.getSheet('1ucWB8jjQIYJa_K4K0NsDA9owCeWYs1buClTVvE2JqJw', 'Practice Log Pivot'),
            this.getSheet('1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Exercise Log Pivot'),
            this.getSheet('1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Week Pivot'),
            this.getSheet('1ucWB8jjQIYJa_K4K0NsDA9owCeWYs1buClTVvE2JqJw', 'Week Pivot'),
        ];
        Promise.all(promises).then((sheets) => {
            this.setState({
                weightData: sheets[0].sheets,
                connectingData: sheets[1].sheets,
                studyData: sheets[2].sheets,
                practiceData: sheets[3].sheets,
                exerciseData: sheets[4].sheets,
                exerciseWeekData: sheets[5].sheets,
                practiceWeekData: sheets[6].sheets
            });
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

    buildLineChartInput(xValues: any, lines: any) {
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

    buildPieChartInput(labels: any, data: any) {
        const colors = labels.map((entry: any) => { return '#' + Math.random().toString(16).substr(2,6) });
        return {
            labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                hoverBackgroundColor: colors
            }]
        };
    }

    render() {
        const weightSheet = this.state.weightData;
        const weightDates = weightSheet.slice(3).filter((data: any) => { return data[1]; }).map((data: any) => { return data[0]; });
        const weightLine = {label: 'Body Weight (lbs)', data: weightSheet.slice(3).filter((data: any) => { return data[1]; }).map((data: any) => { return parseFloat(data[1]); })};
        const weightAvgLine = {label: 'Trend (lbs)', data: weightSheet.slice(3).filter((data: any) => { return data[2]; }).map((data: any) => { return parseFloat(data[2]); })};
        const weightChartInput = this.buildLineChartInput(weightDates, [weightLine, weightAvgLine]);

        const connectingData = this.state.connectingData;
        const connectingDates = connectingData.slice(1).filter((data: any) => { return data[7] && data[8]; }).map((data: any) => { return data[0]; });
        const maxLine = {label: 'Max dbs', data: connectingData.slice(1).filter((data: any) => { return data[7] && data[8]; }).map((data: any) => { return parseFloat(data[8]); })};
        const avgLine = {label: 'Avg dbs', data: connectingData.slice(1).filter((data: any) => { return data[7] && data[8]; }).map((data: any) => { return parseFloat(data[7]); })};
        const connectingChartInput = this.buildLineChartInput(connectingDates, [maxLine, avgLine]);

        const studySheet = this.state.studyData;
        const studyDates = studySheet.map((entry: any) => { return entry[0]; });
        const exerciseSheet = this.state.exerciseData;
        const exerciseDates = exerciseSheet.map((entry: any) => { return entry[0]; });
        const practiceSheet = this.state.practiceData;
        const practiceDates = practiceSheet.map((entry: any) => { return entry[0]; });

        const exerciseWeekSheet = this.state.exerciseWeekData;
        const exerciseWeekData = exerciseWeekSheet.slice(1, exerciseWeekSheet.length-1);
        const exercisePieLabels = exerciseWeekData.map((entry: any) => { return entry[0]; });
        const exercisePieData = exerciseWeekData.map((entry: any) => {
            const components = entry[1].split(':');
            return (+components[0]) * 60 * 60 + (+components[1]) * 60 + (+components[2]);
        });
        const exercisePieInput = this.buildPieChartInput(exercisePieLabels, exercisePieData);

        const practiceWeekSheet = this.state.practiceWeekData;
        const practiceWeekData = practiceWeekSheet.slice(1, practiceWeekSheet.length-1);
        const practicePieLabels = practiceWeekData.map((entry: any) => { return entry[0]; });
        const practicePieData = practiceWeekData.map((entry: any) => {
            const components = entry[1].split(':');
            return (+components[0]) * 60 * 60 + (+components[1]) * 60 + (+components[2]);
        });
        const practicePieInput = this.buildPieChartInput(practicePieLabels, practicePieData);

        return (
            <div className='Dashboard' onContextMenu={this.toggleContextMenu}>
                <div className='group'>
                    <Countdown title='Days until TX' date={Date.parse('01 Aug 2020 00:00:00 GMT')} />
                    <Countdown title='Days to End of Diet' date={Date.parse('21 June 2020 00:00:00 GMT')} />
                    <Streak title='Study Streak' dates={studyDates} lookback={30} />
                    <Streak title='KTVA Practice Streak' dates={practiceDates} lookback={30} />
                    <Streak title='Exercise Streak' dates={exerciseDates} lookback={30} />
                </div>
                <div className='group'>
                    <DailyProgress title='Daily Study' width={200} height={20} goal={14.29} unit='%' data={studySheet} parameter='SUM of % Completed'/>
                    <DailyProgress title='Daily Exercise' width={200} height={20} goal={200} unit='Seconds' data={exerciseSheet} parameter='SUM of Time Under Tension'/>
                    <DailyProgress title='Daily KTVA Practice' width={200} height={20} goal={2700} unit='Seconds' data={practiceSheet} parameter='SUM of Duration'/>
                </div>
                <div className='pie-group'>
                    <Pie height={50} data={exercisePieInput} />
                    <Pie height={50} data={practicePieInput} />
                </div>
                <Line data={weightChartInput} />
                <Line data={connectingChartInput} />
                <ContextMenu active={this.state.contextMenuActive} clickPosition={this.state.contextMenuClickPosition} />
            </div>
        )
    }
}


export default Dashboard;
