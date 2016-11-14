import React, {Component} from 'react';

var LineChart = require("react-chartjs").Line;
import AverageRatingGraphComponent from '../components/AverageRatingGraphComponent';
import WordCloudComponent from '../components/WordCloudComponent';

import styles from '../styles/analytics.css'

/* advanced analytics comes here */
export default class Analytics extends Component {
    render() {
        return (
            <div className="container-768">
                <h1>Analytics</h1>
                <AverageRatingGraphComponent />
				<WordCloudComponent />
            </div>
        );
    }
}
