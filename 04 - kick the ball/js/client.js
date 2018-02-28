/** 
 * Based on: http://www.dynetisgames.com/2017/03/06/how-to-make-a-multiplayer-online-game-with-phaser-socket-io-and-node-js/ 
 */
var Client = {};
Client.socket = io.connect();

/** 
 * Test websocket 
 */
Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

/**
 * Register new player
 */
Client.registerPlayer = function() {
    Client.socket.emit('register');
}

Client.socket.on('hello',function(data){
    console.log(data);
});