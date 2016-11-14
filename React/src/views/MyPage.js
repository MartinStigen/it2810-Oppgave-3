import React, {Component} from "react";
import UserInfo from "../components/UserInfo";
import SeenMovies from "../components/SeenMovies";
import FavoriteMovies from "../components/FavoriteMovies";
import UserSearchHistory from "../components/UserSearchHistory";
import {getUser, getUserID} from '../functions/APIFunctions';
import FacebookLogin from 'react-facebook-login';

export default  class MyPage extends Component {
    constructor() {
        super();
        this.state = {
            userID: 1,
            userData: []
        };
    }

    render() {
        if (this.state.userID != -1) {
            return (
                <div className="container-768">
                    <UserInfo user={this.state.userData}/>
                    <SeenMovies userID={this.state.userID} />
                    <FavoriteMovies userID={this.state.userID} />
                    <UserSearchHistory userID={this.state.userID} />
                </div>
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
            )
        }
    }

    componentWillMount() {
        getUserID(function (id) {
            if (id == -1) {
                window.location = "/login";
            }
            else {
                this.setState({userID: id});
                getUser(this.state.userID, function (userData) {
                    this.setState({userData: userData});
                }.bind(this));
            }
        }.bind(this));
    }
}
