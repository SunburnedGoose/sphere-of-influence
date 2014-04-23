Penult.Soi.Shield = function (game, instance) {
  this.game = game;
  this.instance = instance;
  this.health = 0;
  this.shieldSprite = undefined;
}

Penult.Soi.Shield.prototype = {};

Penult.Soi.Shield.prototype.create = function(shield) {
	  this.shieldSprite = 	this.game.add.sprite(0,0);
	  var health = 			shield+"%";
	  var style = 			{ font: "15px Arial", fill: "#FFF", align: "center" };
	  
	  this.shieldSprite.fixedToCamera = true;
	  health = this.game.add.text(0,0,health,style);
	  this.shieldSprite.addChild(health);  
	  this.shieldSprite.cameraOffset.x = 80;
	  this.shieldSprite.cameraOffset.y = 10;
}

Penult.Soi.Shield.prototype.out = function(){
}

Penult.Soi.Shield.prototype.update = function (that, int, reset) {
	if(!reset)
		that.shield = that.shield + int;
	else
		that.shield = int;

};