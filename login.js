const fs = require('fs')
const https = require('https');
const http = require('http');
const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { syncBuiltinESMExports } = require('module');

const ejs = require('ejs');

var CONFIG = require('./mysqlconfig.json');

//connect to mysql
const connection = mysql.createConnection({
	host     : CONFIG.host,
	user     : CONFIG.user,
	password : CONFIG.password,
	database : CONFIG.database
});




const app = express();


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.set('view engine', 'ejs');


//favicon xd
app.use('/favicon.ico', express.static('img/favicon.ico'));
// Render pages
app.get('/', (req, res) => res.render('pages/home'));

app.get('/resume', (req, res) => res.render('pages/resume'));

app.get('/login', (req, res) => res.render('pages/login'));

// post of /login
app.post('/login', function(req, res) {
	// Capture the input fields
	let username = req.body.username;
	let password = req.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to home page
				res.redirect('/painel');
				
			} else {
				res.send('Incorrect Username and/or Password!');
			}
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});
app.get('/linkedin', function(req,res)
{
	res.status(301).redirect("https://www.linkedin.com/in/brunobadaro");
});

app.get('/github', function (req,res)
{
	res.status(301).redirect("https://www.github.com/bruno-1337");
});

// serverside of painel
app.get('/painel', function(req, res) 
{
	//If the user is loggedin
	if (req.session.loggedin) {
		//render homepage
		res.render('pages/painel');
	} 
	else 
	{
		// Not logged in
		res.send('Please login to view this page!');
		res.end();
	}
});

//try creating a https server
try{
	https
  .createServer(
    {
      key: fs.readFileSync('/etc/letsencrypt/live/cheiros.in/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/cheiros.in/cert.pem'),
      ca: fs.readFileSync('/etc/letsencrypt/live/cheiros.in/chain.pem'),
    },
    app
  )
  .listen(443, () => {
    console.log('HTTPS Server running on port 443')
  })
  const httpServer = http.createServer(app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});
}
catch{
	app.listen(80);
}