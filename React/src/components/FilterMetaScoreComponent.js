import React, {Component} from 'react';

import styles from '../styles/searchfilter-component.css';

export default class FilterMetaScoreComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    render(){
        return(
            <div>
                <label>Metacritic Score</label>
                <span className="form-input">
                    <input id="minMetaScore" className="inputScore" type="number" min="0" max="100" name="minMetaScore" placeholder="To" />
                    <span> - </span>
                    <input id="maxMetaScore" className="inputScore" type="number" min="0" max="100" name="maxMetaScore" placeholder="From" />
                </span>
            </div>
        );
    }
}
