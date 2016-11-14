import React, {Component} from 'react';

import styles from '../styles/searchfilter-component.css';

export default class FilterYearComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            minYear: this.props.minYear,
            maxYear: this.props.maxYear
        };
    }
  componentWillReceiveProps(nextProps) {
      this.setState({
         minYear: nextProps.minYear,
         maxYear: nextProps.maxYear
      });
  }

  render(){
      return(
          <div >
              <hr />
              <h4>Year</h4>
              <label>From: </label>
              <input type="number" className="input-year" name="minYear" defaultValue={this.state.minYear} placeholder={this.state.minYear} min={this.state.minYear} max={this.state.maxYear} />
              <label>To: </label>
              <input type="number" className="input-year" name="maxYear" defaultValue={this.state.maxYear} placeholder={this.state.maxYear} min={this.state.minYear} />
          </div>
      );
  }

}
