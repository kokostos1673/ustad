const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const bcrypt = require("bcrypt");


const LessonSchema = new mongoose.Schema({
  tutor_name: { type: String },
  student_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  time: {type:Date},
  duration:{type:Number},
  price : {type: Number},
  rating : {type: Number},
  review : {type:String}
});

LessonSchema.plugin(URLSlugs('student_id tutor_name time'));
const Lesson = module.exports = mongoose.model('Lesson', LessonSchema);



