var express = require('express');
var fs = require('fs');
var path = require('path');
var gm = require('gm').subClass({imageMagick: true}); //
var math = require('math');


var pathoffiles = "public/Pictures/";
var myfiles = [];
var contentsofdir;
var a;
dir = __dirname + '/imgs/'

var router = express.Router();

router.get('/', function (req, res, next) {
    _getmecontentofmypath(function (data) {
        console.log("Data: " + data.toString());
        res.send(data);
        console.log("Data was sent");

        //convert all photos to smaller sizes
        myfiles.forEach(function (content, index) {
            gm(path.normalize(pathoffiles + content.filename))
                .size(function (err, size) {
                    if (err) {
                        return console.dir(arguments)
                    }
                    //this.resize(math.round(size.width / 20), math.round(size.height / 20), '!')
                    this.resize(math.round(size.width * (72 * 100 / size.height) / 100), math.round(72), '!') // calculate the corect height scaled based on the 24 px width
                    this.quality(80)
                    this.write(path.normalize(dir + content.filename.toString().split('.')[0] + '_redim.jpg'), function (err) {
                        if (err) return console.dir(arguments)
                        console.log(this.outname + " created  ::  " + arguments[3])
                    });
                });
        })
        //re-init myfiles array with null
        myfiles = [];

    });
});

/* GET folder listing. */
function _getmecontentofmypath(callback) {
    fs.readdir(path.normalize(pathoffiles), function (err, data) {
        contentsofdir = data;
        a = '';
        contentsofdir.forEach(function (content, index) {
            fs.readFile(pathoffiles + contentsofdir[index], function (err, data) {
                if (err) return console.log(err.stack);

                //read async way last modified time of the file; once done construct object and push it in myfiles
                fs.stat(pathoffiles + contentsofdir[index], function (err, stats) {
                    var fileData = {
                        filename: content,
                        filecontent: '', //data,
                        filedate: stats.mtime //last change date of the file
                    }
                    _pushmydata(fileData, index, a, function (dataresult) {
                        a = dataresult;
                    })
                    if (myfiles.length === contentsofdir.length) {
                        callback(a);
                    }
                })
            })
        })
    })
}

function _pushmydata(fileData, id, a, callback) {
    var temp;
    myfiles.push(fileData);
    temp = '<a href="http://localhost:3000/Pictures/' + contentsofdir[id] + '">' + contentsofdir[id] + '</a>';
    a += id + ' - [' + fileData.filecontent.toString().substring(1, 10) + ']' + " - " + temp + " - " + fileData.filedate + '<br>';
    callback(a)
}

module.exports = router;
