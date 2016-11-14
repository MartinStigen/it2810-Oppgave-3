var express = require('express');
var path = require('path');
var session = require('express-session');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Database/moviedatabase.db');
var userdb = new sqlite3.Database('./Database/userdatabase.db');

var app = express();
app.set('port', (process.env.PORT || 80));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


app.use(function (req, res, next) {
    next();
});

app.use("/", express.static(__dirname + "/client/public/"));

app.get('/api/login', function(req, res) {
    req.session.userID = req.query["id"];

    var query = "SELECT * FROM USERS WHERE ID=" + req.query["id"];
    var insert = "INSERT INTO USERS (ID,Username,Avatar) VALUES (" + req.query["id"] + ",\'" + req.query["name"] + "\',\'" + req.query["picture"] + "\')";

    userdb.get(query, function (error, rows) {
        if (error || !rows) {
            userdb.run(insert);
        }
    });


    res.json("");
});

app.get('/api/getLoginID', function(req, res) {
    var id = req.session.userID;
    if (!id) {
        id = -1;
    }
    res.json(id);
});

//CAST as in plural cast
//When getting cast only a movie only ID should be supplied in params
app.get("/api/cast", function(req, res) {
    var query = "SELECT C.Cast, C.ID FROM Cast AS C JOIN MovieCast AS MC ON C.ID=MC.CastID AND MC.MovieID=" + req.query["id"];
    returnJSON(db, query, res);
});

app.get("/api/directors", function(req, res) {
    var query = "SELECT D.Director, D.ID FROM Director AS D JOIN MovieDirector AS MD ON D.ID=MD.DirectorID AND MD.MovieID=" + req.query["id"];
    returnJSON(db, query, res);
});

app.get("/api/writers", function(req, res) {
    var query = "SELECT W.Writer, W.ID FROM Writer AS W JOIN MovieWriter AS MW ON W.ID=MW.WriterID AND MW.MovieID=" + req.query["id"];
    returnJSON(db, query, res);
});

app.get("/api/genres", function(req, res) {
    var query = "SELECT G.Genre, G.ID FROM Genre AS G JOIN MovieGenre AS MG ON G.ID=MG.GenreID AND MG.MovieID=" + req.query["id"];
    returnJSON(db, query, res);
});

app.get("/api/analytics", function(req, res) {
    var query = "SELECT COUNT(*) AS count, year, ROUND(AVG(runtime), 2) AS average_runtime, ROUND(AVG(imdbrating), 2) AS average_imdb, ROUND(AVG(metacritic), 2) AS average_metacritic FROM movie GROUP BY year";
    returnJSON(db, query, res);
});

app.get("/api/all/genres", function(req, res) {
    var query = "SELECT * FROM Genre";
    returnJSON(db, query, res);
});

//When getting a single movie only ID should be supplied in params
app.get("/api/movie", function(req, res){
    var query = "SELECT * FROM movie WHERE ID="+ req.query["id"];

    console.log(query);

    db.get(query, function (err, row) {
        if (err) {
            res.json({
                error: 'No rows matched',
            });
            return;
        }
        if (req.query["logMovieToSession"]) {
            logSession(req,row);
        }
        res.json(JSON.stringify(row));
    });
    //returnJSON(query, res);
});

app.get("/api/movies/similar/", function(req, res) {
    var query = "SELECT COUNT(*) AS num, M.* FROM Movie AS M JOIN MovieGenre AS MG ON M.ID=MG.MovieID AND M.ID <> " + req.query["id"] + " JOIN MovieGenre AS MG2 ON MG2.GenreID = MG.GenreID AND MG2.MovieID=" + req.query["id"] + " GROUP BY M.ID ORDER BY num DESC LIMIT 4";
    returnJSON(db, query, res);
});

