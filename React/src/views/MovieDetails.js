import React, {Component} from 'react';

import MovieDetailCardComponent from '../components/MovieDetailCardComponent';
import PlotComponent from '../components/PlotComponent';
import SimilarMoviesComponent from '../components/SimilarMoviesComponent';
import {getMovie} from '../functions/APIFunctions';

/* shows detailed information about a movie */
export default class MovieDetails extends Component {
    /* uses id from	 the query parameter to find the correct movie from the data source */
	constructor(props) {
		super(props);
		this.state = {
            id: this.props.params.id,
			movie: [],
		};
	}

    componentDidMount() {
        getMovie(this.state.id, true, function (movie) {
            this.setState({movie: movie});
        }.bind(this));
    }

	componentWillReceiveProps(nextProps) {
        getMovie(nextProps.params.id, true, function (movie) {
            this.setState({id: nextProps.params.id, movie: movie});
        }.bind(this));
	}

	render() {
		const {movie, cast} = this.state;
		/* renders detail page with its components */
		return(
			<div className="container-768">
				<MovieDetailCardComponent movie={movie} link={true}/>
				<PlotComponent movie={movie} />
				<SimilarMoviesComponent movie={movie} />
      		</div>
		);
	}
}
