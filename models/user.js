const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
  email:{
    type: String,
    required: true,
    unique: true
  }
});

UserSchema.plugin(passportLocalMongoose); // This will add a password field to our schemas and much more

module.exports = mongoose.model('User', UserSchema);
