Penult.Soi.Shield = function (game, instance) {
  this.game = game;
  this.instance = instance;
  this.health = 0;
}

Penult.Soi.Shield.prototype = {};

Penult.Soi.Shield.prototype.create = function(game, shield) {
	  game.shieldSprite = 	game.add.sprite(0,0);
	  var health = 			Math.floor(shield)+"%";
	  var style = 			{ font: "15px Arial", fill: "#FFF", align: "center" };
	  
	  game.shieldSprite.fixedToCamera = true;
	  health = game.add.text(0,0,health,style);
	  game.shieldSprite.addChild(health);  
	  game.shieldSprite.cameraOffset.x = 80;
	  game.shieldSprite.cameraOffset.y = 10;
}

Penult.Soi.Shield.prototype.out = function(){
}

Penult.Soi.Shield.prototype.update = function (that, int, reset) {
	if(!reset)
		that.shield = that.shield + int;
	else
		that.shield = int;
	
	if(that.shield <= 0){
		alert('You died!');
	}else{
		that.game.shieldSprite.kill();
		Penult.Soi.Shield.prototype.create(that.game, that.shield);
	}

};