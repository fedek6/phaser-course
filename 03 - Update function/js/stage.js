MyGame.Stage = function(game) {
	/**
	 * Declare vars
	 */
	this.ball;
	this.ball2;
	this.debugStep = 16;
	this.velocityStep = 500;
	this.text;
	
	// feedback effect
	this.b = 0;
	this.frames = [];
	this.start = false;
	// n
	this.bufferLength = 3;
};

MyGame.Stage.prototype = {
		
	create : function() {
		
		console.log( game.context );
		
		// create 10 frames (init array)
		for (var i = 0; i < 10; i++) {
			this.frames.push(this.make.bitmapData(game.width, game.height));
		}	
		
		// Create PAUSED text
	    this.text = game.add.text(game.world.centerX, game.world.centerY, "PAUSED");
	    this.text.anchor.setTo(0.5);
	    this.text.visible = false;
		
		// Set background to white
		game.stage.backgroundColor = "#FFF";
		
		// Add sprites to scene
		this.ball = this.add.sprite(game.world.centerX - 50, game.world.centerY, 'ball');
		this.ball2 = this.add.sprite(game.world.centerX + 50, game.world.centerY, 'ball');
		
		// set sprite anchor to 0.5 (center)
		this.ball.anchor.setTo(0.5);
		this.ball2.anchor.setTo(0.5);
		
		/**
		 * Physics
		 * Bouncy ball
		 */
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.enable( [this.ball, this.ball2 ], Phaser.Physics.ARCADE);
		
		// ball 1
	    this.ball.body.velocity.x=100;
	    this.ball.body.velocity.y=100;
	    this.ball.body.collideWorldBounds = true;
	    this.ball.body.bounce.set(1);
	    
	    // ball 2
	    this.ball2.body.velocity.x=100;
	    this.ball2.body.velocity.y=100;
	    this.ball2.body.collideWorldBounds = true;
	    this.ball2.body.bounce.set(1);
	},
	
	paused: function() {
		this.text.visible = true;
	},

	resumed: function() {
		this.text.visible = false;
	},
	
	pauseUpdate: function() {
		/**
		 * Rotate balls during pause
		 */		
		this.ball.rotation += this.ball.body.velocity.x / 10000;
		this.ball2.rotation += this.ball.body.velocity.x / 10000;
	},
		
	update: function() {
		/**
		 * Rotate ball every frame 
		 */
		this.ball.rotation += this.ball.body.velocity.x / 10000;
		this.ball2.rotation += this.ball.body.velocity.x / 10000;
		
		/**
		 * Check collision every frame
		 */
		this.physics.arcade.collide(this.ball, this.ball2, this.collideCallback, null, this);
	},
	
	collideCallback: function(obj1, obj2) {
		/**
		 * Calculate new velocity
		 */
		var fasterBall, slowerBall;
		
		// determine which ball is running faster
		if( Math.abs( obj1.body.velocity.x ) > Math.abs( obj2.body.velocity.x ) ) {
			fasterBall = obj1;
			slowerBall = obj2;
		} 
		else if( Math.abs( obj1.body.velocity.x ) < Math.abs( obj2.body.velocity.x ) ) {
			fasterBall = obj2;
			slowerBall = obj1;			
		}
		else {
			fasterBall = obj1;
			slowerBall = obj2;			
		}
		
		// slow down faster ball
		if( fasterBall.body.velocity.y < 0 ) {
			fasterBall.body.velocity.y = 100;
		} else {
			fasterBall.body.velocity.y = -100;
		}
		
		if( fasterBall.body.velocity.x < 0 ) {
			fasterBall.body.velocity.x = 100;
		} else {
			fasterBall.body.velocity.x = -100;
		}		
	
		// speedup slower ball
		if( slowerBall.body.velocity.y < 0 ) {
			slowerBall.body.velocity.y = -this.velocityStep;
		} else {
			slowerBall.body.velocity.y = this.velocityStep;
		}
		
		if( slowerBall.body.velocity.x < 0 ) {
			slowerBall.body.velocity.x = -this.velocityStep;
		} else {
			slowerBall.body.velocity.x = this.velocityStep;
		}	
	},
	
	preRender: function() {
		/**
		 * Grab frames for feedback effect
		 */
		this.frames[this.b].cls();
		this.frames[this.b].copyRect(
			this.game.canvas,
			this.world.bounds,
			0, 0, 0.1
		);		
		
		this.b++;
		
		if (this.b === this.bufferLength) {
			this.start = true;
			this.b = 0;
		}
	},
	
	render: function() {
			
		/**
		 * Show debug info
		 */
		game.debug.text('FPS: ' + game.time.fps || '--', 2, this.debugStep, "#000");
		game.debug.text('Ball 1 x velocity: ' + this.ball.body.velocity.x, 2, this.debugStep * 2, "#000");
		game.debug.text('Ball 1 y velocity: ' + this.ball.body.velocity.y, 2, this.debugStep * 3, "#000");
		game.debug.text('Ball 2 x velocity: ' + this.ball2.body.velocity.x, 2, this.debugStep * 4, "#000");
		game.debug.text('Ball 2 y velocity: ' + this.ball2.body.velocity.y, 2, this.debugStep * 5, "#000");
		
		/**
		 * Render n frames
		 */
		if (this.start) {
			// The frame buffer is full, so lets start drawing them back
			for (var i = 0; i < this.bufferLength; i++) {
				/**
				 * Warning! This works only in canvas mode.
				 */
				game.context.drawImage(this.frames[i].canvas, 0, 0);
			}
		} 	
		
		// Let's render Scanline effect (works only in 2D canvas)
		var gap = getRandomInt(3, 5);
		
		this.game.context.fillStyle = 'rgba(0, 0, 0, 0.1)';
		for (var y = 0; y < this.game.height; y += gap)
		{
			this.game.context.fillRect(0, y, this.game.width, 1);
		}
	}
}; 