const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const config = require('./config/database');

const Lesson = require('./models/lesson');
const Tutor = require('./models/tutor');
mongoose.connect(config.database, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
  console.log('Connected to Database '+config.database);
});

mongoose.connection.on('error', (err) => {
  console.log('Database error '+err);
});

const students = require('./routes/students');
const tutors = require('./routes/tutors');
const lessons= require('./routes/lessons');


app.set('view engine', 'hbs');
const staticPath = path.resolve(__dirname, 'public');
app.use(express.static(staticPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// session setup
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// passport.js init
app.use(passport.initialize());
app.use(passport.session());

// exp validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.use(function (req, res, next) {
  res.locals.user = req.user || req.session.user;
  next();
});

app.get('/', function(req, res){
    res.render('index');
});

app.get('/about', function(req, res){
    res.render('about');
});

app.get('/book/:slug', function(req, res){

  Tutor.findOne({_id: req.params.slug}, (err, tutor, count) => {
    if(tutor){
      res.render('book',{student:req.user,tutor:tutor});
    }}); 

});

app.post('/book/:slug', function(req, res){

  Tutor.findOne({_id: req.params.slug}, (err, tutor, count) => {
    if(tutor){
      res.render('book',{student:req.user,tutor:tutor,message:req.body.message});
    }}); 

});

app.get('/search', function(req, res){
  let new_tutors=[];
  Tutor.find(function(err, result,count) {
    result.forEach(function(tutor){
      let new_tutor={'name':'empty','zero':false,'one':false,'two':false,'three':false,'four':false,'five':false};
      const temp=Object.assign(new_tutor,tutor);
      if(tutor.rating==='0'){
        new_tutor.zero=true;
      }
      else if (tutor.rating==='one'){
        new_tutor.one=true;
      }
      else if (tutor.rating==='two'){
        new_tutor.two=true;
      }
      else if (tutor.rating==='three'){
        new_tutor.three=true;
      }
      else if (tutor.rating==='four'){
        new_tutor.four=true;
      }
      else if (tutor.rating==='five'){
        new_tutor.five=true;
      }
      new_tutor.name=tutor.username.split(" ")[0];

      new_tutors.push(new_tutor);

      
    });
    
  });
  setTimeout(function(){ res.render('search', {tutors:new_tutors}); }, 5000);
  
    
});

function getUnique(arr){
  return arr.filter((e,i)=> arr.indexOf(e) >= i)
}
app.post('/search', function(req, res){
  let tutors=[];
  let query={};
  if(req.body.subject!=='All Subjects'){
    query.subject=req.body.subject;
  }
  if(req.body.level!=='All Levels'){
    query.level=req.body.level;
  }
  if(req.body.rating!=='Any Rating'){
    query.rating=req.body.rating;
  }
    let new_tutors=[];
  Tutor.find(query,function(err, result,count) {
    result.forEach(function(tutor){
      let new_tutor={'name':'empty','zero':false,'one':false,'two':false,'three':false,'four':false,'five':false};
      const temp=Object.assign(new_tutor,tutor);
      if(tutor.rating==='0'){
        new_tutor.zero=true;
      }
      else if (tutor.rating==='one'){
        new_tutor.one=true;
      }
      else if (tutor.rating==='two'){
        new_tutor.two=true;
      }
      else if (tutor.rating==='three'){
        new_tutor.three=true;
      }
      else if (tutor.rating==='four'){
        new_tutor.four=true;
      }
      else if (tutor.rating==='five'){
        new_tutor.five=true;
      }
      new_tutor.name=tutor.username.split(" ")[0];
      new_tutors.push(new_tutor);
      
    });
    
  });
  setTimeout(function(){ res.render('search', {tutors:new_tutors}); }, 5000);

  

});

app.use('/students', students);
app.use('/tutors',tutors);
app.use('/lessons',lessons);

app.get('*', function(req, res){
  res.render('not_found');
});


const PORT = process.env.PORT || 8080;
//const PORT = 8080;
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
