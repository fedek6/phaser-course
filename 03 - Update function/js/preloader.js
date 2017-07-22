/**
 * Preloader state.
 * Preload all stuff that you need for your game here.
 */

MyGame.Preloader = function(game) {
	/**
	 * Init vars.
	 */
	this.spinner = null;
};

MyGame.Preloader.prototype = {
	preload : function() {
		// Load assets.
		
		// image
		this.load.image('background', '../assets/sky.png');
		this.load.image('ball', '../assets/ball.png');
	},
	
	init : function(spinner) {
		/**
		 * Prepare spinner for preloading purposes.
		 * You can use an image called logo because it was preloaded in boot state.
		 */	
		this.spinner = this.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		this.spinner.width = 50;
		this.spinner.height = 50;
		this.spinner.anchor.set(0.5);
		
		console.log('INFO: Running preloader state.');
	},
	
	create: function() {
		this.state.start('Stage', true, false);
	},
	
	loadUpdate: function () {
		/**
		 * Rotate spinner while loading images.
		 */
		this.spinner.rotation += 0.05;
	},
	update: function () {
		/**
		 *  Rotate spinner while decoding audio.
		 */
		this.spinner.rotation += 0.05;
	}
}; 