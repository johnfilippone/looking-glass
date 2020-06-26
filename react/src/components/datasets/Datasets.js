import React from 'react';
import { request } from 'graphql-request';
import './Datasets.css';

class Datasets extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            datasets: [],
        }

        this.getDatasets = this.getDatasets.bind(this);
    }

    async componentDidMount() {
        const { datasets } = await this.getDatasets();
        this.setState({ datasets });
    }

    async getDatasets() {
        return request('http://localhost:4000/graphql', `{ datasets }`);
    }

    render() {
        const listItems = this.state.datasets.map((item) => {
            return <tr key={item}><td>{item}</td></tr>;
        });

        return (
            <div className='Datasets' onClick={this.props.clickListener} onContextMenu={this.props.toggleContextMenuOn}>
                Datasets
                <table>
                    <tr>
                        <th>Dataset</th>
                        <th>Description</th>
                    </tr>
                    {listItems}
                    <tr>Add Dataset</tr>
                </table>
            </div>
        );
    }
}

export default Datasets;


