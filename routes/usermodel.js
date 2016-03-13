// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: String,
    admin: Boolean,
    location: String,
    meta: {
        age: Number,
        website: String
    },
    created_at: Date,
    updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);
//
//var restrictedInformation = new Schema ({
//    information: String,
//    level: 1 // 1: free for all, 2: restricted (auth only)
//});

//var Information = mongoose.model('Information', restrictedInformation );

// make this available to our users in our Node applications
module.exports = {
    User: User
    //Information: Information
};