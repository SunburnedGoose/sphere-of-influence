'use strict';

namespace('Soi.Entities');

Soi.Entities.PhysicalBody = function(game, x, y, texture) {
  Phaser.Sprite.call(this, game, x, y, texture);
};

Soi.Entities.PhysicalBody.prototype = Object.create(Phaser.Sprite.prototype);
Soi.Entities.PhysicalBody.prototype.constructor = Soi.Entities.PhysicalBody;