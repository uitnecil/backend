var oracledb = require('oracledb');
var morgan = require('morgan');
var config = require('./config');
var jwt = require('jsonwebtoken');

module.exports = {
    getProtectedData: getProtectedData
};


function getProtectedData(req, res, next) {

    //connect to database if the authentication worked
    oracledb.getConnection(config.database, function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.execute('select column1 as "column1" from jsao_protected_things ',
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
