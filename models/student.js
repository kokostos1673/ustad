const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const bcrypt = require("bcrypt");


const StudentSchema = new mongoose.Schema({
  username : {type: String, required:true, unique:true},
  email: {type: String, required:true, unique:true},
  password:{type:String,required:true},
  wallet : {type: Number},
  interest:{type:String},
  age : {type:Number},
  gender: {type: String},
  school : {type: String}
});



StudentSchema.plugin(URLSlugs('username'));
const Student = module.exports = mongoose.model('Student', StudentSchema);
module.exports.createStudent = function(newStudent, callback){
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newStudent.password, salt, function(err, hash) {
          newStudent.password = hash;
          newStudent.save(callback);
      });
  });
}

module.exports.getStudentByStudentname = function(username, callback){
  var query = {username: username};
  Student.findOne(query, callback);
}

module.exports.getStudentById = function(id, callback){
  Student.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null, isMatch);
  });
}
