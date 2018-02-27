/** 
 * Based on: http://www.dynetisgames.com/2017/03/06/how-to-make-a-multiplayer-online-game-with-phaser-socket-io-and-node-js/ 
 */

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var path = require('path');

// app.use('/css',express.static(path.resolve(__dirname + '/../')));
app.use('/js',express.static(path.resolve(__dirname + '/../js/')));
app.use('/assets',express.static(path.resolve(__dirname + '/../../assets/')));
app.use('/bower_components',express.static(path.resolve(__dirname + '/../../bower_components/')));

app.get('/',function(req,res){
    res.sendFile(path.resolve(__dirname+'/../index.html'));
});


server.listen(8081,function(){ // Listens to port 8081
    console.log('Listening on '+server.address().port);
});