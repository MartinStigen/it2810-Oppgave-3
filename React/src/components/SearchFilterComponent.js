import React, {Component} from 'react';

import jquery from 'jquery';

import ReactDOM from 'react-dom';

import {getAllGenres} from '../functions/APIFunctions';

import styles from '../styles/searchfilter-component.css';
import FilterGenreComponent from './FilterGenreComponent';
import FilterMetaScoreComponent from './FilterMetaScoreComponent';
import FilterButtonsComponent from './FilterButtonsComponent';
import FilterYearComponent from './FilterYearComponent';


export default class SearchFilterComponent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            genres: [],
            minYear: 1930,
            maxYear: 2017
        };
    }

    render() {
        var self = this;
        function resizeWidth() {
            var existingWidth = $(document).data('resize-width');
            var newWidth = $(document).width();
            if (existingWidth != newWidth) {
                if ($(window).width() < 1030) {
                  self.handleHeaderClick(1);
                }
                else if ($(window).width() > 1030) {
                  self.handleHeaderClick(2);
                }
            };
        };

        $(window).resize(resizeWidth);

        var genreCheckboxes = this.state.genres.map(function (genre) {
            return (
                <span key={genre.ID} className="form-input"><input type="checkbox" name="genre" value={genre.Genre} onClick={this.submitForm} /> {genre.Genre} </span>
            )
        }.bind(this));
        return(
            <div className="filter-component">
                <div className="filter-header">
                  <h3 className="filter-title">Filter</h3>
                  <button ref="showFilterButton" className="show-filter-button" onClick={this.handleHeaderClick.bind(this,0)}>-</button>
                </div>
                <form ref="filterForm" id="filter-form" className="filter-form" onSubmit={this.handleSubmit.bind(this)}>
                    <FilterGenreComponent genres={this.state.genres} />

                    <FilterYearComponent minYear={this.state.minYear} maxYear={this.state.maxYear} />

                    <FilterButtonsComponent />

                </form>
            </div>
        );
    }
    //
    //<FilterMetaScoreComponent />
    handleSubmit(event){
        event.preventDefault();
        var form = $(ReactDOM.findDOMNode(this.refs.filterForm)).serializeArray();
        if(form[form.length - 2].value === ""){
            form[form.length - 2] = 1900;
        }
        else if(form[form.length-1].value === "") {
            form[form.length-1] = 3000;
        }
        this.props.handleFilterSearch(form);
    }


    submitForm(e){
        document.getElementById('submit-button').click();
    }

    handleHeaderClick(plus){
      var button = ReactDOM.findDOMNode(this.refs.showFilterButton);
        if (button) {
          var div = document.getElementById('filter-form');
          if(plus === 1){
            button.firstChild.data = "+";
            div.style.display = "none";
          }
          else if(plus === 2 || button.firstChild.data === "+" ){
            button.firstChild.data = "-";
            div.style.display = "inline";
          }
          else{
            button.firstChild.data = "+";
            div.style.display = "none";
          }
        }
    }
    componentDidMount() {
        getAllGenres(function (genres) {
            this.setState({genres: genres});
        }.bind(this));
  }
}
