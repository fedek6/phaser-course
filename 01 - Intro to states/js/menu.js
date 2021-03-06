MyGame.Menu = function(game) {
	/**
	 * Declare vars
	 */
	this.background;
	this.logo;
};

MyGame.Menu.prototype = {
	create : function() {
		
		// Add sprites to scene
		this.background = this.add.sprite(0, 0, 'background');
		this.logo = this.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		
		// set sprite anchor to 0.5
		this.logo.anchor.setTo(0.5);
		
		// set sky to full game screen
		this.background.height = game.height;
		this.background.width = game.width;
	}
}; 