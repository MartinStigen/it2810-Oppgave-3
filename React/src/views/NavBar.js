import React, {Component} from 'react';
import { Link } from 'react-router';

import SearchDropdownFieldComponent from '../components/SearchDropdownFieldComponent';

import styles from '../styles/navbar.css';

/* navigation bar that sticks to the top */
export default class NavBar extends Component {
    constructor() {
        super();
        this.state = {
            collapsed: true,
            showDropdown: false,
            searchBoxId: "search-box"
        };
    }

    /* takes care of window resizing and collapsing navbar if window is too small */
    toggleCollapse() {
        const collapsed = !this.state.collapsed;
        this.setState({collapsed});
    }

    toggleDropdown() {
        const show = !this.state.showDropdown;
        this.setState({showDropdown: show});
    }

    showDropdown() {
        this.setState({showDropdown: true},
            this.focusOnInput
        );
    }

    hideDropdown() {
        this.setState({showDropdown: false},
            this.removeFocus
        );
    }

    focusOnInput() {
        const searchBox = document.getElementById(this.state.searchBoxId);
        searchBox.focus();
        searchBox.select();
    }

    removeFocus() {
        const searchBox = document.getElementById(this.state.searchBoxId);
        searchBox.blur();
    }
    
    render() {
        const {collapsed} = this.state;
        const navClass = collapsed ? "collapse" : "";

        /* renders navigation bar with its interactive components */
        return (
          <nav className="navbar navbar-inverse navbar-fixed-top">

                <Link className="navbar-brand" to="/">MovieTime</Link>

                <p onClick={this.toggleDropdown.bind(this)} className="navbar-text">Type to search...</p> 

                {/* sandwich menu for small screen */}
                <button type="button" className="navbar-toggle" onClick={this.toggleCollapse.bind(this)}>
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>

                {/* search */}
                <SearchDropdownFieldComponent searchBoxId={this.state.searchBoxId} show={this.state.showDropdown} showDropdown={this.showDropdown.bind(this)} hideDropdown={this.hideDropdown.bind(this)} />
                <button type="button" className="btn navbar-btn pull-right" onClick={this.toggleDropdown.bind(this)}><span className="glyphicon glyphicon-search"></span></button>

                <div className={"navbar-collapse " + navClass}>

                    {/* links to additional pages */}
                    <ul className="nav navbar-nav pull-right">
                        <li>
                            <Link to="/" activeClassName="active">Home</Link>
                        </li>
                        <li>
                            <Link to="/analytics" activeClassName="active">Analytics</Link>
                        </li>
                        <li>
                            <Link to="/mypage">My Page</Link>
                        </li>
                    </ul>
                </div>
                <ul className="nav navbar-nav navbar-right social" />
            </nav>
    );
  }
}

