var MyGame = {};

MyGame.Preloader = function(game) {
};

MyGame.Preloader.prototype = {
	preload : function() {
		// Load assets.
		this.load.image('background', '../assets/sky.png');
		this.load.image('logo', '../assets/logo.png');
	},
	create : function() {
		// Start next state.
		this.state.start('Menu');
	}
}; 