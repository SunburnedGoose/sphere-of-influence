'use strict';

namespace('Soi.Entities');

Soi.Entities.Buffs = function (game) {
  Phaser.Group.call(this, game);

};

Soi.Entities.Buffs.prototype = Object.create(Phaser.Group.prototype);
Soi.Entities.Buffs.prototype.constructor = Soi.Entities.Buffs;

Soi.Entities.Buffs.prototype.update = function () {
	var label = this.game.instance.currentLang.buffs+': ';
	var style = {
    	'font': '15px Arial',
    	'fill': '#FFF',
    	'align': 'center'
  	};

	this.fixedToCamera = true;
	this.cameraOffset.x = 10;
	this.cameraOffset.y = 50;

	if(this.textSprite){
		this.textSprite.setText(label);
	}else{
		this.textSprite = this.game.add.text(0, 0, label, style);
		this.addChild(this.textSprite);
	}
};