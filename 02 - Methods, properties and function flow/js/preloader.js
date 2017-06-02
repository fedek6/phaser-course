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
		
		// audio
		this.load.audio('background', '../assets/05 I\'m a Fighter.mp3');
		this.load.audio('click', '../assets/220200__gameaudio__basic-click-wooden.wav');
	},
	
	init : function(spinner) {
		/**
		 * Prepare spinner for preloading purposes.
		 */	
		this.spinner = this.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		this.spinner.width = 50;
		this.spinner.height = 50;
		this.spinner.anchor.set(0.5);
		
		console.log('INFO: Running preloader state.');
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
	},
	
	create : function() {	
		var background = game.add.audio('background');
		var click = game.add.audio('click');
			
		/**
		 * Decode audio before jumping to next state.
		 */
		this.sound.setDecodedCallback(
			[ click, background ],
			this.start, this
		);				
	},
	
	/**
	 * This function serves as callback to setDecodedCallback.
	 * It's triggered when audio decoding is over.
	 */
	start : function() {
		var title = 'This var will passed to next state.';
		
		/**
		 * You can pass vars to init function in next state.
		 * Check what's happening with title var:
		 */
		this.state.start('Menu', true, false, title);
	}
}; 