//Requires 5 Database calls
export function getMovie(id, logSession, callback) {
    var query = '/api/movie?id=' + id;
    if (logSession) {
        query += '&logMovieToSession=yes'
    }
    fetchFromServer(query).then(movie => {
        createMovieObject(movie).then(movie => {
            callback(movie);
        });
    });
}

//Function to fast get Movie objects, not having all data - Requires only 1 Database call
export function getMoviesSimple(query, callback) {
    fetchFromServer('/api/movies?' + query).then(movies => {
        callback(movies);
    });
}

export function getNewestMovies(callback) {
    fetchFromServer('/api/movies/newest').then(movies => {
        callback(movies);
    });
}

export function getMoviesSession(callback) {
    fetchFromServer('/api/session/movies').then(movies => {
        callback(movies);
    });
}

//Requires n*5 Database calls
export function getMovies(query, callback) {
    fetchFromServer('/api/movies?' + query).then(movies => {
        Promise.all(movies.map(movie => {
            return createMovieObject(movie);
        })).then(movies => {
            callback(movies);
        });
    });
}


export function getCountMovieMatches(query, callback) {
    fetchFromServer("/api/count?" + query).then(count => {
        callback(count[0].Count);
    });

}

export function getMoreMovies(callback) {
    fetchFromServer("/api/session/more").then(movies => {
        Promise.all(movies.map(movie => {
            return createMovieObject(movie);
        })).then(movies => {
            callback(movies);
        });
    });
}

export function getAllGenres(callback) {
    fetchFromServer('/api/all/genres').then(genres => {
        callback(genres);
    });
}

export function getSeenMovies(userid, callback) {
    getUserID(function (id) {
        if (id != -1) {
            fetchFromServer("/api/seenMovies?userID=" + id).then(movieIDs => {
                Promise.all(movieIDs.map(movieID => {
                    return fetchFromServer("/api/movie?id=" + movieID.SeenMovieID).then(movie => {
                        return createMovieObject(movie);
                    })
                })).then(movies => {
                    callback(movies);
                });
            });
        }
        else {
            callback([]);
        }
    })
}

export function getFavoriteMovies(userID, callback) {
    getUserID(function (id) {
        if (id != -1) {
            fetchFromServer('/api/favoriteMovies?userID=' + id).then(movieIDs => {
                Promise.all(movieIDs.map(movieID => {
                    return fetchFromServer("/api/movie?id=" + movieID.FavoriteMovieID).then(movie => {
                        return createMovieObject(movie);
                    })
                })).then(movies => {
                    callback(movies);
                });
            });
        }
        else {
            callback([]);
        }
    })

}

export function getUserSearchHistoryMovies(userID, callback) {
    fetchFromServer('/api/userSearchHistory?userID=' + userID).then(movieIDs => {
        Promise.all(movieIDs.map(movieID => {
            return fetchFromServer("/api/movie?id=" + movieID.SearchMovieID).then(movie => {
                return createMovieObject(movie);
            })
        })).then(movies => {
            callback(movies);
        });
    });
}

export function getUser(id, callback) {
    fetchFromServer("/api/user?id=" + id).then(userData => {
        callback(userData);
    });
}

export function getPerson(name, callback) {
    fetchFromServer("/api/person?name=" + name).then(personData => {
        Promise.all([getCastMovies(personData.Cast), getDirectorMovies(personData.Director), getWriterMovies(personData.Writer)]).then(responses => {
            Promise.all(responses.map(movies => {
                return Promise.all(movies.map(movie => {
                    return fetchFromServer('/api/movie?id=' + movie.MovieID);
                }))
            })).then(results => {
                callback(results);
            });
        })
    })
}

export function getUserID(callback) {
   fetch('/api/getLoginID', {
        credentials: "same-origin"
    }).then(response => {
        return response.json();
    }).then(result => {
        callback(result);
    });
}
export function postSeenMovie(userID, movieID) {
    getUserID(function (id) {
        if (id != -1) {
            fetchFromServer('/api/insertSeenMovies?userID=' + id + '&movieID=' + movieID).then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Hobbits destroyed something on the server");
                }
            });
        }
        else {
            window.location = "/login";
        }
    })
}

export function postFavoriteMovie(userID, movieID) {
    getUserID(function (id) {
        if (id != -1) {
            fetchFromServer('/api/insertFavoriteMovies?userID=' + id + '&movieID=' + movieID).then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Hobbits destroyed something on the server");
                }
            });
        }
        else {
            window.location = "/login";
        }
    })
}

function getCast(id) {
    return fetchFromServer('/api/cast?id=' + id);
}

function getCountries(id) {
    fetchFromServer('/api/countries?id=' + id);
}

function getDirectors(id) {
    return fetchFromServer('/api/directors?id=' + id);
}

function getGenres(id) {
    return fetchFromServer('/api/genres?id=' + id);
}

function getLanguages(id) {
    fetchFromServer('/api/languages?id=' + id);
}

function getWriters(id) {
    return fetchFromServer('/api/writers?id=' + id);
}

function getCastMovies(id) {
    return fetchFromServer('/api/person/castmovies?id=' + id);
}

function getDirectorMovies(id) {
    return fetchFromServer('/api/person/directormovies?id=' + id);
}

function getWriterMovies(id) {
    return fetchFromServer('/api/person/writermovies?id=' + id);
}


function createMovieObject(movie) {
    return Promise.all([getCast(movie.ID), getDirectors(movie.ID), getGenres(movie.ID), getWriters(movie.ID)]).then(responses => {
        movie.Cast = responses[0];
        movie.Directors = responses[1];
        movie.Genres = responses[2];
        movie.Writers = responses[3];
        return movie;
    });
}

function fetchFromServer(query) {
    return fetch(query, {
        credentials: "same-origin"
    }).then(response => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    }).then(function(result) {
        if(result.error || result.length == 0) {
            return [];
        }
        else {
            return JSON.parse(result);
        }
    });
}
