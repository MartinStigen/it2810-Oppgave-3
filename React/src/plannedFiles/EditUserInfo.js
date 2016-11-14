import React, {Component} from 'react';
import styles from '../styles/edit-userinfo.css';


export default class EditUserInfo extends Component {
    constructor(){
        super();
        this.state = {
            username: "",
            firstName: "",
            lastName: ""
        }
    }


    render() {
        return (
            <div className="container-768">
                <h1>Edit Profile</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input id="username" className="form-control" placeholder="Username"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="firstName">First name:</label>
                        <input id="firstName" className="form-control" placeholder="First name"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last name:</label>
                        <input id="lastName" className="form-control" placeholder="Last name"/>
                    </div>

                    <button type="submit" className="btn btn-default">Save</button>
                </form>
            </div>
        );
    }
}