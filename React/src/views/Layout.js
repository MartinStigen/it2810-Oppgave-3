import React, {Component} from 'react';


import NavBar from './NavBar';
import styles from '../styles/layout.css';


/*  main layout that always renders navbar and the rest of chosen content */
export default class Layout extends Component {
    render() {
        return (
            <div>
                <NavBar />
                {/* move-content-down moves content down just below navbar */}
                <div className="move-content-down"/>
                    {/* component that is selected by the router based on the current url */}
                    {this.props.children}
            </div>
        );
    }
}       
