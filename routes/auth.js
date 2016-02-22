var jwt=require('jsonwebtoken');
var config=require('./config');

module.exports.auth = function(role) {
    return function(req, res, next) {
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

        if (!role || role === payLoad.role) {
            //pass some user details through in case they are needed
            console.log('req.user: ' + req.user);
            req.user = {
                email: payLoad.sub,
                role: payLoad.role
            }

            next();
        } else {
            res.status(401).send({message: 'You are not authorized'})
        }
    }
};
