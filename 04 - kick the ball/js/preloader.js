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
        this.load.path = '../assets/';

		// image
		this.load.image('background', 'sky.png');
		this.load.image('ball', 'ball.png');
		this.load.image('field', 'field.png');
		this.load.image('dot', 'dot.png');
		this.load.image('cue', 'cue.png');

		// physics
		this.load.physics( 'field' );
	},
	
	init : function(spinner) {

		//	Enable p2 physics
		game.physics.startSystem(Phaser.Physics.P2JS);

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