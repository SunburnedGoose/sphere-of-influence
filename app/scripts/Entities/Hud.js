'use strict';

namespace('Soi.Entities');

Soi.Entities.Hud = function (game) {
  Phaser.Group.call(this, game);

};

Soi.Entities.Hud.prototype = Object.create(Phaser.Group.prototype);
Soi.Entities.Hud.prototype.constructor = Soi.Entities.Hud;

Soi.Entities.Hud.prototype.update = function () {
};