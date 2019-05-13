const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Tutor = require('../models/tutor');
const Lesson = require('../models/lesson');

router.get('/register', function (req, res) {
  res.render('register_tutor');
});

router.post('/register', function (req, res) {
  const username=req.body.username;
  const email=req.body.email;
  const subject=req.body.subject;
  const level=req.body.level;
  const password=req.body.password;
  const age=req.body.age;
  const gender=req.body.gender;
  const bio=req.body.bio;
  const price=req.body.price;
  const occupation= req.body.occupation;
  req.checkBody('email').isEmail();
  const invalidEmail = req.validationErrors();
  if (invalidEmail) {
    res.render('register_tutor', {
      invalidEmail: invalidEmail
    });
  }
  else{
    Tutor.findOne({ username: { "$regex": "^" + username + "\\b", "$options": "i"}}, 
      function (err, user) {
        Tutor.findOne({ email: { "$regex": "^" + email + "\\b", "$options": "i" }}, 
          function (err, mail) {
            if (user || mail) {
              res.render('register_tutor', {
                user: user,
                mail: mail
              });
            }
            else {
              const newTutor = new Tutor({
                username: username,
                email: email,
                password: password,
                subject:subject,
                level:level,
                age:age,
                gender:gender,
                occupation:occupation,
                price:price,
                reviews:[],
                rating :'0', 
                bio:bio,
                balance:0
              });
              Tutor.createTutor(newTutor, function (err, user) {
                if (err) throw err;
              });
              res.redirect('/tutors/login');
            }
          });
        });
  }
});


router.get('/login', function (req, res) {
  res.render('login_tutor');
});

passport.use('local-tutor',new LocalStrategy(
  function (username, password, done) {
    Tutor.getTutorByTutorName(username, function (err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false);
      }

      Tutor.comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  }));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Tutor.getTutorById(id, function (err, user) {
    done(err, user);
  });
});



router.post('/login', function(req, res, next) {
  passport.authenticate('local-tutor', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render('login_tutor',{error:"username or passwoord error"}); }
    req.session.regenerate((err) => {
      if (!err) {
        req.session.user= user;
        res.redirect('/')
    } 
});
  })(req, res, next);
});

router.get('/profile',(req, res)=>{
  if(req.session.user){
    res.render('profile_tutor');
  }
  else {
    res.redirect('/tutors/login');
  }
  
});

router.get('/lessons/:slug',(req,res)=>{
  if(req.session.user){
    Lesson.findOne({slug: req.params.slug}, (err, lesson, count) => {
      if(lesson){
        res.render('lesson_edit', {lesson:lesson});
      }
      else{
        res.redirect('*');
      }
    }); 
  }
  else {
    res.redirect('/tutors/login');
  }
});

router.post('/lessons/:slug',(req,res)=>{
  const newLessonName=req.body.Lessonname;
  const newTime=req.body.time;
  const newDuration=req.body.duration;
  const newCapacity=req.body.capacity;
  const newSubject=req.body.subject;
  const newPrice=req.body.price;
  Lesson.updateOne({slug: req.params.slug}, {Lessonname:newLessonName, time : newTime, capacity : newCapacity, duration: newDuration, price: newPrice, subject:newSubject}, (err,done,count)=>{
    if(done){
      res.redirect('/tutors/profile');
    }
  });
});


router.get('/lessons/delete/:slug',(req,res)=>{
  if(req.session.user){
    Lesson.deleteOne({slug:req.params.slug},(err,done,count)=>{
      if(done){
        res.redirect('/tutors/profile');
      }
    });
  }
  else {
    res.redirect('/tutors/login');
  }
});

router.get('/logout', function (req, res) {
  if(req.session.user){
    req.session.user=null;
  }
  res.redirect('/');
});

module.exports = router;