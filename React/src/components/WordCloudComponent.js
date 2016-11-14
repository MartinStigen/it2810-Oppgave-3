import React, {Component} from 'react';
import styles from '../styles/analytics.css'
import $ from 'jquery';

import {browserHistory} from 'react-router';

import {TagCloud} from 'react-tagcloud';


/* advanced analytics comes here */
export default class WordCloudComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [{value: "temp", count: 1}]
        };
    }
    getTitles() {
        fetch('/api/movies/getAllTitles', {
            credentials: "same-origin"
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(stories) {
            //Updating state with setState causes render to happen again
            var parsedStories = JSON.parse(stories);
            var onlyTitles = parsedStories.map(function(a) {return a.Title;});
            var words = onlyTitles.map(function(a){return a.split(" ")});
            var wordArray = [];
            for(var i = 0; i < words.length; i++){
                var temp = words[i];
                wordArray = wordArray.concat(temp);
            }
            var unique = getUniqueWithCount(wordArray);
            var array = [];
            for(var i = 0; i < unique[0].length; i++){
                if(unique[1][i] > 3){
                    array.push({value: unique[0][i], count: unique[1][i]});
                }
            }
            this.setState({
                data: array
            });
        }.bind(this));
    }

    componentDidMount(){
        this.getTitles();
    }

    render(){
        const data = this.state.data;

        return(
            <div className="detail-box">
                <TagCloud className="word-cloud" minSize={12} maxSize={50} tags={data} onClick={tag => browserHistory.push('/search/' + tag.value)}/>
            </div>
        );
    }

}
function getUniqueWithCount(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        }
        else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    return [a,b];
}
