import React, { Component } from 'react';

import MovieCardComponent from './MovieCardComponent';
import {getMoviesSimple, getMoviesSession, getSeenMovies, getNewestMovies, getUserID} from '../functions/APIFunctions';


import Carousel from 'nuka-carousel';

import styles from '../styles/moveslider-component.css';

const Decorators = [
  {
    component: React.createClass({
      render() {
        return (
          <button style={this.getButtonStyles(this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount)} onClick={this.props.nextSlide}>&#x21E8;</button>
        )
      },
      getButtonStyles(disabled) {
        return {
          border: 0,
          background: 'rgba(0,0,0,0.4)',
          color: 'white',
          padding: 10,
          outline: 0,
          opacity: disabled ? 0.3 : 1,
          cursor: 'pointer'
        }
      }
    }),
    position: 'CenterRight'
  },
    {
        component: React.createClass({
            render() {
                return (
                    <button style={this.getButtonStyles(this.props.currentSlide === 0)} onClick={this.props.previousSlide}>&#x21E6;</button>
                )
            },
            getButtonStyles(disabled) {
                return {
                    border: 0,
                    background: 'rgba(0,0,0,0.4)',
                    color: 'white',
                    padding: 10,
                    outline: 0,
                    opacity: disabled ? 0.3 : 1,
                    cursor: 'pointer'
                }
            }
        }),
        position: 'CenterLeft'
    }
];


export default class MovieSlider extends Component {
    constructor(props) {
      super(props);
      this.state = {
        movies: [],
        title: props.title
      };
    }

    render() {
        var movies = this.state.movies.map(function (movieData) {
            return (
                <MovieCardComponent movie={movieData} key={movieData.ID} />
            )
        });
        if (movies.length > 0) {
            return (
                <div>
                    <h2>{this.state.title}</h2>

                    <div>
                        <Carousel className="movie-slider" slideWidth={"300px"} slidesToShow={5.5} dragging={true} wrapAround={true} framePadding={"20px"} decorators={Decorators}>
                            {movies}
                        </Carousel>
                    </div>
                </div>
            )
        }
        return (
           null
        )
    }

    componentDidMount() {
        if (this.props.show == "session") {
            getMoviesSession(function (movies) {
                this.setState({movies: movies});
            }.bind(this));
        }
        else if(this.props.show == "seenByYou") {
            getSeenMovies(1, function (movies) {
                this.setState({movies: movies});
            }.bind(this));
        }
        else if(this.props.show == "newest") {
            getNewestMovies(function (movies) {
                this.setState({movies:movies});
            }.bind(this));
        }
        else {
            getMoviesSimple("", function (movies) {
                this.setState({movies: movies});
            }.bind(this));
        }
    }
}
