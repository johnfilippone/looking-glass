import React from 'react';
import ContextMenu from './ContextMenu';
import Countdown from './Countdown';
import Streak from './Streak';
import DailyProgress from './DailyProgress';
import EventList from './EventList';
import { Line, Pie } from 'react-chartjs-2';
import { request } from 'graphql-request';
import './Dashboard.css';

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
            weightChartInput: {},
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
            this.getSheet('1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Metrics'),
            this.getSheet('1ucWB8jjQIYJa_K4K0NsDA9owCeWYs1buClTVvE2JqJw', 'Connecting Volume'),
            this.getSheet('1fvxCxuE0Rg67YpsYkvVxY-qjm_5gZVVTo5NvMEo22TE', 'Study Log Pivot'),
            this.getSheet('1ucWB8jjQIYJa_K4K0NsDA9owCeWYs1buClTVvE2JqJw', 'Practice Log Pivot'),
            this.getSheet('1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Exercise Log Pivot'),
            this.getSheet('1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Week Pivot'),
            this.getSheet('1ucWB8jjQIYJa_K4K0NsDA9owCeWYs1buClTVvE2JqJw', 'Week Pivot'),
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
            const studyDates = studySheet.map((entry) => { return entry[0]; });
            const practiceSheet = sheets[3].sheets;
            const practiceDates = practiceSheet.map((entry) => { return entry[0]; });
            const exerciseSheet = sheets[4].sheets;
            const exerciseDates = exerciseSheet.map((entry) => { return entry[0]; });

            const exerciseWeekSheet = sheets[5].sheets;
            const exerciseWeekData = exerciseWeekSheet.slice(1, exerciseWeekSheet.length-1);
            const exercisePieLabels = exerciseWeekData.map((entry) => { return entry[0]; });
            const exercisePieData = exerciseWeekData.map((entry) => {
                const components = entry[1].split(':');
                return (+components[0]) * 60 * 60 + (+components[1]) * 60 + (+components[2]);
            });
            const exercisePieInput = this.buildPieChartInput(exercisePieLabels, exercisePieData);

            const practiceWeekSheet = sheets[6].sheets;
            const practiceWeekData = practiceWeekSheet.slice(1, practiceWeekSheet.length-1);
            const practicePieLabels = practiceWeekData.map((entry) => { return entry[0]; });
            const practicePieData = practiceWeekData.map((entry) => {
                const components = entry[1].split(':');
                return (+components[0]) * 60 * 60 + (+components[1]) * 60 + (+components[2]);
            });
            const practicePieInput = this.buildPieChartInput(practicePieLabels, practicePieData);

            this.setState({
                studySheet,
                exerciseSheet,
                practiceSheet,
                studyDates,
                exerciseDates,
                practiceDates,
                weightChartInput,
                connectingChartInput,
                exercisePieInput,
                practicePieInput,
                eventsData: sheets[7].sheets
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

        return (
            <div className='Dashboard' onClick={this.clickListener} onContextMenu={this.toggleContextMenuOn}>
                <div style={{gridColumn: '1 / 2', gridRow: '1 / 5'}}>
                    <Streak title='Study Streak' dates={this.state.studyDates} lookback={30} />
                    <Streak title='KTVA Practice Streak' dates={this.state.practiceDates} lookback={30} />
                    <Streak title='Exercise Streak' dates={this.state.exerciseDates} lookback={30} />
                    <Countdown title='Days until TX' date={Date.parse('01 Aug 2020 00:00:00 GMT')} />
                    <Countdown title='Days to End of Diet' date={Date.parse('21 June 2020 00:00:00 GMT')} />
                </div>
                <div className='flex-row' style={{gridColumn: '2 / 4', gridRow: '1 / 2'}}>
                    <DailyProgress title='Daily Study' width={300} height={10} goal={10} unit='%' data={this.state.studySheet} parameter='SUM of % Completed'/>
                    <DailyProgress title='Daily Exercise' width={300} height={10} goal={200} unit='Seconds' data={this.state.exerciseSheet} parameter='SUM of Time Under Tension'/>
                    <DailyProgress title='Daily KTVA Practice' width={300} height={10} goal={2700} unit='Seconds' data={this.state.practiceSheet} parameter='SUM of Duration'/>
                </div>
                <div style={{gridColumn: '2 / 3', gridRow: '2 / 3'}}>
                    <Pie data={this.state.exercisePieInput} />
                </div>
                <div style={{gridColumn: '3 / 4', gridRow: '2 / 3'}}>
                    <Pie data={this.state.practicePieInput} />
                </div>
                <div style={{gridColumn: '2 / 3', gridRow: '3 / 4'}}>
                    <Line data={this.state.weightChartInput} />
                </div>
                <div style={{gridColumn: '3 / 4', gridRow: '3 / 4'}}>
                    <Line data={this.state.connectingChartInput} />
                </div>
                <div style={{gridColumn: '2 / 3', gridRow: '4 / 5'}}>
                    <EventList title='Last Week' data={this.state.eventsData} significance={2} startDate={firstDayOfLastWeek} endDate={firstDayOfWeek} />
                </div>
                <div style={{gridColumn: '3 / 4', gridRow: '4 / 5'}}>
                    <EventList title='This Week' data={this.state.eventsData} significance={2} startDate={firstDayOfWeek} endDate={tomorrow} />
                </div>
                <ContextMenu active={this.state.contextMenuActive} clickPosition={this.state.contextMenuClickPosition} />
            </div>
        )
    }
}

export default Dashboard;
