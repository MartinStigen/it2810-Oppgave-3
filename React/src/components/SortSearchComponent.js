import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import styles from '../styles/searchfilter-component.css';


export default class sortSearchComponent extends Component{
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(props) {
        this.setState({movies: props.movies});
    }
    render(){
        return(
            <form id="sort-search" className="search-head">
              <label id="sort-search-dropdown-label">Sort by</label>
              <select onChange={this.handleSubmit.bind(this)} id="sort-search-dropdown" ref="sortDropdown" name="sort">
                  <option value="Relevance">Relevance</option>
                  <optgroup label="Title">
                      <option value="Title">A-Z</option>
                      <option value="-Title">Z-A</option>
                  </optgroup>
                  <optgroup label="Metacritic score:">
                      <option value="-Metacritic">Descending</option>
                      <option value="Metacritic">Ascending</option>
                  </optgroup>
                  <optgroup label="IMDB rating">
                      <option value="-IMDBRating">Descending</option>
                      <option value="IMDBRating">Ascending</option>
                  </optgroup>
                  <optgroup label="Runtime">
                      <option value="-Runtime">Longest</option>
                      <option value="Runtime">Shortest</option>
                  </optgroup>
                  <optgroup label="Year">
                      <option value="-Year">Newest</option>
                      <option value="Year">Oldest</option>
                  </optgroup>
                  </select>
                </form>
        );
    }
    handleSubmit(event){
        event.preventDefault();
        this.props.handleSortSearch(String(ReactDOM.findDOMNode(this.refs.sortDropdown).value));
    }

}
