import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory} from 'react-router';

/* custom components import */
import Analytics from './views/Analytics';
import Layout from './views/Layout';
import Login from './views/Login';
import MovieDetails from './views/MovieDetails';
import MovieList from './views/MovieList'
import SearchComponent from './views/SearchComponent';
import Signup from './plannedFiles/Signup';
import MyPage from './views/MyPage';
import EditUserInfo from './plannedFiles/EditUserInfo';
import PersonDetailComponent from './views/PersonDetailComponent';

import styles from '../client/public/css/index.css';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const app = document.getElementById('app');

/* routing using ReactRouter */
ReactDOM.render(
	/* history takes care of previous states during the session */
	<Router history={browserHistory}>
		{/* loads main layout */}
		<Route path="/" component={Layout}>
			{/* IndexRoute selects default component that will be loaded */}
			<IndexRoute component={MovieList}></IndexRoute>
			{/* other routes that load components when path matches string after / (slash) */}
			<Route path="/analytics" component={Analytics} />
			<Route path="/login" component={Login} />
			<Route path="/signup" component={Signup} />
			<Route path="/search/:title" component={SearchComponent} />
			<Route path="/details/:id" component={MovieDetails} />
			<Route path="/person/:name" component={PersonDetailComponent} />
			<Route path="/mypage" component={MyPage} />
			<Route path="/editProfile" component={EditUserInfo}/>
		</Route>
	</Router>
, app);
