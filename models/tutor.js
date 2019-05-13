const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const bcrypt = require("bcrypt");

// BUSINESS
const TutorSchema = new mongoose.Schema({
  username: {type: String, required: true,unique:true},
  email: {type:String, required:true, unique:true},
  password:{type:String, required:true},
  subject : {type: String},
  level:{type:String},
  age : {type:Number},
  gender: {type: String},
  price: {type: Number},
  occupation:{type:String},
  rating: {type: String},
  reviews:[{type:String}],
  bio:{type:String},
  balance : {type: Number}
});


TutorSchema.plugin(URLSlugs('username'));

const Tutor = module.exports = mongoose.model('Tutor', TutorSchema);
module.exports.createTutor = function(newTutor, callback){
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newTutor.password, salt, function(err, hash) {
          newTutor.password = hash;
          newTutor.save(callback);
      });
  });
}

module.exports.getTutorByTutorName = function(username, callback){
  var query = {username: username};
  Tutor.findOne(query, callback);
}

module.exports.getTutorById = function(id, callback){
  Tutor.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null, isMatch);
  });
}


