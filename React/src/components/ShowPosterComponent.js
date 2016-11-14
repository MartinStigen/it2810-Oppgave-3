import React, {Component} from 'react';

import styles from '../styles/moviedetailcard-component.css';


/* lists details about a movie */

export default class ShowPosterComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: this.props.show,
            url: this.props.posterSrc,
            title: this.props.altText
        };
    }

    render(){
        var component = this.getPoster();

        var dropdownBoxClassName = 'dropdown-box-background';
        if(!this.state.show){
            dropdownBoxClassName += ' hidden';
        }
        return(
            <div className={dropdownBoxClassName}>
                {component}
            </div>
        );
    }

    getPoster(){
        return(
            <div className="dropdown-box">
                <img src={this.state.url} alt={this.state.title + "'s poster"} />
            </div>

        );
    }

}
