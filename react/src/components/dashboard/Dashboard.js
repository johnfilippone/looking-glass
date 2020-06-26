import React from 'react';
import {Responsive, WidthProvider}from 'react-grid-layout';
import Countdown from './Countdown';
import Streak from './Streak';
import DailyProgress from './DailyProgress';
import EventList from './EventList';
import PieChart from './PieChart';
import LineChart from './LineChart';
import { request } from 'graphql-request';
import { durationStringToSeconds, getFromLS, saveToLS } from '../../utils/utils';
import './Dashboard.css';
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || {};

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            layouts: JSON.parse(JSON.stringify(originalLayouts)),
            studySheet: [],
            exerciseSheet: [],
            practiceSheet: [],
            weightChartInput: {},
            connectingChartInput: {},
            exercisePieInput: {},
            eventsData: []
        };

        this.onLayoutChange = this.onLayoutChange.bind(this);
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
            this.getSheet('1OArbMSXtJAsGGWvl_1V7u2lwUncutERJ-TArYZmmExc', 'Events')
        ];
        Promise.all(promises).then((sheets) => {
            const weightSheet = sheets[0].sheets;
            const weightDates = weightSheet.slice(3).filter((data) => { return data[1]; }).map((data) => { return data[0]; });
            //const weightLine = {label: 'Body Weight (lbs)', data: weightSheet.slice(3).filter((data) => { return data[1]; }).map((data) => { return parseFloat(data[1]); })};
            const weightAvgLine = {label: 'Trend (lbs)', data: weightSheet.slice(3).filter((data) => { return data[2]; }).map((data) => { return parseFloat(data[2]); })};
            const weightChartInput = this.buildLineChartInput(weightDates, [weightAvgLine]);

            const connectingData = sheets[1].sheets;
            const connectingDates = connectingData.slice(1).filter((data) => { return data[7] && data[8]; }).map((data) => { return data[0]; });
            const maxLine = {label: 'Max dbs', data: connectingData.slice(1).filter((data) => { return data[7] && data[8]; }).map((data) => { return parseFloat(data[8]); })};
            const avgLine = {label: 'Avg dbs', data: connectingData.slice(1).filter((data) => { return data[7] && data[8]; }).map((data) => { return parseFloat(data[7]); })};
            const connectingChartInput = this.buildLineChartInput(connectingDates, [maxLine, avgLine]);

            const studySheet = sheets[2].sheets;
            const practiceSheet = sheets[3].sheets;
            const exerciseSheet = sheets[4].sheets;

            const exerciseWeekSheet = sheets[5].sheets;
            const exerciseWeekData = exerciseWeekSheet.slice(1, exerciseWeekSheet.length-1);
            const exercisePieLabels = exerciseWeekData.map((entry) => { return entry[0]; });
            const exercisePieData = exerciseWeekData.map((entry) => {
                const components = entry[1].split(':');
                return (+components[0]) * 60 * 60 + (+components[1]) * 60 + (+components[2]);
            });
            const exercisePieInput = this.buildPieChartInput(exercisePieLabels, exercisePieData);

            this.setState({
                studySheet,
                exerciseSheet,
                practiceSheet,
                weightChartInput,
                connectingChartInput,
                exercisePieInput,
                eventsData: sheets[6].sheets
            });
        });
    }

    async getSheet(spreadsheetId, range) {
        return request('http://localhost:4000/graphql', `{ sheets(spreadsheetId:"${spreadsheetId}", range:"${range}") }`);
    }

    onLayoutChange(layout, layouts) {
        saveToLS("layouts", layouts);
        this.setState({ layouts });
    }

    buildLineChartInput(xValues, lines) {
        return {
            labels: xValues,
            datasets: lines.map((line) => {
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

    buildPieChartInput(labels, data) {
        const colors = labels.map((entry) => { return '#' + Math.random().toString(16).substr(2,6) });
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
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
        const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate()-now.getDay());
        const firstDayOfLastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate()-now.getDay()-7);

        return (
            <div className='Dashboard' onClick={this.props.clickListener} onContextMenu={this.props.toggleContextMenuOn}>
                <ResponsiveReactGridLayout
                    className="layout"
                    layouts={this.state.layouts}
                    cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                    rowHeight={30}
                    measureBeforeMount={true}
                    compactType="vertical"
                    preventCollision={false}
                    onLayoutChange={(layout, layouts) =>
                        this.onLayoutChange(layout, layouts)
                    }
                >
                    <div key="1" data-grid={{x: 0, y: 0, w: 2, h: 5}} className='widget-container'>
                        <Streak title='Study Streak' data={this.state.studySheet} condition={(data) => { return parseFloat(data[1].replace('%', '')) >= 14.29; }} lookback={100} />
                    </div>
                    <div key="2" data-grid={{x: 0, y: 5, w: 2, h: 5}} className='widget-container'>
                        <Streak title='KTVA Practice Streak' data={this.state.practiceSheet} condition={(data) => { return durationStringToSeconds(data[1]) >= 2700; }} lookback={100} />
                    </div>
                    <div key="3" data-grid={{x: 0, y: 10, w: 2, h: 5}} className='widget-container'>
                        <Streak title='Exercise Streak' data={this.state.exerciseSheet} condition={(data) => { return durationStringToSeconds(data[1]) >= 200; }} lookback={100} />
                    </div>
                    <div key="4" data-grid={{x: 0, y: 15, w: 2, h: 5}} className='widget-container'>
                        <Countdown title='Days until TX' date={Date.parse('24 Jul 2020')} />
                    </div>
                    <div key="5" data-grid={{x: 2, y: 0, w: 3, h: 3}} className='widget-container'>
                        <DailyProgress title='Daily Study' width={250} height={10} goal={14.29} unit='%' data={this.state.studySheet} parameter='SUM of % Completed' />
                    </div>
                    <div key="6" data-grid={{x: 5, y: 0, w: 3, h: 3}} className='widget-container'>
                        <DailyProgress title='Daily Exercise' width={250} height={10} goal={200} unit='Seconds' data={this.state.exerciseSheet} parameter='SUM of Time Under Tension' />
                    </div>
                    <div key="7" data-grid={{x: 8, y: 0, w: 3, h: 3}} className='widget-container'>
                        <DailyProgress title='Daily KTVA Practice' width={250} height={10} goal={2700} unit='Seconds' data={this.state.practiceSheet} parameter='SUM of Duration' />
                    </div>
                    <div key="8" data-grid={{x: 2, y: 4, w: 5, h: 9}} className='widget-container'>
                        <LineChart data={this.state.connectingChartInput} />
                    </div>
                    <div key="9" data-grid={{x: 2, y: 9, w: 5, h: 9}} className='widget-container'>
                        <LineChart data={this.state.weightChartInput} />
                    </div>
                    <div key="10" data-grid={{x: 7, y: 4, w: 4, h: 8}} className='widget-container'>
                        <PieChart legend={{display: true}} data={this.state.exercisePieInput} />
                    </div>
                    <div key="11" data-grid={{x: 7, y: 4, w: 4, h: 6}} className='widget-container'>
                        <EventList title='Last Week' data={this.state.eventsData} significance={2} startDate={firstDayOfLastWeek} endDate={firstDayOfWeek} />
                    </div>
                    <div key="12" data-grid={{x: 7, y: 4, w: 4, h: 6}} className='widget-container'>
                        <EventList title='This Week' data={this.state.eventsData} significance={2} startDate={firstDayOfWeek} endDate={tomorrow} />
                    </div>
                </ResponsiveReactGridLayout>
            </div>
        )
    }
}

export default Dashboard;
