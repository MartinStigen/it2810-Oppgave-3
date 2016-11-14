import React, {Component} from 'react';

import styles from '../styles/searchfilter-component.css';

export default class FilterButtonsComponent extends Component{
    render(){
        return(
            <div className="form-input">
                <button id="submit-button" type="submit"> Filter </button>
                <button type="reset" onClick={this.submitForm.bind(this)}> Reset </button>
            </div>
        );
    }
    
    submitForm(e){
        document.getElementById('submit-button').click();
    }
}
