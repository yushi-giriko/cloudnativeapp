'use strict';

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var request = require("request");

app.use(express.static(__dirname + '/src'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + 'index.html');
});

io.on('connection', function (socket) {
    socket.on('random', function (id) {
        console.log('randomized id: ' + id);

        var options = {
            method: 'GET',
            url: `${process.env.DBURI}?id=${id}`,
            headers:
            {
                'Postman-Token': 'c55ef931-4167-420e-9ae8-0d62c5be2588',
                'cache-control': 'no-cache'
            }
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
            io.emit('randomprofile', body)
        });

    });
});

http.listen(80, function () {
    console.log('listening on *:80');
});