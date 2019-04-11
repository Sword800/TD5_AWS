// server.js
// where your node app starts
var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ".data/db.sqlite3"
    },
    debug: true,
    useNullAsDefault: true
});

var session = require('express-session');
// init project

const express = require('express');
const app = express();
const bodyP = require('body-parser');
const cookieP = require('cookie-parser');
require('express-async-errors');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app
    .use(bodyP.urlencoded({ extended: false }))
    .use(cookieP())
    .use('/s', express.static('public'))
    .use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: false,
}));


const consolidate = require('consolidate');
app.engine('html', consolidate.nunjucks);
app.set('view engine', 'nunjucks');
app.set('views', './views');

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
  
  if(req.session.user)
  {
    res.redirect('/userlist');
  }
  else
  {
  res.sendFile(__dirname + '/views/index.html');
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.post('/',async function(req, res) {
  
  
  try{
    
  var utilisateurs = await knex('users').where({'login':req.body.login,'pass':req.body.pass});
  
  if(utilisateurs[0].login != null)
  {
    req.session.user=utilisateurs[0].login;
    req.body.pass=utilisateurs[0].pass;
    res.redirect('/userlist');
  }
  }
  catch (err) {  
   res.redirect('/');
  }
  
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/signin',async function(req, res) {
  res.sendFile(__dirname + '/views/signin.html');
});

// http://expressjs.com/en/starter/basic-routing.html
app.post('/signin',async function(req, res) {
  if(req.body.login != '' && req.body.pass != '')
  {
  var add_jojo = await knex.raw('INSERT INTO users VALUES (?, ?, ?, ?, ?)',
               [ req.body.login, req.body.pass, req.body.name, req.body.fav, req.body.sec]);
  }
 res.redirect('/signin');
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/logout', function(req, res) {
  req.body.login = null;
  req.session.user = req.body.login;
  res.sendFile(__dirname + '/views/index.html');
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/userlist', async function(req, res) {
  
  if(!req.session.user)
  {
    res.redirect('/');
  }
  else
  {
    let aff = await knex('users').select('login','name','color1');
  //console.log(aff);
  res.render('userlist.html',{'liste': aff,'test': req.session.user,'link': '/logout' })
  }

});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
