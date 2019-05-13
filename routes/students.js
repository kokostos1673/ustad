const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const Student = require('../models/student');
const Tutor = require('../models/tutor');
const Lesson = require('../models/lesson');

// user Register
router.get('/register', function (req, res) {
  res.render('register_student');
});

router.post('/register', function (req, res) {
  const username=req.body.username;
  const email=req.body.email;
  const password=req.body.password;
  const interest=req.body.interest;
  const age=req.body.age;
  const gender=req.body.gender;
  const school=req.body.school;
  req.checkBody('email').isEmail();
  const invalidEmail = req.validationErrors();
  if (invalidEmail) {
    res.render('register_student', {
      invalidEmail: invalidEmail
    });
  }
  else{
    Student.findOne({ username: { "$regex": "^" + username + "\\b", "$options": "i"}}, 
      function (err, user) {
        Student.findOne({ email: { "$regex": "^" + email + "\\b", "$options": "i" }}, 
          function (err, mail) {
            if (user || mail) {
              res.render('register_student', {
                user: user,
                mail: mail
              });
            }
            else {
              const newStudent = new Student({
                username:username,
                email: email,
                password: password,
                interest:interest,
                age:age,
                school:school,
                gender:gender,
                wallet:10000
              });
              Student.createStudent(newStudent, function (err, user) {
                if (err) throw err;
              });
              res.redirect('/students/login');
            }
          });
        });
  }
});

//login user 
router.get('/login', function (req, res) {
  res.render('login_student');
});

passport.use('student-local',new LocalStrategy(
  function (username, password, done) {
    Student.getStudentByStudentname(username, function (err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false);
      }

      Student.comparePassword(password, user.password, function (err, isMatch) {
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
  Student.getStudentById(id, function (err, user) {
    done(err, user);
  });
});


router.post('/login', function(req, res, next) {
  passport.authenticate('student-local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render('login_student',{error:'error'}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/profile',(req, res)=>{
  if(req.user){
    Lesson.find({student_id: req.user._id}, (err, lessons, count) => {
      if(lessons){
        setTimeout(function(){ res.render('profile_student',{lessons:lessons}); }, 3000);
      }
      else{
        res.redirect('/students/login');
      }
    });
  }
  else{
    res.redirect('/students/login');
  }
  
});

router.get('/logout', function (req, res) {
  if(req.user){
    req.logout();
  }
  res.redirect('/');
});
module.exports = router;