app.get("/api/movies", function(req, res){
    const param = req.query;
    var query = "SELECT * FROM Movie ";
    if (Object.keys(param).length != 0) {
        query += "WHERE ";
        for (var propName in req.query) {
            if (req.query.hasOwnProperty(propName)) {
                const column = propName;
                const value = req.query[propName];
                query += column + " LIKe '%" +value + "%' AND ";
            }
        }
        query = query.slice(0,-4);
    }
    query += "LIMIT 10";
    req.session.query = query;
    req.session.offset = 10;
    returnJSON(db, query, res);
});

app.get("/api/movies/newest", function(req, res){
    var query = "SELECT * FROM Movie ORDER BY Movie.Year DESC LIMIT 10";
    returnJSON(db, query, res);
});

app.get("/api/movies/getAllTitles", function(req,res){
    var query = "SELECT Title FROM Movie";
    returnJSON(db, query, res);
});

app.get("/api/count", function(req, res){
    const param = req.query;
    var query = "SELECT COUNT(*) AS Count FROM Movie ";
    if (Object.keys(param).length != 0) {
        query += "WHERE ";
        for (var propName in req.query) {
            if (req.query.hasOwnProperty(propName)) {
                const column = propName;
                const value = req.query[propName];
                query += column + " LIKE '%" +value + "%' AND ";
            }
        }
        query = query.slice(0,-4);
    }
    returnJSON(db, query, res);
});

app.get("/api/session/more", function(req, res){
    var query = req.session.query;
    var offset = req.session.offset;

    if (!offset) {
        offset = req.session.offset = 10;
    }

    query += " OFFSET " + offset;
    req.session.offset += 10;
    console.log(query);
    returnJSON(db, query, res);
});

app.get("/api/session/movies", function(req, res){
    var views = req.session.views;

    if (!views) {
        res.json("");
        return;
    }

    var query = "SELECT * FROM Movie WHERE ID IN (";
    for (var i = 0; i < views.length; i ++) {
        const movieID = views[i];
        query += movieID + ",";
    }
    query = query.slice(0,-1);
    query += ")";
    db.all(query, function (err, rows) {
        if (err) {
            res.json({
                error: 'No rows matched',
            });
            return;
        }
        rows = JSON.parse(JSON.stringify(rows));
        correctResult = [];
        for (var i = 0; i < views.length; i ++) {
            const movieID = views[i];
            for (var j = 0; j < rows.length; j ++) {
                if (rows[j].ID == movieID) {
                    correctResult.push(rows[j]);
                    break;
                }
            }
        }
        res.json(JSON.stringify(correctResult));
    });
});

app.get("/api/person/castmovies", function(req, res) {
    const id = req.query["id"];
    var query = "SELECT MovieID FROM MovieCast WHERE CastID=" + id;
    returnJSON(db, query, res);
});

app.get("/api/person/directormovies", function(req, res) {
    const id = req.query["id"];
    var query = "SELECT MovieID FROM MovieDirector WHERE DirectorID=" + id;
    returnJSON(db, query, res);
});

app.get("/api/person/writermovies", function(req, res) {
    const id = req.query["id"];
    var query = "SELECT MovieID FROM MovieWriter WHERE WriterID=" + id;
    returnJSON(db, query, res);
});

app.get("/api/person", function(req, res) {
    const name = req.query["name"];
    var queryCast = "SELECT ID FROM Cast AS C WHERE C.Cast=\'" + name + "\'";
    var queryDirector = "SELECT ID FROM Director AS D WHERE D.Director=\'" + name + "\'";
    var queryWriter = "SELECT ID FROM Writer AS W WHERE W.Writer=\'" + name + "\'";
    var personIDs = {};
    db.serialize(function () {
       db.get(queryCast, function (err, row) {
           if (!row) {
               personIDs['Cast'] = -1;
           }
           else {
               personIDs['Cast'] = row.ID;
           }
       });
        db.get(queryDirector, function (err, row) {
            if (!row) {
                personIDs['Director'] = -1;
            }
            else {
                personIDs['Director'] = row.ID;
            }
        });
        db.get(queryWriter, function (err, row) {
            if (!row) {
                personIDs['Writer'] = -1;
            }
            else {
                personIDs['Writer'] = row.ID;
            }
            res.json(JSON.stringify(personIDs));
        });

    });
});

