var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('./config');

function post(req, res, next) {
    var user = {
        email: req.body.email
    };

    //password in clear text
    var unhashedPassword = req.body.password;

    //generate salt with a 10 cycle (default)
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }

        //generate hash using the previously generated salt
        bcrypt.hash(unhashedPassword, salt, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.hashedPassword = hash;
            //console.log("user.hashedPassword: " + user.hashedPassword);

            insertUser(user, function (err, user) {
                var payLoad;

                if (err) {
                    return next(err);
                }

                // if no errors occurred on user insert, construct payLoad
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
        })
    })
}

module.exports.post = post;

function insertUser(user, callback) {
    oracledb.getConnection(config.database, function (err, connection) {
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