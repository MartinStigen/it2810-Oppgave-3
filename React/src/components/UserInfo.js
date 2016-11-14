import React, {Component} from "react";
import { Link } from 'react-router';
import styles from "../styles/userinfo.css";

export default class UserInfo extends Component {


    render() {
        const {user} = this.props;

        return (
            <div className="row user-info-card detail-box">
                <div className="col-sm-8 col-md-8">
                    <h1><strong>{user.Username}</strong></h1>
                </div>
            </div>
        )

    }
}