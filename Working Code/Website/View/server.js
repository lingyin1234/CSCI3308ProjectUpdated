/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
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
	database: 'mrammah',
	user: 'postgres',
	password: 'jxy96835'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory



/*********************************
 Below we'll add the get & post requests which will handle:
   - Database access
   - Parse parameters from get (URL) and post (data package)
   - Render Views - This will decide where the user will go after the get/post request has been processed

 Web Page Requests:

  Login Page:        Provided For your (can ignore this page)
  Registration Page: Provided For your (can ignore this page)
  Home Page:
  		/home - get request (no parameters) 
  				This route will make a single query to the favorite_colors table to retrieve all of the rows of colors
  				This data will be passed to the home view (pages/home)

  		/home/pick_color - post request (color_message)
  				This route will be used for reading in a post request from the user which provides the color message for the default color.
  				We'll be "hard-coding" this to only work with the Default Color Button, which will pass in a color of #FFFFFF (white).
  				The parameter, color_message, will tell us what message to display for our default color selection.
  				This route will then render the home page's view (pages/home)

  		/home/pick_color - get request (color)
  				This route will read in a get request which provides the color (in hex) that the user has selected from the home page.
  				Next, it will need to handle multiple postgres queries which will:
  					1. Retrieve all of the color options from the favorite_colors table (same as /home)
  					2. Retrieve the specific color message for the chosen color
  				The results for these combined queries will then be passed to the home view (pages/home)

  		/team_stats - get request (no parameters)
  			This route will require no parameters.  It will require 3 postgres queries which will:
  				1. Retrieve all of the football games in the Fall 2018 Season
  				2. Count the number of winning games in the Fall 2018 Season
  				3. Count the number of lossing games in the Fall 2018 Season
  			The three query results will then be passed onto the team_stats view (pages/team_stats).
  			The team_stats view will display all fo the football games for the season, show who won each game, 
  			and show the total number of wins/losses for the season.

  		/player_info - get request (no parameters)
  			This route will handle a single query to the football_players table which will retrieve the id & name for all of the football players.
  			Next it will pass this result to the player_info view (pages/player_info), which will use the ids & names to populate the select tag for a form 
************************************/

// login page 
/*app.get('/', function(req, res) {
	res.render('pages/login',{
		local_css:"signin.css", 
		my_title:"Login Page"
	});
});

// registration page 
app.get('/register', function(req, res) {
	res.render('pages/register',{
		my_title:"Registration Page"
	});
});*/

/*Add your other get/post request handlers below here: */


app.get('/homePage', function(req, res) {
	res.render('pages/home',{
    local_css:"my_style.css", 
    my_title:"homePage Page"
  });
});
/*app.get('/home/pick_color', function(req, res) {
	var color_choice = req.query.color_selection;
	var color_options =  'select * from favorite_colors;';
	var color_message = "select color_msg from favorite_colors where hex_value = '" + color_choice + "';"; 
	db.task('get-everything', task => {
        return task.batch([
            task.any(color_options),
            task.any(color_message)
        ]);
    })
    .then(info => {
    	res.render('pages/home',{
				my_title: "Home Page",
				data: info[0],
				color: color_choice,
				color_msg: info[1][0].color_msg
			})
    })
    .catch(error => {
        // display error message in case an error
            request.flash('error', err);
            response.render('pages/home', {
                title: 'Home Page',
                data: '',
                color: '',
                color_msg: ''
            })
    });
	
});

app.post('/home/pick_color', function(req, res) {
  var color_hex = req.body.color_hex;
  var color_name = req.body.color_name;
  var color_message = req.body.color_message;
  var insert_statement = "INSERT INTO favorite_colors(hex_value, name, color_msg) VALUES('" + color_hex + "','" + 
              color_name + "','" + color_message +"') ON CONFLICT DO NOTHING;";

  var color_select = 'select * from favorite_colors;';
  db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(color_select)
        ]);
    })
    .then(info => {
      res.render('pages/home',{
        my_title: "Home Page",
        data: info[1],
        color: color_hex,
        color_msg: color_message
      })
    })
    .catch(error => {
        // display error message in case an error
            request.flash('error', err);
            response.render('pages/home', {
                title: 'Home Page',
                data: '',
                color: '',
                color_msg: ''
            })
    });
});
app.get('/player_info',function(req,res){
  var query='select * from football_players';
  db.any(query)
  .then(info=>{
    //console.log('Here')
    res.render('pages/player_info',{
      my_title: 'Player_info',
      selected_player: '',
      players: info,
      player:'',
      count : ''

    })
  })
  .catch(function(err){
    //console.log('There')
    req.flash('error',err);
    req.render('pages/player_info',{
      my_title:'Player_info',
      selected_player:'',
      players:''
    })
  })
});
app.get('/player_info/post',function(req,res){
  var name='select id, name from football_players';
  var choice=req.query.player_choice;
  var info='select * from football_players where id='+choice+'';
  var game_info='select count(*) from football_games where '+choice+'=any(players)';
  db.task('get-everything',task=>{
    return task.batch([
        task.any(name),
        task.any(info),
        task.any(game_info)
      ])
  })
  .then(info => {
      res.render('pages/player_info',{
        my_title: "Player Information",
        players: info[0],
        player: info[1][0],
        count:info[2][0]
      })
    })
  .catch(function(err){
    res.render('pages/player_info',{
      my_title: "Player Information",
      players:'',
      player:'',
      count:''
    })
  })
});
app.get('/team_stats',function(req,res){
  var allGame='select * from football_games';
  var win='select count(*) as col from football_games where visitor_score<home_score';
  var lose='select count(*) as col from football_games where visitor_score>home_score';
  db.task('get-all',task=>{
    console.log('There')
    return task.batch([
        task.any(allGame),
        task.any(win),
        task.any(lose)
      ]);
  })
  .then(info=>{

    res.render('pages/team_stats',{
      my_title:"Team Stats",
      players: info[0],
      win:info[1][0],
      lose:info[2][0]
    })
  })
  .catch(function(err){
    //console.log('There')
    res.render('pages/team_stats',{
      my_title:"Team Stats",
      win:'',
      lose:'',
      allGame:''
    })
  })
});*/
app.listen(3000);
console.log('3000 is the magic port');
