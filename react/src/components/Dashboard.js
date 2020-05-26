import React from 'react';
import {Responsive, WidthProvider}from 'react-grid-layout';
import ContextMenu from './ContextMenu';
import Countdown from './Countdown';
import Streak from './Streak';
import DailyProgress from './DailyProgress';
import EventList from './EventList';
import PieChart from './PieChart';
import LineChart from './LineChart';
import { request } from 'graphql-request';
import './Dashboard.css';
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            contextMenuActive: false,
            contextMenuClickPosition: { xPosition: 0, yPosition: 0 },
            studySheet: [],
            exerciseSheet: [],
            practiceSheet: [],
            studyDates: [],
            exerciseDates: [],
            practiceDates: [],
            weightData: [],
            connectingData: [],
            studyData: [],
            practiceData: [],
            exerciseData: [],
            connectingChartInput: {},
            exercisePieInput: {},
            practicePieInput: {},
            eventsData: []
        };

        this.toggleContextMenuOn = this.toggleContextMenuOn.bind(this);
        this.toggleContextMenuOff = this.toggleContextMenuOff.bind(this);
        this.clickListener = this.clickListener.bind(this);
        this.clickInsideElement = this.clickInsideElement.bind(this);
        this.getClickPosition = this.getClickPosition.bind(this);
        this.getSheet = this.getSheet.bind(this);
        this.buildLineChartInput = this.buildLineChartInput.bind(this);
        this.buildPieChartInput = this.buildPieChartInput.bind(this);
    }

    async componentDidMount() {
        let promises = [
            this.getSheet('1ucWB8jjQIYJa_K4K0NsDA9owCeWYs1buClTVvE2JqJw', 'Connecting Volume'),
            this.getSheet('1fvxCxuE0Rg67YpsYkvVxY-qjm_5gZVVTo5NvMEo22TE', 'Study Log Pivot'),
            this.getSheet('1ucWB8jjQIYJa_K4K0NsDA9owCeWYs1buClTVvE2JqJw', 'Practice Log Pivot'),
            this.getSheet('1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Exercise Log Pivot'),
            this.getSheet('1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Week Pivot'),
            this.getSheet('1OArbMSXtJAsGGWvl_1V7u2lwUncutERJ-TArYZmmExc', 'Events')
        ];
        Promise.all(promises).then((sheets) => {
            const connectingData = sheets[0].sheets;
            const connectingDates = connectingData.slice(1).filter((data) => { return data[7] && data[8]; }).map((data) => { return data[0]; });
            const maxLine = {label: 'Max dbs', data: connectingData.slice(1).filter((data) => { return data[7] && data[8]; }).map((data) => { return parseFloat(data[8]); })};
            const avgLine = {label: 'Avg dbs', data: connectingData.slice(1).filter((data) => { return data[7] && data[8]; }).map((data) => { return parseFloat(data[7]); })};
            const connectingChartInput = this.buildLineChartInput(connectingDates, [maxLine, avgLine]);

            const studySheet = sheets[1].sheets;
            const studyDates = studySheet.map((entry) => { return entry[0]; });
            const practiceSheet = sheets[2].sheets;
            const practiceDates = practiceSheet.map((entry) => { return entry[0]; });
            const exerciseSheet = sheets[3].sheets;
            const exerciseDates = exerciseSheet.map((entry) => { return entry[0]; });

            const exerciseWeekSheet = sheets[4].sheets;
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
                studyDates,
                exerciseDates,
                practiceDates,
                connectingChartInput,
                exercisePieInput,
                eventsData: sheets[5].sheets
            });
        });
    }

    async getSheet(spreadsheetId, range) {
        return request('http://localhost:4000/graphql', `{ sheets(spreadsheetId:"${spreadsheetId}", range:"${range}") }`);
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

        const layout = { lg: [
            {i: 'a', x: 0, y: 0, w: 2, h: 5},
            {i: 'b', x: 0, y: 0, w: 2, h: 5},
            {i: 'c', x: 0, y: 0, w: 2, h: 5},
            {i: 'd', x: 0, y: 0, w: 2, h: 5},
            {i: 'e', x: 0, y: 0, w: 2, h: 5},
            {i: 'f', x: 2, y: 0, w: 3, h: 3},
            {i: 'g', x: 5, y: 0, w: 3, h: 3},
            {i: 'h', x: 8, y: 0, w: 3, h: 3},
            {i: 'i', x: 2, y: 4, w: 4, h: 8},
            {i: 'l', x: 6, y: 4, w: 5, h: 9},
            {i: 'm', x: 2, y: 4, w: 4, h: 6},
            {i: 'n', x: 2, y: 4, w: 4, h: 6}
        ]};
        return (
            <div className='Dashboard' onClick={this.clickListener} onContextMenu={this.toggleContextMenuOn}>
                <ResponsiveReactGridLayout className="layout" layouts={layout} cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}} rowHeight={30} measureBeforeMount={true} compactType="vertical" preventCollision={false} >
                    <div key="a" className='widget-container'><Streak title='Study Streak' dates={this.state.studyDates} lookback={30} /></div>
                    <div key="b" className='widget-container'><Streak title='KTVA Practice Streak' dates={this.state.practiceDates} lookback={30} /></div>
                    <div key="c" className='widget-container'><Streak title='Exercise Streak' dates={this.state.exerciseDates} lookback={30} /></div>
                    <div key="d" className='widget-container'><Countdown title='Days until TX' date={Date.parse('24 Jul 2020')} /></div>
                    <div key="e" className='widget-container'><Countdown title='Days until haircut' date={Date.parse('30 May 2020')} /></div>
                    <div key="f" className='widget-container'><DailyProgress title='Daily Study' width={250} height={10} goal={14.29} unit='%' data={this.state.studySheet} parameter='SUM of % Completed' /></div>
                    <div key="g" className='widget-container'><DailyProgress title='Daily Exercise' width={250} height={10} goal={200} unit='Seconds' data={this.state.exerciseSheet} parameter='SUM of Time Under Tension' /></div>
                    <div key="h" className='widget-container'><DailyProgress title='Daily KTVA Practice' width={250} height={10} goal={2700} unit='Seconds' data={this.state.practiceSheet} parameter='SUM of Duration' /></div>
                    <div key="i" className='widget-container'><PieChart legend={{display: true}} data={this.state.exercisePieInput} /></div>
                    <div key="l" className='widget-container'><LineChart data={this.state.connectingChartInput} /></div>
                    <div key="m" className='widget-container'><EventList title='Last Week' data={this.state.eventsData} significance={2} startDate={firstDayOfLastWeek} endDate={firstDayOfWeek} /></div>
                    <div key="n" className='widget-container'><EventList title='This Week' data={this.state.eventsData} significance={2} startDate={firstDayOfWeek} endDate={tomorrow} /></div>
                </ResponsiveReactGridLayout>
                <ContextMenu active={this.state.contextMenuActive} clickPosition={this.state.contextMenuClickPosition} />
            </div>
        )
    }
}

export default Dashboard;
