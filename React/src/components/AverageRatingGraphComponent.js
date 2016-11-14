import React, {Component} from 'react';

var LineChart = require("react-chartjs").Line;

/* advanced analytics comes here */
export default class AverageRatingGraphComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			movies: [],
			chartData: {
				labels: [],
				datasets: [
					{
						label: "Average IMDB rating (Multiplied by 10)",
	                    fillColor: "rgba(220,110,110,0.2)",
	                    strokeColor: "rgba(220,110,110,1)",
	                    pointColor: "rgba(220,110,110,1)",
	                    pointHighlightStroke: "rgba(220,110,110,1)",
	                    data: []
	                },
	                {
	                	label: "Average Metacritic rating",
	                    fillColor: "rgba(110,220,110,0.2)",
	                    strokeColor: "rgba(110,220,110,1)",
	                    pointColor: "rgba(110,220,110,1)",
	                    pointHighlightStroke: "rgba(110,220,110,1)",
	                    data: []
	                },
	                {
	                	label: "Average runtime",
	                    fillColor: "rgba(110,110,220,0.2)",
	                    strokeColor: "rgba(110,110,220,1)",
	                    pointColor: "rgba(110,110,220,1)",
	                    pointHighlightStroke: "rgba(110,110,220,1)",
	                    data: []
	                }
				]
			}
		};
	}

	render() {
		return (
		    <div className="detail-box">
	    		<LineChart data={this.state.chartData} width="730" height="600" />
			</div>
		)
	}

	componentDidMount() {
	    fetch('/api/analytics').then(function(response) {
	      if (response.status >= 400) {
	        throw new Error("Bad response from server");
	      }
	      return response.json();
	    }).then(function(stories) {
	      	const yearInfo = JSON.parse(stories);

	      	var years = []
	      	var average_imdbs = []
	      	var average_metacritics = []
	      	var average_runtimes = []

			for (var i = 0; i < yearInfo.length; i++) {
				years.push(yearInfo[i].Year)
				average_imdbs.push(yearInfo[i].average_imdb * 10)
				average_metacritics.push(yearInfo[i].average_metacritic)
				average_runtimes.push(yearInfo[i].average_runtime)
			}

	      	var newChartData = this.state.chartData;
	      	newChartData.datasets[0].data = average_imdbs
	      	newChartData.datasets[1].data = average_metacritics
	      	newChartData.datasets[2].data = average_runtimes
	      	newChartData.labels = years

	      	this.setState({
	      		chartData: newChartData
	      	});

	    }.bind(this));
  	}

}
