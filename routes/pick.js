var express = require('express');
var router = express.Router();

var fs = require('fs');
var picked = [];

function getFile(file) {

    var fileName = file + '.json';

    let rawdata;
    if (fs.existsSync(fileName)) {
        rawdata = fs.readFileSync(fileName);
        return JSON.parse(rawdata);
    } else {
        return [];
    }

}

function updateFile(fileName) {

    var file = fs.createWriteStream(fileName + '.json');
    file.on('error', function(err) { /* error handling */ });
    file.write(JSON.stringify(picked));
    file.end();
}

function pick(max) {
    var min = Math.ceil(1);
    var max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

router.get('/', function(req, res, next) {

    var listFile = "reg_" + req.query.lista;
    var max = req.query.max;

    picked = getFile(listFile);

    var randomPick;
    var found = false;
    while (!found) {
        randomPick = pick(max);
        found = picked.indexOf(randomPick) == -1;
    }

    picked.push(randomPick);
    updateFile(listFile);

    res.send("" + randomPick);

});

router.get('/sacados', function(req, res, next) {

    var listFile = "reg_" + req.query.lista;
    picked = getFile(listFile);
    res.send("" + JSON.stringify(picked));

});

router.get('/init', function(req, res, next) {

    var listFile = "reg_" + req.query.lista;
    var valores = req.query.valores;

    picked = JSON.parse(valores);

    updateFile(listFile);
    res.send("Hecho!");

});

module.exports = router;
