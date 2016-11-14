
import React, {Component} from "react";
import MovieCardComponent from "./MovieCardComponent";
import {getMoviesSession} from "../functions/APIFunctions";

import styles from "../styles/usersearch-history.css";

export default class UserSearchHistory extends Component {

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

        if (components.length > 0) {
            return (
                <div className="user-search-history-card row ">
                    <h3>My search history this session</h3>
                    {components}
                </div>
            );
        }
        else {
            return null;
        }

    }

    componentDidMount() {
        getMoviesSession(function (movies) {
            this.setState({movies: movies});
        }.bind(this));
    };
}