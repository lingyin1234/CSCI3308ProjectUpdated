var express = require('express'); 
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(__dirname + '/public'));


var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/
const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'postgres',
	user: 'mrammah',
	password: 'momo'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


// registration page 
app.get('/register', function(req, res) {
	res.render('pages/register',{
		my_title:"Registration Page"
	});
});

app.post('/register', function(req, res) {
	var firstName = req.body.fname;
	var lastName = req.body.lname;
	var emailAddress = req.body.email_id;
	var userPassword = req.body.psw;
	console.log("first name",req.body.fname);
	console.log("last name",req.body.lname);
	console.log("email address",req.body.email_id);
	console.log("password",req.body.cnfpsw);
	//var userTable=CREATE TABLE IF NOT EXISTS users (email VARCHAR(30),name VARCHAR(30),password VARCHAR(30),PRIMARY KEY(email));

	var insert_user = "insert into users (email,name,password) values ('" + emailAddress + "','" + firstName+lastName + "','" + userPassword +"');";
	// db.task('get-everything', task => {
  //       return task.batch([
  //       	//task.any(userTable)
  //           task.any(insert_user)
  //           //console.log('Inserted')
  //       ]);
	//   });

	// What is this line doing?
		// It is posting the the user's info into a table
		// wesbite doesnt know anything about database
		// POST is a way of sending a lot of data through the browser
		// with this line, we are making sure we are posting to the correct location
	
	db.none('INSERT INTO users(email,name,password) VALUES($1, $2, $3)', [emailAddress, firstName+lastName, userPassword])
    .then(() => {
				// success;
				console.log("success!");
    })
    .catch(error => {
				// error;
				console.log(error);
    });
	res.send("OK");
});

/*Add your other get/post request handlers below here: */


// ---------LOGIN-------------------
app.get('/homePage', function(req, res) {
	res.render('pages/homePage',{
		my_title:"login"
	});
});

app.post('/homePage', function(req, res) {
	var emailAddress = req.body.email; //has to match form name attribute
	var userPassword = req.body.password; //has to match form name attribute
	console.log("email address",req.body.email);
	console.log("password",req.body.password);

	

	// What is this line doing?
		// It is posting the the user's info into a table
		// wesbite doesnt know anything about database
		// POST is a way of sending a lot of data through the browser
		// with this line, we are making sure we are posting to the correct location
		
		//this is how we confirm that user has entered correct info
		//what does res do?
			// it response
			//this is how server responds with result
		db.any('SELECT * FROM users WHERE email = $1 AND password = $2', [emailAddress,userPassword])
    .then(function(data) {
				// success;
				console.log(data)
				
				if(data.length > 0)
				{
					
					res.render('pages/login',{
						username:data[0].name
					});
				}
				else
				{
					res.send("LOGIN FAILED");
				}
    })
    .catch(function(error) {
				// error;
				res.send("LOGIN FAILED");
    });

	
});

app.listen(3000);
console.log('3000 is the magic port');
