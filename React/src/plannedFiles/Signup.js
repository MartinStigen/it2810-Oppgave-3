import React, {Component} from 'react';
import { Link } from 'react-router';

import styles from '../styles/signup.css';

export default class Signup extends Component {
    render() {
        return (
            <div className="container-768">
                <div className="detail-box">
                    <h1>Sign up</h1>
                    <form>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input id="username" className="form-control" placeholder="Username"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" className="form-control" placeholder="Email"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" className="form-control" placeholder="Password"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="repeat-password">Repeat password:</label>
                            <input type="password" id="repeat-password" className="form-control" placeholder="Password"/>
                        </div>

                        <div className="checkbox">
                            <label><input type="checkbox"/> Remember me</label>
                        </div>

                        <button type="submit" className="btn btn-default">Login</button>
                        <p>Already registered? Login <Link to="login">here</Link></p>
                    </form>
                </div>
            </div>
        );
    }
}