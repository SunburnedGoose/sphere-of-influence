'use strict';

namespace('Soi.Entities');

Soi.Entities.HUD = function (game) {
  Phaser.Group.call(this, game);
  
  this.shield =			new Soi.Entities.Shield(this.game);
  this.attachments =	new Soi.Entities.Attachments(this.game);
  this.buffs =			new Soi.Entities.Buffs(this.game);
};

Soi.Entities.HUD.prototype = Object.create(Phaser.Group.prototype);
Soi.Entities.HUD.prototype.constructor = Soi.Entities.HUD;

Soi.Entities.HUD.prototype.update = function () {
};