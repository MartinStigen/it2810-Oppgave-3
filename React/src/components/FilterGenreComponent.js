import React, {Component} from 'react';

import styles from '../styles/searchfilter-component.css';

export default class FilterGenreComponent extends Component{
    
    render(){
        var genreCheckboxes = this.props.genres.map(function (genre) {
            return (
                <span key={genre.ID} className="form-input"><input type="checkbox" name="genre" value={genre.Genre} onClick={this.submitForm} /> {genre.Genre} </span>
            )
        }.bind(this));

        return(
            <div>
                <div id="genre-objects" className="filter-object-group-hidden">
                    <h4>Genre</h4>
                    {genreCheckboxes}
                </div>
                <p onClick={this.showMore.bind(this,"genre-objects", "show-more-genre")} id="show-more-genre" className="show-more-button">More..</p>
            </div>
        );
    }

    showMore(divId, buttonId,e){
        var buttonClicked = document.getElementById(buttonId);
        var linkText = buttonClicked.firstChild.data;
        var div = document.getElementById(divId);

        if(linkText === "More.."){
            linkText = "Less..";
            div.setAttribute('class','filter-object-group-show')
        } else {
            linkText = "More..";
            div.setAttribute('class','filter-object-group-hidden')
        };
        buttonClicked.firstChild.data = linkText;
    }
    submitForm(e){
        document.getElementById('submit-button').click();
    }
}
