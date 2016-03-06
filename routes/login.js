var oracledb=require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('./config');

function post(req,res, next) {
    oracledb.getConnection(config.database, function(err, connection){
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
                function(err,results) {
                    var user;

                    if (err) {
                        connection.release(function (err){
                            if (err) {
                                console.log('Error releasing database connection (at query): ' + err.message);
                            }
                        });

                        return next(err);
                    }

                    //get the Object retrieved from the database
                    user = results.rows[0];

                    if (!user || !user.email || !user.password){
                            res.status(401).send({message: 'Invalid username or password'});
                            return;
                    }

                    bcrypt.compare(req.body.password, user.password, function(err, pwdMatch) {
                        var payLoad;
                        if (err) {
                            return next(err);
                        }

                        //if passwords do not match return invalid username or password
                        if (!pwdMatch) {
                            res.status(401).send({message: 'Invalid username or password'});
                            return;
                        }

                        payLoad= {
                            sub: user.email,
                            role: user.role
                        };

                        delete user.password;

                        res.status(200).json({
                            user: user,
                            token: jwt.sign(payLoad, config.jwtSecretKey, {expiresIn: 3600})
                        });

                        connection.release(function(err){
                            if (err) {
                                console.log('Error releasing database connection:' + err.message)
                            }
                        });
                    });

                }
            );

        }

    );
}

module.exports.post = post;