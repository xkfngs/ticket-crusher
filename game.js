// title:  Ticket Crusher
// author: Christopher Stokes
// desc:   Completely accurate simulation of Technical Support
// script: js

var fc=0 //ongoing frame counter
var shake=0 //screen shake
var shaked=0 //shake distance

var swid = 240;
var shei = 136;

// utility
function collides(objA, objB) {
	if (objA.x < objB.x + objB.wid &&
   objA.x + objA.wid > objB.x &&
   objA.y < objB.y + objB.hei &&
   objA.y + objA.hei > objB.y) {
    return true;
	}
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
EasingFunctions = {
	// no easing, no acceleration
	linear: function (t, b, c, d) { 
		return c * (t/d) + b;
	},
	// accelerating from zero velocity
	easeInQuad: function (t) { return t*t },
	// decelerating to zero velocity
	easeOutQuad: function (t) { return t*(2-t) },
	// acceleration until halfway, then deceleration
	easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
	// accelerating from zero velocity 
	easeInCubic: function (t) { return t*t*t },
	// decelerating to zero velocity 
	easeOutCubic: function (t) { return (--t)*t*t+1 },
	// acceleration until halfway, then deceleration 
	easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
	// accelerating from zero velocity 
	easeInQuart: function (t) { return t*t*t*t },
	// decelerating to zero velocity 
	easeOutQuart: function (t) { return 1-(--t)*t*t*t },
	// acceleration until halfway, then deceleration
	easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
	// accelerating from zero velocity
	easeInQuint: function (t) { return t*t*t*t*t },
	// decelerating to zero velocity
	easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
	// acceleration until halfway, then deceleration 
	easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

// Player
var p = {
	"x": 96,
	"y": 24,
	"wid": 32,
	"hei": 32,
	"sprites": { 
		"idle": 1,
		"action": 3
	},
	"sprite": "idle",
	"actionCountdown": 0
}

p.update = function() {
	if(btn(0) && this.y>0) this.y--
	if(btn(1) && this.y<shei-this.hei) this.y++
	if(btn(2) && this.x> -(this.wid/2)) this.x--
	if(btn(3) && this.x<swid-this.wid/2) this.x++
	if(btnp(4)) {
		this.actionCountdown = 10;
		
		for (var t=0; t<tickets.length; t++) {

			if (collides({'x': this.x, 'y': this.y, 'wid': this.wid/2, 'hei': this.hei/2}, tickets[t]) && tickets[t].alive) {
				for (var i=0; i<5; i++) {
					var e = new Explosion(tickets[t].x+(tickets[t].wid/2), tickets[t].y+(tickets[t].hei/2));
					explosions.push(e);
				}
				// if (getRandomInt(0, 10) > 7) {
				// 	var t1 = new Ticket(gameState.globalSpeed, gameState.globalBounce, tickets[t].x-tickets[t].wid, tickets[t].y-tickets[t].hei, -1, -1);
				// 	var t2 = new Ticket(gameState.globalSpeed, gameState.globalBounce, tickets[t].x+tickets[t].wid, tickets[t].y+tickets[t].hei, 1, 1);
				// 	var t3 = new Ticket(gameState.globalSpeed, gameState.globalBounce, tickets[t].x-tickets[t].wid, tickets[t].y+tickets[t].hei, -1, 1);
				// 	var t4 = new Ticket(gameState.globalSpeed, gameState.globalBounce, tickets[t].x+tickets[t].wid, tickets[t].y-tickets[t].hei, 1, -1);
				// 	tickets.push(t1, t2, t3, t4);
				// }

				tickets[t].alive = false;
				gameState.score += 1;
				shaked = 4;
				shake = 5;
				sfx(0, getRandomInt(45,50));
			}
		}
	} 
	if (this.actionCountdown > 0) {
		this.sprite = "action";
		this.actionCountdown -= 1;
	} else {
		this.sprite = "idle";
	}
}

p.draw = function() {
	spr(this.sprites[this.sprite],
					this.x,
					this.y,
					1,2,0,0,2,2)
}

// tickets
var tickets = []

var Ticket = function(speed, bounce, x, y, dx, dy) {
	this.x = x || getRandomInt(16,swid-16);
	this.y = y || getRandomInt(16,shei-24);
	this.sprite = 5;
	this.wid = 16;
	this.hei = 16;
	this.alive = true;
	this.speed = speed;
	this.bounce = bounce;
	this.rebound = 0;

	if (dx) {
		this.dx = this.speed*dx;
	} else {
		if (this.x <= swid/2)
			this.dx = this.speed;
		
		if (this.x > swid/2)
			this.dx = (-1 * this.speed);
	}

	if (dy) {
		this.dy = this.speed*dy;
	} else {
		if (this.y <= shei/2)
			this.dy = this.speed;
		
		if (this.y > shei/2)
			this.dy = (-1 * this.speed);
	}

	
	
	
	
	
}

Ticket.prototype.update = function() {
	this.x += this.dx;
	this.y += this.dy;
	
	if ((this.x < 0 || this.x > swid-this.wid) && this.bounce > 0) {
		this.dx = this.dx * -1;
		this.bounce -=1;
		shaked = 2;
		shake = 2;
		sfx(1, getRandomInt(45,50));
	}
	
	if ((this.y < 16 || this.y > (shei-24)) && this.bounce >= 0) {
		this.dy = this.dy * -1;
		this.bounce -=1;
		shaked = 2;
		shake = 2;
		sfx(1, getRandomInt(36,48));
	}
	
	if (this.x < -1 || this.x > swid+1 || this.y < 15 || this.y > shei-8) {
		this.alive = false;
		gameState.missed += 1;
	}

	for (var t=0; t<tickets.length; t++) {
		if (this != tickets[t]) {
			if (collides(this, tickets[t]) && this.rebound != tickets[t]) {
				this.dx = this.dx * -1;
				this.dy = this.dy * -1;
				this.rebound = tickets[t];
			}
		}
	}

	if (this.rebound > 0) this.rebound -=1;
}

Ticket.prototype.draw = function() {
	if (this.bounce < 1 && fc%30 < 15) {
		rect(this.x-2, this.y-2, this.wid+4, this.hei+4, 6);
	} 
	spr(this.sprite, this.x, this.y, -1, 1, 0, 0, 2, 2);
}

var explosions = [];

var Explosion = function(x, y, rad, time) {
	this.x = x;
	this.y = y;
	this.dx = getRandomInt(0, 2) - 1;
	this.dy = getRandomInt(0, 2) - 1;
	this.rad = rad || 3;
	this.time = time || 15;
	this.alive = true;
}

Explosion.prototype.update = function() {
	this.rad -= 0.25;
	this.time -= 1;
	this.x += this.dx;
	this.y += this.dy;

	if (this.rad < 0 || this.time < 0) {
		this.alive = false;
	}
}

Explosion.prototype.draw = function() {
	circ(this.x, this.y, this.rad+1, 0);
	circ(this.x, this.y, this.rad, 6);
}

var menuState = {} 
menuState.update = function() {
	cls(0);
	var title = "TICKET CRUSHER";
	var subtitle = "PRESS X TO START";
	var texWid = print(title,0,-32);
	print(title, (swid-texWid)/2, (shei-12)/2);
	texWid = print(subtitle, 0, -32);
	print(subtitle, (swid-texWid)/2, (shei+12)/2);
	
	if (btn(5)){
		gameState.preload();
		currentState = gameState;
	}
}

var gameState = {};
gameState.score = 0;
gameState.missed = 0;
gameState.day = 1;
gameState.globalSpeed;
gameState.globalBounce;
gameState.numTickets;
gameState.preload = function() {
	gameState.score = 0;
	gameState.missed = 0;
	tickets = [];
	explosions = [];
	gameState.newWave(5, 0.5, 3);
}
gameState.newWave = function(num, speed, bounce) {
	gameState.numTickets = num;
	gameState.globalSpeed = speed;
	gameState.globalBounce = bounce;

	for (var i=0; i<gameState.numTickets; i++) {
		var t = new Ticket(gameState.globalSpeed, gameState.globalBounce);
		tickets.push(t);
	}
}
gameState.update = function() {
	cls(13);
	rect(0, 0, swid, 16, 1)
	map(0, 0, 30, 17, 0, -8, 0);
	print("https://goodertrack.com", 4, 10, 0)
	
	for (var t=tickets.length-1; t>-1; t--) {
		if (!tickets[t].alive) {
			tickets.splice(t, 1);
		} else {
			tickets[t].update();
			tickets[t].draw();
		}
	}

	for (e=explosions.length-1; e>-1; e--) {
		if (!explosions[e].alive) {
			explosions.splice(e, 1);
		} else {
			explosions[e].update();
			explosions[e].draw();
		}
	}
	
	p.update();
	p.draw();

	var TCtext = "CLOSED: "+this.score;
	var TMtext = "MISSED: "+this.missed;


	rect(0, shei-8, 240, 8, 0)
	print(TCtext, 5, shei-7);
	var texWid = print(TMtext, 0, -32);
	print(TMtext, (swid-(texWid+5)), shei-7);

	if (this.missed > this.score/2) {
		currentState = gameoverState;
	}

	if (shake > 0) {
		poke(0x3FF9+1,getRandomInt(-4, 4))
		shake-=1		
		if (shake==0) memset(0x3FF9,0,2);
	}

	if (tickets.length == 0) {
		gameState.day += 1;
		gameState.newWave(gameState.numTickets + 1, gameState.globalSpeed + 0.025, gameState.globalBounce - 0.025)

	}
}

var gameoverState = {};
gameoverState.update = function() {
	cls(0);
	print("YOU'RE FIRED", 5, 5);
	print("You managed to close " + gameState.score + " tickets!", 5, 15);
	print("press X to restart", 5, 25);

	if (btnp(5)) {
		gameState.preload();
		currentState = gameState;
	}
}

var currentState = menuState;

function TIC()
{
	currentState.update();
	fc++;
}

function scanline() 
{
	if (shake > 0) poke(0x3FF9,getRandomInt(-(shaked),shaked))
}

// <TILES>
// 001:11111101111110f0111110f0111110f0111110f0111110f0111110f0111000f0
// 002:1111111111111111111111111111111100011111f0f01111f0f00111f0f0f011
// 003:111111111111111111111101111110f0111110f0111110f0111110f0111000f0
// 004:1111111111111111111111111111111100011111f0f01111f0f00111f0f0f011
// 005:ffffffffff000ff0ff000fffff000ff0fff0fffff00000f0f00000ffffffffff
// 006:ffffffff0000000fffffffff0000000fffffffff0000000fffffffffffffffff
// 007:00ffffff0fffffffffffffffffffffffffffffffffffffff0fffffff00ffffff
// 008:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// 009:ffffff00fffffff0fffffffffffffffffffffffffffffffffffffff0ffffff00
// 010:1111111117777777177777771777777717777777177777771777777711111111
// 011:1111111177777777777777777777777777777777777777777777777711111111
// 012:1111111177777771777777717777777177777771777777717777777111111111
// 017:1110f0ff1110ffff1110ffff11100fff11110fff111100ff111110ff11111000
// 018:f0f0f011fffff011fffff011ffff0111ffff0111fff01111fff0111100011111
// 019:1110f0ff1110ffff1110ffff11100fff11110fff111100ff111110ff11111000
// 020:f0f0f011fffff011fffff011ffff0111ffff0111fff01111fff0111100011111
// 021:f0000000fffffffff0000606f0666606f0666606f0666606f0000600ffffffff
// 022:0000000fffffffff6660000f6660666f6660000f6666660f0060000fffffffff
// 023:0666666066f66ff66ff66f6666fff666666fff6666f66ff66ff66ff606666660
// 024:0bbbbbb0bbfbbbbbbbfffbbbbbfffffbbbfffffbbbfffbbbbbfbbbbb0bbbbbb0
// 025:0bbbbbb0bbbbbfbbbbbfffbbbfffffbbbfffffbbbbbfffbbbbbbbfbb0bbbbbb0
// </TILES>

// <SPRITES>
// 032:5555555555555555555555555555555555555555555555555555555555555555
// 033:555555555555fff5555fff55555ff55555ff5555555555555ff5555555555555
// 034:5555555555555555555555555555555555555555555555555555555555555555
// 035:5555555555555555555555555555555555555555555555555555555555555555
// 036:5555555555555555555555555555555555555555555555555555555555555555
// 037:5555555555555555555555555555555555555555555555555555555555555555
// 038:5555555555555555555555555555555555555555555555555555555555555555
// 039:555555555555ff55555ff55555ff555555555555555555555555555555555555
// 040:5555555555555555555555555555555555555555555555555555555555555555
// 041:5555555555555555555555555555555555555555555555555555555555555555
// 042:5555555555555555555555555555555555555555555555555555555555555555
// 043:5555555555555555555555555555555555555555555555555555555555555555
// 044:5555555555555555555555555555555555f555555ff555555f55555555555555
// 045:5555555555555555555555555555555555555555555555555555555555555555
// 046:55555555555555555555555555555555555555555ff555555ff5555555555555
// 047:5555555555555555555555555555555555555555555555555555555555555555
// 048:5555555555fffff55ff55ff55ff5fff55fff5ff55ff55ff55fffff5555555555
// 049:5555555555fff555555ff555555ff555555ff555555ff55555ffff5555555555
// 050:5555555555ffff555ff55ff55555ff5555ff55555ff55ff55fffff5555555555
// 051:5555555555fffff55ff55ff55555ff5555555ff55ff55ff55fffff5555555555
// 052:5555555555ffff555ff5ff555ff5ff555ff5ff555ffffff55555ff5555555555
// 053:555555555ffffff55ff555555fffff5555555ff55ff55ff55fffff5555555555
// 054:5555555555fffff55ff555555ffffff55ff55ff55ff55ff55fffff5555555555
// 055:5555555555fffff55f555ff555555ff555555ff555555ff55555ff5555555555
// 056:5555555555fffff55ff55ff555ff5ff55ff5ff555ff55ff55fffff5555555555
// 057:5555555555fffff55ff55ff55ff55ff55ffffff555555ff55fffff5555555555
// 058:5555555555555555555555555555555555555555555555555555555555555555
// 059:5555555555555555555555555555555555555555555555555555555555555555
// 060:5555555555555555555555555555555555555555555555555555555555555555
// 061:5555555555555555555555555555555555555555555555555555555555555555
// 062:5555555555555555555555555555555555555555555555555555555555555555
// 063:5555555555fffff55ff55ff555555ff5555fff5555555555555ff55555555555
// 064:5555555555555555555555555555555555555555555555555555555555555555
// 065:5555555555fffff55ff55ff55ff55ff55ffffff55ff55ff55ff55f5555555555
// 066:5555555555fffff55ff55ff55fffff555ff55ff55ff55ff55fffff5555555555
// 067:5555555555fffff55ff55ff55ff555555ff555555ff55ff55fffff5555555555
// 068:555555555ffffff55ff55ff55ff55ff55ff55ff55ff55ff55fffff5555555555
// 069:5555555555fffff55ff555555ffff5555ff555555ff55ff55fffff5555555555
// 070:5555555555fffff55ff55ff55ff555555fffff555ff555555ff5555555555555
// 071:5555555555fffff55ff55ff55ff555555ff5fff55ff55ff55fffff5555555555
// 072:5555555555f55ff55ff55ff55ffffff55ff55ff55ff55ff55ff55f5555555555
// 073:5555555555ffff55555ff555555ff555555ff555555ff55555ffff5555555555
// 074:55555555555ffff555555ff555555ff555555ff55ff55ff55fffff5555555555
// 075:5555555555f55ff55ff55ff55ff5ff555fff5ff55ff55ff55ff55f5555555555
// 076:5555555555ff55555ff555555ff555555ff555555ff55ff55fffff5555555555
// 077:5555555555fffff55f5f5ff55f5f5ff55f5f5ff55f5f5ff55f555f5555555555
// 078:5555555555f55ff55fff5ff55ffffff55ff5fff55ff55ff55ff55f5555555555
// 079:5555555555fffff55ff55ff55ff55ff55ff55ff55ff55ff55fffff5555555555
// 080:5555555555fffff55ff55ff55ff55ff55fffff555ff555555ff5555555555555
// 081:5555555555fffff55ff55ff55ff55ff55ff55ff55ff5f5555fff5ff555555555
// 082:5555555555fffff55ff00ff55ff00ff55fffff555ff5f5555ff55ff555555555
// 083:5555555555fffff55ff555555ffffff555555ff55ff55ff55fffff5555555555
// 084:5555555555fffff55f5ff555555ff555555ff555555ff555555ff55555555555
// 085:5555555555f55ff55ff55ff55ff55ff55ff55ff55ff55ff55fffff5555555555
// 086:555555555fff5ff555ff5ff555ff5ff555ff5ff555ff5ff555ffff5555555555
// 087:555555555ff555f55ff5f5f55ff5f5f55ff5f5f55ff5f5f55fffff5555555555
// 088:5555555555f55ff55ff55f5555fff555555fff5555f55ff55ff55ff555555555
// 089:5555555555f55ff55ff55ff55ff55ff55ffffff555555ff55fffff5555555555
// 090:5555555555fffff55f555ff5555fff5555fff5555ff555f55fffff5555555555
// 091:5555555555555555555555555555555555555555555555555555555555555555
// 092:5555555555555555555555555555555555555555555555555555555555555555
// 093:5555555555555555555555555555555555555555555555555555555555555555
// 094:5555555555555555555555555555555555555555555555555555555555555555
// 095:5555555555555555555555555555555555555555555555555555555555555555
// 096:5555555555555555555555555555555555555555555555555555555555555555
// 097:5555555555555555555555555555555555555555555555555555555555555555
// 098:5555555555555555555555555555555555555555555555555555555555555555
// 099:5555555555555555555555555555555555555555555555555555555555555555
// 100:5555555555555555555555555555555555555555555555555555555555555555
// 101:5555555555555555555555555555555555555555555555555555555555555555
// 102:5555555555555555555555555555555555555555555555555555555555555555
// 103:5555555555555555555555555555555555555555555555555555555555555555
// 104:5555555555555555555555555555555555555555555555555555555555555555
// 105:5555555555555555555555555555555555555555555555555555555555555555
// 106:5555555555555555555555555555555555555555555555555555555555555555
// 107:5555555555555555555555555555555555555555555555555555555555555555
// 108:5555555555555555555555555555555555555555555555555555555555555555
// 109:5555555555555555555555555555555555555555555555555555555555555555
// 110:5555555555555555555555555555555555555555555555555555555555555555
// 111:5555555555555555555555555555555555555555555555555555555555555555
// 112:5555555555555555555555555555555555555555555555555555555555555555
// 113:5555555555555555555555555555555555555555555555555555555555555555
// 114:5555555555555555555555555555555555555555555555555555555555555555
// 115:5555555555555555555555555555555555555555555555555555555555555555
// 116:5555555555555555555555555555555555555555555555555555555555555555
// 117:5555555555555555555555555555555555555555555555555555555555555555
// 118:5555555555555555555555555555555555555555555555555555555555555555
// 119:5555555555555555555555555555555555555555555555555555555555555555
// 120:5555555555555555555555555555555555555555555555555555555555555555
// 121:5555555555555555555555555555555555555555555555555555555555555555
// 122:5555555555555555555555555555555555555555555555555555555555555555
// 123:5555555555555555555555555555555555555555555555555555555555555555
// 124:5555555555555555555555555555555555555555555555555555555555555555
// 125:5555555555555555555555555555555555555555555555555555555555555555
// 126:5555555555555555555555555555555555555555555555555555555555555555
// 127:5555555555555555555555555555555555555555555555555555555555555555
// </SPRITES>

// <MAP>
// 001:a0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 002:708080808080808080808080808080808080808080808090009100810071000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// </MAP>

// <WAVES>
// 000:00000000ffffffff00000000ffffffff
// 001:0123456789abcdeffedcba9876543210
// 002:0123456789abcdef0123456789abcdef
// </WAVES>

// <SFX>
// 000:030803080308030803080308230053019302a301b301c300e300e300f300f300f300f300f300f300f300f300f300f300f300f300f300f300f300f300307000000000
// 001:000100020002400f500d900fa000b000d001e001f001f000f000f000f000f000f000f000f000f000f000f000f000f000f000f000f000f000f000f000310000000000
// </SFX>

// <PALETTE>
// 000:140c1c44243430346d4e4a4e854c30346524d04648757161597dced27d2c8595a16daa2cd2aa996dc2cadad45edeeed6
// </PALETTE>

