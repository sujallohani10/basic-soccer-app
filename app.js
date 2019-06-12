const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const dns = require('dns')

/*// This will use the hosts file.
dns.lookup('socka.local', function (err, res) {
  console.log('This computer thinks socka is located at: ' + res)
})

dns.resolve4('socka.local', function (err, res) {
  console.log('A real IP address of socka is: ' + res[0])
})*/

const {getHomePage} = require('./routes/index');
const {addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage} = require('./routes/player');
const {getTeamPage} = require('./routes/teamindex');
const {addTeamPage, addTeam, deleteTeam, editTeam, editTeamPage} = require('./routes/team');
const port = 5000;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'socka'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get('/', getHomePage);
app.get('/add', addPlayerPage);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.post('/add', addPlayer);
app.post('/edit/:id', editPlayer);

//route for team
app.get('/team', getTeamPage);
app.get('/team/add', addTeamPage);
app.post('/team/add', addTeam);
app.get('/team/edit/:id', editTeamPage);
app.post('/team/edit/:id', editTeam);
app.get('/team/delete/:id', deleteTeam);


// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});