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

/**
 * Get 
 */

Client.socket.on('hello',function(data){
    if(data == 1) {
        game.state.states['Stage'].setMaster(true);
    } else {
        game.state.states['Stage'].setMaster(false);
    }
    
    // console.log(MyGame);
});



/* Client.socket.on('moveBall', function(data) {
    //console.log(MyGame.Stage)
    //MyGame.Stage.moveBall(data.px, data.py);
    id(data.ball == true)
    game.state.states['Stage'].moveBall(data.px, data.py);
}); */

/* Client.moveBall = function(px, py) {
    Client.socket.emit( 'moveBall', {px: px, py: py} );
}

Client.updateBall = function() {

} */