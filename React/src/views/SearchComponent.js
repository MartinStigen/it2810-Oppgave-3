import React, {Component} from 'react';
import { Link } from 'react-router';


import SearchFilterComponent from '../components/SearchFilterComponent';
import MovieDetailCardComponent from '../components/MovieDetailCardComponent';
import SortSearchComponent from '../components/SortSearchComponent';
import {getMovies, getCountMovieMatches, getMoreMovies} from '../functions/APIFunctions';

import styles from '../styles/search-component.css';


import ReactList from 'react-list';

/*  search */
export default class SearchComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
        searchString: this.props.params.title.toLowerCase(),
        movieRelevanceIds: [],
        numberOfMovies: 0,
        update: false,
        movies: [],
        filter: [],
        filteredMovies: []
    };
  }

  componentDidMount() {
      const query = "title=" + this.state.searchString;
      getMovies(query, function (movies) {
          this.setState({movies: movies, movieRelevanceIds: movies.map(function(a) {return a.ID;}) })
      }.bind(this));
      getCountMovieMatches(query, function (number) {
          this.setState({numberOfMovies: number});
      }.bind(this));
  }

  componentWillReceiveProps(nextProps) {
      const query = "title=" + nextProps.params.title;
      getMovies(query, function (movies) {
          this.setState({movies: movies, searchString: nextProps.params.title, movieRelevanceIds: movies.map(function(a) {return a.ID;}) })
      }.bind(this));
      getCountMovieMatches(query, function (number) {
          this.setState({numberOfMovies: number});
      }.bind(this));
   }

  /* renders the results of the search in form of movie-detail cards */
  render() {
      var loaded = this.state.movies.length;
      return(
          <div className="search-page">
              <h1>Search</h1>
              <div>
                  <p id="search-amount-results" className="search-head">Loaded <strong>{loaded}</strong>/{this.state.numberOfMovies} result(s) for <strong>"{this.state.searchString}"</strong></p>
                  <SortSearchComponent searchString={this.state.searchString} movies={this.state.movies} handleSortSearch={this.handleSortSearch.bind(this)}/>
              </div>
              <div className="search-container">
                  <div className="search-filter">
                      <SearchFilterComponent searchString={this.state.searchString} movies={this.state.movies} handleFilterSearch={this.handleFilterSearch.bind(this)}/>
                  </div>
                  <div className="search-list">
                      <ReactList
                          itemRenderer={this.renderItem.bind(this)}
                          length = {this.state.numberOfMovies}
                          type='variable'
                      > </ReactList>
                  </div>
              </div>
          </div>
      );
  }
  sortFunc(a, b, sortArray) {
      var sortArray = deepcopy(this.state.movieRelevanceIds);
      return sortArray.indexOf(a[1]) - sortArray.indexOf(b[1]);
  }

  handleSortSearch(paramater){
      if(paramater === "Relevance"){
          this.setState({
              movies: this.state.movies.sort(sortRelevance(this.state.movieRelevanceIds))
          });
      }
      else{
          this.setState({
              movies: this.state.movies.sort(sortBy(paramater))
          });
      }
  }

  handleFilterSearch(parsedForm){
      this.setState({filter: parsedForm});
  }

  filteredMovies() {
      var {movies, filter} = this.state;
      var filtered = movies.filter(movie => {
          for (var i = 0; i < filter.length; i ++) {
              if (filter[i].name === "genre") {
                  if (movie.Genres.map(object => {return object.Genre}).indexOf(filter[i].value) == -1) {
                      return false;
                  }
              }
            else if(filter[i].name === "minYear") {
                  if(movie.Year < filter[i].value ){
                      return false;
                  }
            }
            else if(filter[i].name === "maxYear") {
                if(movie.Year > filter[i].value){
                    return false;
                }
            }
          }
          return true;
      });
      return filtered;
  }

  renderItem(index, key) {
      if (this.state.movies.length != 0 && this.state.update == false) {
          if (index >= this.state.movies.length) {
              this.state.update = true;
              getMoreMovies(function (movies) {
                  this.setState({movies: this.state.movies.concat(movies), update: false});
              }.bind(this));
          }
          else {
              const filtered = this.filteredMovies();
              if (index < filtered.length) {
                  const movieData = filtered[index];
                  return <div key={key}><Link to={{ pathname: '/details/' + movieData.ID }}><MovieDetailCardComponent movie={ movieData } link={false}/></Link></div>;
              }
              else if (this.state.movies.length < this.state.numberOfMovies) {
                  this.state.update = true;
                  getMoreMovies(function (movies) {
                      this.setState({movies: this.state.movies.concat(movies), update: false});
                  }.bind(this));
              }
          }
      }
  }
}
function sortBy(paramater){
    var order = 1;
    if(paramater[0] === "-"){
        order = -1;
        paramater = paramater.substr(1);
    }
    return function(a,b){
        return ((a[paramater] < b[paramater]) ? -1 : (a[paramater] > b[paramater]) ? 1 : 0) * order;
    }
}

function sortRelevance(sortingArray){
    return function(a,b){
        var indexA = sortingArray.indexOf(a['ID']);
        var indexB = sortingArray.indexOf(b['ID']);
        if(indexA < indexB) {
            return -1;
        }else if(indexA > indexB) {
            return 1;
        }else{
            return 0;
        }
    };
}
