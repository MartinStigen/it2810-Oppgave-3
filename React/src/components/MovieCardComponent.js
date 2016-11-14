import React, {Component} from 'react';
import { Link } from 'react-router';
import styles from '../styles/moviecard-component.css';


/* shows single movie with poster that links to movie details */
export default class MovieCardComponent extends Component {
    render() {
        const {movie, small} = this.props;

	/* changing class for smaller version of component */
  	var classNames = "movie-component panel panel-default";
	/* adds extra class name is component defined as small version */
  	if (small) {
  		classNames += " movie-component-small"
  	}
    return(
		/* Link redirects to details?id=[id] which uses MovieDetails to show more details */
		<Link to={{ pathname: '/details/' + movie.ID }}>
			<div className={classNames}>
				<div className="panel-body">
					<img className="movie-poster" src={"/images/" + movie.ID + ".jpg"} alt={`${movie.Title}'s poster`}/>
				</div>
			</div>
		</Link>
    );
  }
}