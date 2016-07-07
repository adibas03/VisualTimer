/* ==========================================
 * VisualTimer.js
 * https://github.com/terebentina/VisualTimer
 * ==========================================
 * Copyright 2014 Dan Caragea.
 *
 * Licensed under the MIT license
 * http://opensource.org/licenses/MIT
 * ========================================== */

(function() {
	"use strict";

	function VisualTimer(opts) {
		this.type = 'down';
		if (opts.type) {
			this.type = opts.type;
		}
		this.loop = opts.tween == false?1000:20;
		this.totalTime = opts.seconds*(1000/this.loop);
		this.game = opts.game;
		if(opts.group)this.group = opts.group;
		this.onComplete = opts.onComplete;
		var key = 'timer';
		if(opts.notify)this.warn = this.game.add.audio('clock_sound');
		if(opts.pulse)this.pulse = opts.pulse;
		if (opts.key) {
			key = opts.key;
		}
		(this.group)?this.group.create(opts.x, opts.y, key, 1):this.game.add.sprite(opts.x, opts.y, key, 1);
		this.sprite = (this.group)?this.group.create(opts.x, opts.y, key, 0):this.game.add.sprite(opts.x, opts.y, key, 0);
		if(this.pulse){
			this.sprite.alpha = 0.2
		this.game.add.tween(this.sprite).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 0, 800, true);
			}
		this.fullWidth = this.sprite.width;
		this.reset();
	}

	VisualTimer.prototype = {
		reset: function() {
			if (this.timer) {
				this.timer.stop();
			}
			var self = this;
			this.hasFinished = false;
			this.timer = this.game.time.create(true);
			this.timer.repeat(this.loop, this.totalTime, timerTick, this);
			this.timer.onComplete.add(function() {
				self.hasFinished = true;
				if(self.warn)self.warn.stop();
				if (self.onComplete) {
					self.onComplete();
				}
			});
			this.rect = new Phaser.Rectangle(0, 0, 0, this.sprite.height);
			if (this.type == 'down') {
				this.sprite.crop(null);
			} else {
				this.sprite.crop(this.rect);
			}
		},

		setTime: function(seconds) {
			this.totalTime = seconds;
			this.reset();
		},

		start: function() {
			this.reset();
			this.timer.start();
		},

		stop: function() {
			this.timer.stop();
			if(this.warn)this.warn.stop();
		},

		pause: function() {
			this.timer.pause();
			if(this.warn)if(this.warn.isPlaying)this.warn.stop;
		},

		resume: function() {
			this.timer.resume();
		},

		remainingTime: function() {
			return this.totalTime - this.timer.seconds*(1000/this.loop);
		}
	};


	function timerTick() {
		/*jshint validthis:true */
		var myTime = (this.type == 'down') ? this.remainingTime() : this.timer.seconds;
		this.rect.width = Math.max(0, (myTime / this.totalTime) * this.fullWidth);
		this.sprite.crop(this.rect);
		if(this.warn)if((myTime / this.totalTime) < (this.type == 'down' ?0.36:1-0.36))this.warn.isPlaying?'':this.warn.loopFull();
	}


	if (module) {
		module.exports = VisualTimer;
	}
})();
