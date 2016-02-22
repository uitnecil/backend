var oracledb = require('oracledb');
var morgan = require('morgan');
var config = require('./config');
var jwt = require('jsonwebtoken');


function get(req, res, next) {
    var token;
    var payLoad;
    if (!req.headers.authorization) {
        return res.status(401).send({message: 'You are not authorized'});
    }
    token = req.headers.authorization.split(' ')[1];

    try {
        payLoad = jwt.verify(token, config.jwtSecretKey);
    } catch (e) {
        if (e.name == 'TokenExpiredError') {
            res.status(401).send({message: 'Token expired' + e.name});
        } else {
            res.status(401).send({message: 'Authorization failed' + e.name});
        }
        return;
    }

    //connect to database if the authentication worked
    oracledb.getConnection(config.database, function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.execute('select column1 as "column1" ' + 'from jsao_protected_things ',
            {},//no binds')
            {outFormat: oracledb.OBJECT},
            function (err, results) {
                if (err) {
                    connection.release(function (err) {
                        if (err) {
                            console.log('Error releasing the database connection: ' + err.message);
                        }
                    });
                    return next(err);
                }
                res.status(200).send(results.rows);

                connection.release(function (err) {
                    if (err) {
                        console.log('Error releasing the database connection: ' + err.message)
                    }
                });

            }
        )
    })
}

module.exports.get = get;