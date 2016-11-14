import React, {Component} from 'react';

/* shows full plot of chosen movie */
export default class PlotComponent extends Component {
	render() {
		const movie = this.props.movie;

		return(
			<div className="plot-component detail-box">
				<h3>Plot</h3>
				<p>{movie.FullPlot}</p>
      		</div>
		);
	}
}

