'use strict';

namespace('Soi.Entities');

Soi.Entities.Shield = function (game) {
  Phaser.Sprite.call(this, game, 0, 0);

  this.game.world.add(this);

  this.strength = 0;
  this.textSprite = null;
};

Soi.Entities.Shield.prototype = Object.create(Phaser.Sprite.prototype);
Soi.Entities.Shield.prototype.constructor = Soi.Entities.Shield;

Soi.Entities.Shield.prototype.update = function () {
  var label = 'Shields: ' + Math.floor(this.strength) + '%';
  var style = {
    'font': '15px Arial',
    'fill': '#FFF',
    'align': 'center'
  };

  this.fixedToCamera = true;
  this.cameraOffset.x = 80;
  this.cameraOffset.y = 10;

  if (this.textSprite) {
    this.textSprite.setText(label);
  } else {
    this.textSprite = this.game.add.text(0, 0, label, style);
    this.addChild(this.textSprite);
  }
};