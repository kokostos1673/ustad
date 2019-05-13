const express = require('express');
const router = express.Router();

const Lesson= require('../models/lesson');
const Student = require('../models/student');
const Tutor= require('../models/tutor');

router.post('/add/:slug', function (req, res) {
  const tutor_name=req.params.slug;
  const student_id=req.user._id;
  const price =req.body.price;
  const duration = req.body.duration;
  const time=req.body.time;
  const newLesson = new Lesson({
        tutor_name:tutor_name,
        student_id:student_id,
        price:price,
        time:time,
        duration:duration,
        rating:'0',
        review:''
    });
  console.log(newLesson);

    newLesson.save(function(err, result, count) {
      if(result){
        res.redirect("/");
      }
      else {
        res.send(err);
      }
      
  });
});

router.post('/show/:slug', (req,res) =>{

  Lesson.findOne({_id: req.params.slug}, (err, lesson, count) => {
    if(lesson){
      res.render('show_session', {lesson:lesson});
    }
    else {res.redirect('/');}
  }); 
});

module.exports = router;