app.get("/api/user", function (request, response) {
    response.setHeader('content-type', 'text/json');
    const param = request.query;
    var query = "SELECT * FROM Users WHERE id=" + request.query["id"];

    userdb.get(query, function (error, row) {
        if (error) {
            response.json({
                error: 'No rows matched'
            });
            return;
        }
        response.json(JSON.stringify(row));
    });
});

app.get("/api/seenMovies", function (request, response) {
    response.setHeader('content-type', 'text/json');

    var query = "SELECT SeenMovieID FROM SeenMovies";
    const param = request.query;
    if (param) {
        query += " WHERE UserID = " + param['userID'];
    }

    userdb.all(query, function (error, rows) {
        if (error) {
            response.json({
                error: 'No rows matched'
            });
            return;
        }
        response.json(JSON.stringify(rows));
    });
});

app.get("/api/insertSeenMovies", function (request, response) {
    response.setHeader('content-type', 'text/json');

    const param = request.query;
    console.log(param[0]);

    var query = "INSERT INTO SeenMovies (UserID, SeenMovieID)" +
                " SELECT " + param['userID'] + ',' + param['movieID'] +
                " WHERE NOT EXISTS " +
                " (SELECT 1 FROM SeenMovies " +
                " WHERE UserID=" + param['userID'] + " AND SeenMovieID=" + param['movieID'] + ")";
    console.log(query);

    userdb.run(query);
});

app.get("/api/favoriteMovies", function (request, response) {
    response.setHeader('content-type', 'text/json');

    var query = "SELECT FavoriteMovieID FROM FavoriteMovies";
    const param = request.query;
    if (param) {
        query += " WHERE UserID = " + param['userID'];
    }

    console.log(query);
    userdb.all(query, function (error, rows) {
        if (error) {
            response.json({
                error: 'No rows matched'
            });
            return;
        }
        response.json(JSON.stringify(rows));
    });
});

app.get("/api/insertFavoriteMovies", function (request, response) {
    response.setHeader('content-type', 'text/json');

    const param = request.query;
    console.log(param[0]);

    var query = "INSERT INTO FavoriteMovies (UserID, FavoriteMovieID)" +
        " SELECT " + param['userID'] + ',' + param['movieID'] +
        " WHERE NOT EXISTS " +
        " (SELECT 1 FROM FavoriteMovies " +
        " WHERE UserID=" + param['userID'] + " AND FavoriteMovieID=" + param['movieID'] + ")";
    console.log(query);

    userdb.run(query);
});

app.get("/api/userSearchHistory", function (request, response) {
    response.setHeader('content-type', 'text/json');

    var query = "SELECT SearchMovieID FROM SearchHistory";
    const param = request.query;
    if (param) {
        query += " WHERE UserID = " + param['userID'];
    }

    console.log(query);
    userdb.all(query, function (error, rows) {
        if (error) {
            response.json({
                error: 'No rows matched'
            });
            return;
        }
        response.json(JSON.stringify(rows));
    });
});

app.get("*", function(req, res){
    console.log(req.url);
    res.sendFile(path.join(__dirname, '/client/public/index.html'));
});

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

function returnJSON(database, query, res) {
    res.setHeader('content-type', 'text/json');

    database.all(query, function (err, rows) {
        if (err) {
            res.json({
                error: 'No rows matched',
            });
            return;
        }
        res.json(JSON.stringify(rows));
    });
}

function logSession(req, movie) {
    var views = req.session.views;
    if (!views) {
        views = req.session.views = [];
    }
    const jsonMovie = JSON.parse(JSON.stringify(movie));
    const index = views.indexOf(jsonMovie.ID);
    if (index != -1) {
        views.splice(index, 1);
    }
    views.unshift(jsonMovie.ID);
}
