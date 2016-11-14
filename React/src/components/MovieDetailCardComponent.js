import React, {Component} from 'react';
import { Link } from 'react-router';
import styles from '../styles/moviedetailcard-component.css';

import ShowPosterComponent from './ShowPosterComponent';
import {getGenres, getDirectors, getWriters, getCast, postSeenMovie, postFavoriteMovie} from '../functions/APIFunctions';

/* lists details about a movie */

export default class MovieDetailCardComponent extends Component {
    constructor (props) {
        super(props);
        this.state = {
            link: props.link,
            movie: props.movie,
            showPoster: false
        }
    }

  render() {
      const {movie} = this.state;
      const genre = this.linkMap(movie.Genres, false);
      const directors = this.linkMap(movie.Directors, true);
      const writers = this.linkMap(movie.Writers, true);
      const cast = this.linkMap(movie.Cast, true);

        return(
        <div className="detail-card-component detail-box">
            <img className="detail-card-image" src={"/images/" + movie.ID + ".jpg"} alt={`${movie.Title}'s poster`}/>
            <div className="detail-card-content">

                <h2 className="detail-card-title">{movie.Title} ({movie.Year})</h2>
              <p>
                  <strong>Genres:</strong> {genre}
                  <button className="btn btn-default pull-right" onClick={this.postSeenMovieClicked.bind(this)}>
                      <span className="glyphicon glyphicon-eye-open"></span>
                  </button>
                  <button className="btn btn-default pull-right" onClick={this.postFavoriteMovieClicked.bind(this)}>
                      <span className="glyphicon glyphicon-heart-empty"></span>
                  </button>
              </p>
              <p><strong>Runtime:</strong> {movie.Runtime} minutes</p>
              <p className="detail-card-content-item"><strong>Directed by</strong> {directors} | <strong>Written by</strong> {writers}</p>
              <p><strong>Cast:</strong> {cast} </p>
              <p><strong>Metacritic:</strong> {movie.Metacritic}/100, <strong>IMDB Rating:</strong> {movie.IMDBRating}/10</p>
            </div>
        </div>
        );
  }

    postSeenMovieClicked() {
        postSeenMovie(1,this.state.movie.ID);
    }

    postFavoriteMovieClicked() {
        postFavoriteMovie(1,this.state.movie.ID)
    }

  componentWillReceiveProps(nextProps) {
      this.setState({movie: nextProps.movie});
  }

    linkMap(list, person) {
        if (list == null) {
            return "";
        }
        const result = list.map(function (item, index) {
            var comma = ", ";
            if (index === list.length - 1) {
                comma = "";
            }
            if (this.state.link) {
                if (person) {
                    return <span key={item.ID}><Link to={{pathname: '/person/' + item[Object.keys(item)[0]]}}>{item[Object.keys(item)[0]]}</Link>{comma}</span>
                }
                return <span key={item.ID}><Link to={{pathname: '/'}}>{item[Object.keys(item)[0]]}</Link>{comma}</span>
            }
            else {
                return <span key={item.ID}>{item[Object.keys(item)[0]]}{comma}</span>
            }
        }.bind(this));
        return result;
    }
}
