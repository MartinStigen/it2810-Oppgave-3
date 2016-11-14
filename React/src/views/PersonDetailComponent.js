import React, {Component} from "react";

import MovieCardComponent from '../components/MovieCardComponent';
import {getPerson} from '../functions/APIFunctions';
import PieChart from 'react-simple-pie-chart';

import styles from '../styles/person-detail-component.css';


var http = require('http');

export default  class PersonDetailComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.params.name,
            cast: [],
            director: [],
            writer: []
        }
    }

    render() {
        const {name} = this.state;
        const chart = <PieChart
          slices={[
            {
              color: 'red',
              value: this.state.cast.length,
            },
            {
              color: 'green',
              value: this.state.director.length,
            },
            {
              color: 'blue',
              value: this.state.writer.length,
            },
          ]}
        />


        const cast = this.state.cast.map(movie => { return (<MovieCardComponent small={true} movie={movie} key={movie.ID} />) });
        const director = this.state.director.map(movie => { return (<MovieCardComponent small={true} movie={movie} key={movie.ID} />) });
        const writer = this.state.writer.map(movie => { return (<MovieCardComponent small={true} movie={movie} key={movie.ID} />) });
        
        return (
            <div className="container-768">
                <div className="person-detail detail-box">
                	<div className="chart-box">
                		<div id="legend"><p id="cast"> Cast </p><p id="director"> Director </p><p id="writer"> Writer </p></div>
                		{chart}
                	</div>
                    <h1>{name}</h1>
                </div>
                <div className="cast-in detail-box box">
                    <h3>Cast in</h3>
                    <ul><li>{cast}</li></ul>
                </div>
                <div className="director-in detail-box box">
                    <h3>Director</h3>
                    <ul><li>{director}</li></ul>
                </div>
                <div className="writer-in detail-box box">
                    <h3>Writer</h3>
                    <ul><li>{writer}</li></ul>
                </div>
            </div>
        );
    }

    componentDidMount() {
        getPerson(this.state.name, function (personData) {
            this.setState({
                cast: personData[0],
                director: personData[1],
                writer: personData[2]
            });
        }.bind(this));
    }
}