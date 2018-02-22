MyGame.Stage = function(game) {
	/**
	 * Declare vars
	 */
	this.debugStep = 16;
	this.velocityStep = 500;
	this.text;
	this.field;
	this.dot;
	this.gate;
	this.cue;
	this.aimLine;
	this.timer;
	this.timerTxt;
	this.second=0;

	this.fieldMaterial;
	this.ballMaterial;
	
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
		MyGame.showDebug = true;
		
		// create 10 frames (init array)
		for (var i = 0; i < 10; i++) {
			this.frames.push(this.make.bitmapData(game.width, game.height));
		}	
		
		// Create PAUSED text
	    this.text = game.add.text(game.world.centerX, game.world.centerY, "PAUSED");
	    this.text.anchor.setTo(0.5);
		this.text.visible = false;

		
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

		this.gate.body.addCircle(50, 780, 300 );

		// Add ball
		this.dot = this.add.sprite(200, game.world.centerY, 'dot');
		this.physics.p2.enable(this.dot, MyGame.showDebug);
		this.dot.body.setCircle(25);
		this.dot.body.setMaterial(this.ballMaterial);
		this.dot.body.damping = 0.40;
		this.dot.body.angularDamping = 0.45;

		this.ballMaterial = this.physics.p2.createMaterial('ballMaterial', this.dot.body);

		/**
		 * Add cue
		 */
		this.cue = this.add.sprite(0, 0, 'cue');
		this.cue.anchor.y = 0.5;
		this.cue.anchor.x = -0.2;
		this.cue.visible = false;
		this.aimLine = new Phaser.Line(this.dot.x, this.dot.y, this.dot.x, this.dot.y);

		// Set background to white
		game.stage.backgroundColor = "#FFF";

		// Create timer
		this.timerTxt = game.add.text(20, 50, "");
		this.timerTxt.anchor.setTo(0.5);
		this.timerTxt.visible = true;
		this.timer = game.time.create(false);
		
		//  Set a TimerEvent to occur after 2 seconds
		this.timer.loop(1000, this.updateCounter, this);
		this.timer.start();
		
		// P2 Impact Events
        this.physics.p2.setImpactEvents(true);

        var ballVsFieldMaterial = this.physics.p2.createContactMaterial(
            this.ballMaterial, this.fieldMaterial);

		ballVsFieldMaterial.restitution = 0.6;


		// Collision callbacks
		this.dot.body.createBodyCallback(this.gate, this.hitGate, this);
		
		// Input callbacks

		/* Cue rotation */
		this.input.addMoveCallback(this.updateCue, this);

		/* Shot */
		this.input.onDown.add(this.takeShot, this);

        //  Press D to toggle the debug display
        this.debugKey = this.input.keyboard.addKey(Phaser.Keyboard.D);
		this.debugKey.onDown.add(this.toggleDebug, this);


		
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

        //this.fillRect.width = this.aimLine.length;
        //this.fill.updateCrop();

	},
	
	hitGate: function(dot, gate) {
		console.log("HIT! BAM!");
		this.game.state.start("Stage"); 
	},

    takeShot: function () {
        var speed = (this.aimLine.length / 3);

        if (speed > 112)
        {
            speed = 112;
        }

        this.updateCue();

        var px = (Math.cos(this.aimLine.angle) * speed);
        var py = (Math.sin(this.aimLine.angle) * speed);

        this.dot.body.applyImpulse([ px, py ], this.dot.x, this.dot.y);

        // this.cue.visible = false;

    },

    toggleDebug: function () {

        MyGame.showDebug = (MyGame.showDebug) ? false : true;

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
		game.debug.text('FPS: ' + game.time.fps || '--', 2, this.debugStep, "#000");
		
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