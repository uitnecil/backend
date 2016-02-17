'use strict';
var path = require('path');
var fs = require('fs');
var filesPath = 'f:/temp/Poze/';

var arr = [1, 2, 3, 4, 5];
//readMyDir1(function(data){
//    console.log('readMyDir1 done');
//    //console.log(data);
//});
//readMyDir2(function(data){
//    console.log('readMyDir2 done');
//    //console.log(data);
//});
//iterate1();
//iterate2();
//iterateAsync1(function () {
//    console.log('iterateAsync1 done')
//});
//iterateAsync2(function () {
//    console.log('iterateAsync2 done')
//});
//
//
//
//function iterate1() {
//    for (var i = 0; i < arr.length; i++) {
//        console.log('iterate1: ' + arr[i]);
//    }
//}
//
//function iterate2() {
//    for (var i = 0; i < arr.length; i++) {
//        console.log('iterate2: ' + arr[i]);
//    }
//}
//
//function iterateAsync1(callb) {
//    for (var i = 0; i < arr.length; i++) {
//        console.log('iterateAsync1: ' + arr[i]);
//    }
//    callb();
//}
//
//function iterateAsync2(callb) {
//    for (var i = 0; i < arr.length; i++) {
//        console.log('iterateAsync2: ' + arr[i]);
//    }
//    callb();
//}
//
//function readMyDir1(callback) {
//    console.log('readMyDir1: Start reading dir');
//    fs.readdir(path.normalize(filesPath), function (err, data) {
//        console.log('readMyDir1: End reading dir');
//        for (var i = 0; i < arr.length; i++) {
//            console.log('readMyDir1: ' + arr[i]);
//        }
//        callback(data);
//    });
//}
//
//function readMyDir2(callback) {
//    console.log('readMyDir2: Start reading dir');
//    fs.readdir(path.normalize(filesPath), function (err, data) {
//        console.log('readMyDir2: End reading dir');
//        for (var i = 0; i < arr.length; i++) {
//            console.log('readMyDir2: ' + arr[i]);
//        }
//        callback(data);
//    });
//}
//




var arg = ['1','2','3','4','5','6','7','8','9','10'];

iterate1();
console.log('iterate1 done');
iterate2();
console.log('iterate2 done');
iterateasync1(function () {
    console.log('iterateasync1 done ')
});
iterateasync2(function () {
    console.log('iterateasync2 done ')
});

function iterate1(){
    for (var i = 0; i < arg.length; i++) {
        console.log('iterate1: ' + arg[i] )
    }
}
function iterate2(){
    for (var i = 0; i < arg.length; i++) {
        console.log('iterate2: ' + arg[i] )
    }
}

function iterateasync1(callback) {
    for (var i = 0; i < arg.length; i++) {
        console.log('iterateasync1: ' + arg[i] )
    }
    callback(1)
}

function iterateasync2(callback) {
    for (var i = 0; i < arg.length; i++) {
        console.log('iterateasync2: ' + arg[i] )
    }
    callback(1)
}

