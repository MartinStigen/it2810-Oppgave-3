import React, {Component} from "react";
import MovieCardComponent from "./MovieCardComponent";
import {getFavoriteMovies, getMovie} from '../functions/APIFunctions';

import styles from "../styles/favorite-movies.css";

export default class FavoriteMovies extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favoriteMovies: [],
            userID: this.props.userID
        };
    }

    render() {
        const components = this.state.favoriteMovies.map(movie => {
            return (
                <MovieCardComponent small={true} movie={movie} key={movie.ID}/>
            );
        });

        return (
            <div className="favorite-movies-card row detail-box">
                <h3>Favorite movies</h3>
                {components}
            </div>
        );
    }

    componentDidMount() {
        getFavoriteMovies(this.state.userID, (favoriteMovies) =>{
            this.setState({
                favoriteMovies: favoriteMovies
            });
        });
    };
}