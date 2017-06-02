var MyGame = {};

MyGame.Boot = function(game) {};

MyGame.Boot.prototype = {
	preload : function() {
		// Load assets nedded for preloader.
		this.load.image('logo', '../assets/logo.png');
	},
	
	create : function() {	
		this.state.start('Preloader');
	}
}; 