var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('./config');
var mongoose = require('mongoose');
var newUser = require('./usermodel');
var http = require('http');


function post(req, res, next) {
    if (config.activeDB === 'Oracle') {
        oracledb.getConnection(config.oracleDB, function (err, connection) {
                if (err) {
                    return next(err)
                }
                console.log(req.body.email);
                connection.execute(
                    'select id as "id", email as "email", role as "role", password as "password" from JSAO_USERS where email = :email',
                    {
                        email: req.body.email.toLowerCase()
                    },
                    {
                        outFormat: oracledb.OBJECT
                    },
                    function (err, results) {
                        var user;

                        if (err) {
                            connection.release(function (err) {
                                if (err) {
                                    console.log('Error releasing database connection (at query): ' + err.message);
                                }
                            });

                            return next(err);
                        }

                        //get the Object retrieved from the database
                        user = results.rows[0];

                        if (!user || !user.email || !user.password) {
                            res.status(401).send({message: 'Invalid username or password'});
                            return;
                        }

                        bcrypt.compare(req.body.password, user.password, function (err, pwdMatch) {
                            var payLoad;
                            if (err) {
                                return next(err);
                            }

                            //if passwords do not match return invalid username or password
                            if (!pwdMatch) {
                                res.status(401).send({message: 'Invalid username or password'});
                                next();
                            }

                            payLoad = {
                                sub: user.email,
                                role: user.role
                            };

                            delete user.password;

                            res.status(200).json({
                                user: user,
                                token: jwt.sign(payLoad, config.jwtSecretKey, {expiresIn: 3600})
                            });

                            connection.release(function (err) {
                                if (err) {
                                    console.log('Error releasing database connection:' + err.message)
                                }
                            });
                        });

                    }
                );

            }
        )
    } else {
        //connect to MongoDB
        mongoose.connect('mongodb://localhost/nodetest1');

        //create a new connection
        var db = mongoose.connection;

        //in case of errors notify me
        db.on('error', console.error.bind(console, 'connection error:'));

        //once the database connection is open, go4it
        db.once('open', function () {
            console.log('Connected to Mongo DB!!!')

            var requestingUser = req.body.email.toLowerCase();
            //console.log(requestingUser);

            mydbuserMongo(db, requestingUser, function (user) {

                //var user = JSON.toString(data);
                //console.log(user.password);
                //console.log("req.body.password: " + req.body.password);

                //if (!user || !user.username || !user.password) {
                //    res.status(401).send({message: 'Invalid username or password'});
                //    return next(); //TODO: find why is this failing if passwd is wrong ???
                //}

                bcrypt.compare(req.body.password, user.password, function (err, pwdMatch) {
                    var payLoad;
                    if (err) {
                        return next(err);
                    }

                    //if passwords do not match return invalid username or password
                    if (!pwdMatch) {
                        res.status(401).send({message: 'Invalid username or password'});
                        return;
                    }

                    payLoad = {
                        sub: user.username,
                        role: user.role
                    };

                    delete user.password;
                    //var tokenn = jwt.sign(payLoad, config.jwtSecretKey, {expiresIn: 3600})
                    //console.log("TOKENN: " + tokenn);

                    res.status(200).json({
                        user: user,
                        token: jwt.sign(payLoad, config.jwtSecretKey, {expiresIn: 3600})
                    });
                });
                db.close();
            });
        })
    }
}

function mydbuserMongo(db, requestingUser, callback) {
    var cursor = db.collection("users").find({"username": requestingUser});
    cursor.each(function (err, doc) {
        if (err) {
            callback(err);
        }
        //assert.equal(err, null);
        if (doc != null) {
            callback(doc);
        } else {
            //callback();
        }
    })
}

module.exports.post = post;