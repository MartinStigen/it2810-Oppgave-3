import React, {Component} from "react";
import MovieCardComponent from "./MovieCardComponent";

import {getSeenMovies, getMovie} from '../functions/APIFunctions';

export default class SeenMovies extends Component {

    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            userID: this.props.userID
        };
    }

    render() {
        const components = this.state.movies.map(movie => {
            return (
                <MovieCardComponent small={true} movie={movie} key={movie.ID}/>
            );
        });

        return (
            <div className="detail-box row">
                <h3>Seen movies</h3>
                {components}
            </div>
        );
    }

    componentDidMount() {
        getSeenMovies(this.state.userID, function (movies) {
            this.setState({
                movies: movies
            });
        }.bind(this));
    }

}