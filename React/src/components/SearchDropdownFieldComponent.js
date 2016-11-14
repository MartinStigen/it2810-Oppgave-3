import React, {Component} from 'react';
import { Link } from 'react-router';

import {getMoviesSimple} from '../functions/APIFunctions';

import '../styles/search-dropdown-field-component.css';

/* shows input field and search button */
export default class SearchDropdownFieldComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            search: "",
            movies: [],
        };
    }

    getMovies(title) {
        fetch('/api/movies?title=' + title).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(stories) {
            //Updating state with setState causes render to happen again
            this.setState({movies: JSON.parse(stories).slice(0,6)});
        }.bind(this));
    }

    componentDidMount() {
        $(document.body).on('keydown', this.handleKeyboard.bind(this));
    }

    componentWillReceiveProps(newProps) {
        this.setState({show: newProps.show});
    }

	render() {
        var movieSearchComponents = this.getMovieComponents();
        var dropdownBoxClassName = 'dropdown-box';
        var dropdownBoxBackgroundClassName = 'dropdown-box-background';
        if (this.props.search === '' || !this.state.show) {
            dropdownBoxBackgroundClassName += ' hidden';
            dropdownBoxClassName += ' hidden';
        }

		return (
            <div>
                <div className={dropdownBoxBackgroundClassName} onClick={this.props.hideDropdown}></div>
                <div className={dropdownBoxClassName}>
                    <form className="form-control">
                        <input autoComplete="off" id={this.props.searchBoxId} className="form-control" type="text" onChange={this.handleChange.bind(this)} placeholder="Type movie title..."/>
                        <Link to={{ pathname: '/search/' + this.state.search }}><button className="btn btn-default search-button" onClick={this.props.hideDropdown} type="submit">Search</button></Link>
                    </form>
                    <h5 className="search-explanation">Search for movies, press <strong>Enter</strong> for advanced search, <strong>esc</strong> to cancel.</h5>
                    {movieSearchComponents}
                </div>
            </div>
        );
	}

    isAlphaNumeric(e) {
        var keycode = e.keyCode;

        var valid = 
            (keycode > 47 && keycode < 58)   || // number keys
            keycode == 32   || // spacebar & return key(s) (if you want to allow carriage returns)
            (keycode > 64 && keycode < 91)   || // letter keys
            (keycode > 95 && keycode < 112)  || // numpad keys
            (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
            (keycode > 218 && keycode < 223);   // [\]' (in order)

        return valid;
    }

    handleKeyboard(e) {
        const activeElementName = document.activeElement.tagName.toLowerCase();
        if (!(activeElementName === "input" || activeElementName === "textarea")) {
            if (this.isAlphaNumeric(e)) {
                if (!this.state.show) {
                    this.props.showDropdown();
                }
            } 
        }
        if (e.keyCode == 27) {
            this.props.hideDropdown();
        }     
    }

    /* updates search state to current user input */
    handleChange(e) {
        const {value} = e.target;
        this.setState({search: value});
        this.getMovies(value);
    }

	/* updates search state to current user input */
    getMovieComponents() {
        if (!this.state.search) {
            return []
        }
        return this.state.movies.map(movie => {
            const {search} = this.state;
            const searchLength = search.length;
            const title = movie.Title;
            const indexOfSearch = movie.Title.toLowerCase().indexOf(search.toLowerCase());

            var movieSearchText = <h3 className="movie-title"><span>{title.substring(0, indexOfSearch)}</span><span className="searched">{title.substring(indexOfSearch, indexOfSearch + searchLength)}</span><span>{title.substring(indexOfSearch + searchLength)}</span> ({movie.Year})</h3>
            if (indexOfSearch < 0) {
            movieSearchText = <h3 className="movie-title">{title} ({movie.Year})</h3>
            }

            return (
                <Link key={movie.ID} onClick={this.props.hideDropdown} to={{ pathname: '/details/' + movie.ID }}>
                    <div className="dropdown-box-single">
                        <img className="dropdown-poster" src={"/images/" + movie.ID + ".jpg"} alt={movie.Title} />
                        {movieSearchText}
                    </div>
                </Link>
            )
        });
    }
}