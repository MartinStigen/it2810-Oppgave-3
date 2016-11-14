import React, {Component} from 'react';

import MovieCardComponent from './MovieCardComponent';

//Class to suggest similar movies related to the one being showed
export default class SimilarMoviesComponent extends Component {
	constructor() {
		super();
        this.state = {
            movies: []
        };
	}

	render() {
        const movies = this.state.movies.map(movie => { return (<MovieCardComponent small={true} movie={movie} key={movie.ID} />)});

		return(
			<div className="similar-movies-component detail-box">
				<h3>Similar movies</h3>
				<ul>
				    <li>{movies}</li>
				</ul>
      		</div>
		);
	}

	componentWillReceiveProps(nextProps) {
        fetch('/api/movies/similar?id=' + nextProps.movie.ID, {
			credentials: "same-origin"
		}).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(stories) {
            //Updating state with setState causes render to happen again
            this.setState({movies: JSON.parse(stories)});
        }.bind(this));
	}
}
