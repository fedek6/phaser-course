MyGame.Stage = function(game) {
	/**
	 * Declare vars
	 */
	this.debugStep = 16;
	this.velocityStep = 500;
	this.text;

	// Visible game objects
	this.field;
	this.dot;
	this.gate;
	this.cue;
	this.goalKeeper;

	this.aimLine;
	this.timer;
	this.timerTxt;
	this.second;
	this.speed=0;
	this.upperLimit;
	this.lowerLimit;

	/** @var integer limitKicks Limit per second */
	this.limitKicks = 1;

	/** @var integet kick Current kick */
	this.kick;

	// Config vars

	/** @var integer speedLimit */
	this.speedLimit=80;

	/** @var integer startGameAfter */
	this.startGameAfter = 3;

	this.goalKeeperLimitation = 80;

	this.goalKeeperSpeed = 300;

	this.debug = true;

	// Physics materials
	this.fieldMaterial;
	this.ballMaterial;
	this.goalKeeperMaterial;
	
	// feedback effect
	this.b = 0;
	this.frames = [];
	this.start = false;

	// n
	this.bufferLength = 3;

	// keys
    this.debugKey = null;
};

MyGame.Stage.prototype = {
		
	create : function() {
		
		console.log( game.context );

		// show debug by default
		MyGame.showDebug = this.debug;

		/**
		 * Init vars
		 */
		this.second = 0;
		this.kick = 0;
		
		// create 10 frames (init array)
		for (var i = 0; i < 10; i++) {
			this.frames.push(this.make.bitmapData(game.width, game.height));
		}	

		// Create field
		this.field = this.add.sprite(game.world.centerX, game.world.centerY, 'field');
		game.physics.p2.enable(this.field, MyGame.showDebug);
		this.field.body.setMaterial(this.fieldMaterial);
		this.field.body.static = true;
		this.field.body.clearShapes();
		this.field.body.loadPolygon('field', 'field');

		this.fieldMaterial = this.physics.p2.createMaterial('fieldMaterial', this.field.body);

		/**
		 * Add gate
		 * This invisible sprite
		 */ 
		this.gate = this.add.sprite();
		this.physics.p2.enable(this.gate, MyGame.showDebug);
		this.gate.body.static = true;
		this.gate.body.clearShapes();

		this.gate.body.addRectangle(60, 100, 780, 300);

		// Add ball
		this.dot = this.add.sprite(200, game.world.centerY, 'dot');
		this.physics.p2.enable(this.dot, MyGame.showDebug);
		this.dot.body.setCircle(25);
		this.dot.body.setMaterial(this.ballMaterial);
		this.dot.body.damping = 0.40;
		this.dot.body.angularDamping = 0.45;
		this.dot.body.fixedRotation = true;

		this.ballMaterial = this.physics.p2.createMaterial('ballMaterial', this.dot.body);

		/**
		 * Add cue
		 */
		this.cue = this.add.sprite(0, 0, 'cue');
		this.cue.anchor.y = 0.5;
		this.cue.anchor.x = 0;
		this.cue.visible = this.debug;

		this.aimLine = new Phaser.Line(this.dot.x, this.dot.y, this.dot.x, this.dot.y);

		/**
		 * Add goal keeper
		 */
		var bmd = game.add.bitmapData(40, 80);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, 40, 80);
		bmd.ctx.fillStyle = '#000000';
		bmd.ctx.fill();

		this.goalKeeper  = game.add.sprite(700, game.world.centerY, bmd);
		this.goalKeeper.anchor.setTo(0.5, 0.5);
		this.physics.p2.enable(this.goalKeeper, MyGame.showDebug);
		this.goalKeeper.body.static = true;
		this.goalKeeper.body.setMaterial(this.goalKeeperMaterial);

		this.goalKeeperMaterial = this.physics.p2.createMaterial('goalKeeperMaterial', this.goalKeeper.body);

		// Calculate limitations
		this.upperLimit = (game.world.centerY - 80) - (this.goalKeeper.height/2);
		this.lowerLimit = (game.world.centerY + 80) + (this.goalKeeper.height/2);

		// Create PAUSED text
	    this.text = game.add.text(game.world.centerX, game.world.centerY, "PAUSED");
	    this.text.anchor.setTo(0.5);
		this.text.visible = false;

		// Set background to white
		game.stage.backgroundColor = "#FFF";
		
		// P2 Impact Events
        this.physics.p2.setImpactEvents(true);

        var ballVsFieldMaterial = this.physics.p2.createContactMaterial(
            this.ballMaterial, this.fieldMaterial);

		ballVsFieldMaterial.restitution = 0.6;

        var ballVsGoalKeeperMaterial = this.physics.p2.createContactMaterial(
            this.ballMaterial, this.goalKeeperMaterial);

		ballVsGoalKeeperMaterial.restitution = 1;

		/**
		 * Start game after N seconds
		 */

		// Create timer
		this.timerTxt = game.add.text(game.world.centerX, game.world.centerY, "");
		this.timerTxt.anchor.setTo(0.5);
		this.timerTxt.visible = true;
		this.timer = game.time.create(false);
		
		//  Set a TimerEvent to occur after 2 seconds
		var s = this.startGameAfter;

		this.timer.loop(500, function() {
			if( s > 0 ) {
				this.timerTxt.text =  s--;
			} else {
				this.timerTxt.visible = false;
				this.startGame();
			}
		}, this);
		this.timer.start();

		// Collision callbacks
		this.dot.body.createBodyCallback(this.gate, this.hitGate, this);
		
		/**
		 *  Input callbacks
		 */

		/* Cue rotation */
		this.input.addMoveCallback(this.updateCue, this);

        //  Press D to toggle the debug display
        this.debugKey = this.input.keyboard.addKey(Phaser.Keyboard.D);
		this.debugKey.onDown.add(this.toggleDebug, this);
	},

	/**
	 * Start game
	 */
	startGame: function() {
		/* Shot */
		this.input.onDown.add(this.takeShot, this);

		/** Kick throthle */
		this.timer.loop(1000, function() {
			this.kick = 0;
		}, this);
	},

	updateCounter: function() {
		++this.second;
		this.timerTxt.text =  this.second;
		console.log('tick tac');
	},

    updateCue: function () {

        this.aimLine.start.set(this.dot.x, this.dot.y);
        this.aimLine.end.set(this.input.activePointer.x, this.input.activePointer.y);

        this.cue.position.copyFrom(this.aimLine.start);
        this.cue.rotation = this.aimLine.angle;

        //this.fill.position.copyFrom(this.aimLine.start);
        //this.fill.rotation = this.aimLine.angle;


		this.cue.width =  this.aimLine.length;
        //this.fillRect.width = this.aimLine.length;
        //this.fill.updateCrop();

	},
	
	hitGate: function(dot, gate) {
		console.log("HIT! BAM!");
		this.game.state.start("Stage"); 
	},

	/**
	 * Kick the ball
	 */
    takeShot: function () {
		if(++this.kick > this.limitKicks) return;

		// apply speed limit
		if( (this.aimLine.length / 3) > this.speedLimit ) {
			this.speed = 0;
		} else {
			this.speed = Math.abs( this.speedLimit - (this.aimLine.length / 3) );
		}
		
        this.updateCue();

        var px = (Math.cos(this.aimLine.angle) * this.speed);
        var py = (Math.sin(this.aimLine.angle) * this.speed);

        this.dot.body.applyImpulse([ px, py ], this.dot.x, this.dot.y);
    },

    toggleDebug: function () {

		this.debug = !this.debug;
        MyGame.showDebug = this.debug;

        this.state.restart();

    },

	paused: function() {
		this.text.visible = true;
	},

	resumed: function() {
		this.text.visible = false;
	},
	
	pauseUpdate: function() {

	},
		
	update: function() {

		/**
		 * Goal keeper movement
		 */
		if (game.input.keyboard.isDown(Phaser.Keyboard.W) && this.goalKeeper.y >= this.upperLimit )
		{
			console.log( 'y: ' + this.goalKeeper.y + ' limit is: ' + this.upperLimit  );
			this.goalKeeper.body.velocity.y = -this.goalKeeperSpeed;
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.S) && this.goalKeeper.centerY <= this.lowerLimit )
		{
			console.log( 'y: ' + this.goalKeeper.y + ' limit is: ' + this.lowerLimit  );
			this.goalKeeper.body.velocity.y = this.goalKeeperSpeed; 
		}
		else {
			this.goalKeeper.body.velocity.y = 0;
		}
	},
	
	collideCallback: function(obj1, obj2) {

		
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
		game.debug.text('FPS: ' + game.time.fps || '--', 10, 20, this.debugStep, "#000");
		game.debug.text('Speed: ' + this.speed, 10, 40, this.debugStep, "#000");
		game.debug.text('Kick: ' + this.kick, 10, 60, this.debugStep, "#000");
		
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