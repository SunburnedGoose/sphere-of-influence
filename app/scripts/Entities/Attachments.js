'use strict';

namespace('Soi.Entities');

Soi.Entities.Attachments = function (game) {
  Phaser.Group.call(this, game);

};

Soi.Entities.Attachments.prototype = Object.create(Phaser.Group.prototype);
Soi.Entities.Attachments.prototype.constructor = Soi.Entities.Attachments;

Soi.Entities.Attachments.prototype.update = function () {
	var label = this.game.instance.currentLang.attachments+': ';
	var style = {
		'font': '15px Arial',
		'fill': '#FFF',
		'align': 'center'
	};

	this.fixedToCamera = true;
	this.cameraOffset.x = 10;
	this.cameraOffset.y = 30;

	if(this.textSprite){
		this.textSprite.setText(label);
	}else{
		this.textSprite = this.game.add.text(0, 0, label, style);
		this.addChild(this.textSprite);
	}
};