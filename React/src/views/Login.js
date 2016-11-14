import React, {Component} from 'react';
import { Link } from 'react-router';
import styles from '../styles/login.css';

import {getUserID} from '../functions/APIFunctions';
import FacebookLogin from 'react-facebook-login';


/* login form with username and password fields using bootstrap forms and form groups */
export default class Login extends Component {

    constructor() {
        super();
        this.state = {
            login: false
        }
    }

    facebookReponse(response) {
        fetch('/api/login?id=' + response.id +"&name=" + response.name + "&picture=" + response.picture.data.url, {
            credentials: "same-origin"
        }).then(window.location = "/mypage"
        );
    }

    componentWillMount() {
        getUserID(function (id) {
            if (id == -1) {
                this.setState({login: false});
            }
            else {
                this.setState({login: true});
            }
        }.bind(this));
    }

    render() {

        if (this.state.login) {
            return (
                <h3>You are logged in! Feel free to use MyPage</h3>
            );
        }
        else {
            return (
                <div className="container-768">
                    <div className="detail-box">
                        <h1>Login</h1>
                        <FacebookLogin
                            appId="227688304265630"
                            autoLoad={false}
                            fields="id,name,email,picture"
                            callback={this.facebookReponse} />
                    </div>
                </div>
            );
        }
    }
}