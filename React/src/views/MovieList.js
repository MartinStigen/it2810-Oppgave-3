import React, {Component} from 'react';

import MovieSlider from '../components/MovieSliderComponent';

import styles from '../styles/movielist.css';

/* main grid that lists all movies found in data.json */
export default class MovieList extends Component {
  constructor() {
    super();
    this.state = {
      movies: []
    };
  }

  /* renders div with all MovieCardComponents | No changes to data should be done in render*/
  render() {
    return (
        <div>
            <MovieSlider title="Popular Movies" show=""/>
            <MovieSlider title="New Movies" show="newest"/>
            <MovieSlider title="Seen by you" show="seenByYou"/>
            <MovieSlider title="Recently visited by you" show="session"/>
        </div>
    );

  }
}
