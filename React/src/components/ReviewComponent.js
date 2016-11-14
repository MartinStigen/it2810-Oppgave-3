import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

require('react-datepicker/dist/react-datepicker.css');
import styles from '../styles/review-component.css'

export default class ReviewComponent extends Component {
	constructor() {
		super();
		this.state = {
			date: moment()
		}
	}
	render() {
		const {movie} = this.props;

		return (
			<div className="review-component">
				<form action="">
					<h3>Review:</h3>
					<span>Date watched: </span><DatePicker className="date-picker" selected={this.state.date} onChange={this.handleChange.bind(this)} />
					<textarea placeholder="Write your review text... (Optional)" className="review-text" rows="5" />
					<p>Rating: <input type="number" name="rating" min="1" max="5" /> /5</p><br />
					<input type="submit" value="Submit" />
				</form>
			</div>
		);
	}

	handleChange(date) {
		this.setState({
			date: date
		});
	}
}