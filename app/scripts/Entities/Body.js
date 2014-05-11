'use strict';

namespace('Soi.Entities');

Soi.Entities.Body = function(game, x, y, texture) {
  Phaser.Sprite.call(this, game, x, y, texture);

  this.game.world.add(this);
  this.game.physics.p2.enable([this], true);

  this.scale.setTo(0.2, 0.2);
  this.anchor.setTo(0.5,0.5);

  this.gravityWellGroup = this.game.add.group(this);

  this.gravityWellGroup.enableBody = true;
  this.gravityWellGroup.physicsBodyType = Phaser.Physics.P2JS;

  this.body.clearShapes();
  this.body.setCircle(this.width / 2);

  this.gravityWell = this.gravityWellGroup.create(0,0,'gravityWell');
  this.gravityWell.alpha = 0.6;
  this.gravityWell.scale.setTo(11.0, 11.0);

  this.physicalBody = this.gravityWellGroup.create(0,0,'planetoid');

  this.gravityWellGroup.add(this.gravityWell);
  this.gravityWellGroup.add(this.physicalBody);

  this.gravityWell.body.clearShapes();
  this.physicalBody.body.clearShapes();

  var gwCircle = this.gravityWell.body.addCircle(0, 0, this.gravityWell.width / 2);

  gwCircle.sensor = true;
};

Soi.Entities.Body.prototype = Object.create(Phaser.Sprite.prototype);
Soi.Entities.Body.prototype.constructor = Soi.Entities.Body;

Soi.Entities.Body.prototype.update = function() {
  this.gravityWell.update();
  this.physicalBody.update();
};

Soi.Entities.Body.prototype.overlay = function() {
};

Object.defineProperty(Soi.Entities.Body.prototype, 'radius', {
  get: function() {
    return this.width / 2;
  },
  set: function(value) {
    this.width = value * 2;
    this.height = this.width;
  }
});

Object.defineProperty(Soi.Entities.Body.prototype, 'diameter', {
  get: function() {
    return this.width;
  },
  set: function(value) {
    this.width = value;
    this.height = this.width;
  }
});

Object.defineProperty(Soi.Entities.Body.prototype, 'center', {
  get: function() {
    if (this) {
      if (this.body) {
        return new Phaser.Point(this.x, this.y);
      } else {
        return new Phaser.Point(this.x + (this.width / 2), this.y + (this.height / 2));
      }
    } else {
      return new Phaser.Point(this.x, this.y);
    }
  },
  set: function(value) {
    if (this.body) {
      this.x = value.x;
      this.y = value.y;
    } else {
      this.x = value.x - (this.width / 2);
      this.y = value.y - (this.height / 2);
    }
  }
});



// SoiIntermediate.HeavenlyBody = function (game, instance) {
//   this.game = game;
//   this.instance = instance;
//   this = undefined;
//   this.radius = undefined;
//   this.diameter = undefined;
//   this.center = undefined;
//   this.hasGravityWell = false;
//   this.gravityWell = undefined;
//   this.gravity = 10;
//   this.mass = 1000;
// };

// SoiIntermediate.HeavenlyBody.prototype = {};

// SoiIntermediate.HeavenlyBody.prototype.create = function(position, texture, hasGravityWell) {
//   this = this.game.add.sprite(position.x, position.y, texture);
//   this.scale.setTo(0.2, 0.2);
//   this.diameter = this.width;
//   this.radius = this.diameter / 2;

//   //this.game.physics.p2.enable([this]);
//   //this.body.static = true;

//   if (hasGravityWell) {
//     this.hasGravityWell = hasGravityWell;
//     this.gravityWell = new SoiIntermediate.GravityWell(this.game, this.instance);
//     var hbCenter = this.instance.Utilities.getCenterPoint(this);
//     var gwPosition = new Phaser.Point(hbCenter.x, hbCenter.y);

//     this.gravityWell.create(gwPosition, 'gravityWell', this.diameter * 3);

//     this.bringToTop();
//   }
// };

// SoiIntermediate.HeavenlyBody.prototype.update = function () {
//   var that = this;

//   this.gravityWell.update();

//   if (!that.center) {
//     that.center = this.instance.Utilities.getCenterPoint(that.sprite);
//   }
// };
