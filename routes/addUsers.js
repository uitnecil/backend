var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('./config');
var newUser = require('./usermodel');
var mongoose = require('mongoose');


function post(req, res, next) {
    var user = {
        email: req.body.email
    };

    //password in clear text
    var unhashedPassword = req.body.password;
    //console.log(unhashedPassword);

    //generate salt with a 10 cycle (default)
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        console.log('I"m here');
        //generate hash using the previously generated salt
        bcrypt.hash(unhashedPassword, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.hashedPassword = hash;
                //console.log("user.hashedPassword: " + user.hashedPassword);
            console.log(config.activeDB);

                if (config.activeDB === 'Oracle') {
                    insertUserOracle(user, function (err, user) {
                        var payLoad;

                        if (err) {
                            return next(err);
                        }

                        // if no errors occurred on user insert, construct payLoad in order to generate token based on them
                        payLoad = {
                            sub: user.email,
                            role: user.role
                        };

                        //return data
                        res.status(200).json({
                            user: user,
                            token: jwt.sign(payLoad, config.jwtSecretKey, {expiresIn: 3600})
                        })
                    })
                }
                else {
                    //use MongoDB
                    mongoose.connect('mongodb://localhost/nodetest1');
                    var db = mongoose.connection;
                    //in case of errors notify me
                    db.on('error', console.error.bind(console, 'connection error:'));

                    db.once('open', function () {
                        console.log('Successfully connected to Mongo DB.')

                        // create a new user structure
                        var newUserMongo = new newUser.User({
                            role: user.role,
                            username: user.email,
                            password: user.hashedPassword
                        });

                        // call the built-in save method to save to the database
                        newUserMongo.save(function (err) {
                            if (err) throw err;

                            payLoad = {
                                sub: user.email,
                                role: user.role
                            };

                            //return data
                            res.status(200).json({
                                user: user,
                                token: jwt.sign(payLoad, config.jwtSecretKey, {expiresIn: 3600})
                            })

                            console.log('Mongo: User saved successfully!');
                            db.close();
                        });

                    });
                }
            }
        )
    })
}

module.exports.post = post;

function insertUserOracle(user, callback) {
    oracledb.getConnection(config.oracleDB, function (err, connection) {
            if (err) {
                return callback(err);
            }
            connection.execute(
                'insert into jsao_users ( ' +
                '   email, ' +
                '   password, ' +
                '   role ' +
                ') ' +
                'values (' +
                '    :email, ' +
                '    :password, ' +
                '    \'BASE\' ' +
                ') ' +
                'returning ' +
                '   id, ' +
                '   email, ' +
                '   role ' +
                'into ' +
                '   :rid, ' +
                '   :remail, ' +
                '   :rrole',
                {
                    email: user.email.toLowerCase(),
                    password: user.hashedPassword,
                    rid: {
                        type: oracledb.NUMBER,
                        dir: oracledb.BIND_OUT
                    },
                    remail: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                    },
                    rrole: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                    }
                },
                {
                    autoCommit: true
                }
                ,
                function (err, results) {
                    //if error occurs release the database connection
                    if (err) {
                        connection.release(function (err) {
                            if (err) {
                                console.log('Error occurred when releasing the database connection (during query): ' + err.message)
                            }
                        })
                        callback(err);
                    }
                    callback(null, {
                        id: results.outBinds.rid[0],
                        email: results.outBinds.remail[0],
                        role: results.outBinds.rrole[0]
                    });
                    //at the end of all operation release the oracle connection;
                    connection.release(function (err) {
                        if (err) {
                            console.log('Error occurred when releasing the database connection (end of query): ' + err.message);
                        }
                    });
                }
            )
        }
    )
}

//function InserUserMongo(user,callback) {
//    var newUserMongo = new User.User({
//        username: user.email,
//        password: user.hashedPassword,
//        role: user.role
//    });
//
//    // call the custom method. this will just add -dude to his name
//    // user will now be Chris-dude
//
//
//    console.log('Your new name is ' + name);
//
//    // call the built-in save method to save to the database
//    newUserMongo.save(function (err){
//        if (err)
//        {callback(err)}
//}
//}