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
    .use('/s', express.static('public'));

const consolidate = require('consolidate');
app.engine('html', consolidate.nunjucks);
app.set('view engine', 'nunjucks');
app.set('views', './views');

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/signin',async function(req, res) {
  res.sendFile(__dirname + '/views/signin.html');
});

// http://expressjs.com/en/starter/basic-routing.html
app.post('/signin',async function(req, res) {
  var add_jojo = await knex.raw('INSERT INTO users VALUES (?, ?, ?, ?, ?)',
               [ req.body.login, req.body.pass, req.body.name, req.body.fav, req.body.sec]);
 res.redirect('/signin');
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/logout', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/userlist', async function(req, res) {
  let aff = await knex('users').select('login','name','color1');
  console.log(aff);
  res.render('userlist.html',{'liste': aff})

});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
