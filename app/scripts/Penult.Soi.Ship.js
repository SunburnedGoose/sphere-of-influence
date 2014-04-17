Penult.Soi.Ship = function (game, instance) {
  this.game = game;
  this.instance = instance;
  this.sprite;
  this.rotationSpeed = 10;
  this.thrusting = false;
  this.center;
  this.inSoi = false;
  this.__tweeningCameraToShip = false;
};

Penult.Soi.Ship.prototype = {};

Penult.Soi.Ship.prototype.create = function (position, texture) {
  this.sprite = this.game.add.sprite(position.x, position.y, texture);

  this.game.physics.p2.enable([this.sprite]);

  this.sprite.scale.setTo(0.25, 0.25);
  this.sprite.animations.add('forward',[1,2,3,4,5,6],6,true);
  this.sprite.animations.add('reverse',[7,8,9,10,11,12],6,true);
  this.sprite.animations.add('unpowered',[0],0,false);
  this.sprite.animations.play('unpowered');

  this.game.input.onDown.add(Penult.Soi.Ship.prototype.changeVector);
  this.game.input.onHold.add(Penult.Soi.Ship.prototype.changeVector);
};

Penult.Soi.Ship.prototype.changeVector = function(a) {
  //ship.body.velocity.x = ship.body.velocity.y = 0;
  var x1 = 400;
  var y1 = 300;
  var x2 = a.position.x;
  var y2 = a.position.y;

  var deltaX = x2 - x1;
  var deltaY = y2 - y1;

  var degrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI + 90;

  var rotation = Phaser.Math.degToRad(degrees);

  this.sprite.body.rotation = rotation;
  this.instance.update();
}

Penult.Soi.Ship.prototype.update = function () {
  var that = this;

  this.thrusting = false;

  if (this.instance.cursors.left.isDown || this.instance.leftKey.isDown)
  {
      this.sprite.body.rotateLeft(this.rotationSpeed * 10);
  }
  else if (this.instance.cursors.right.isDown || this.instance.rightKey.isDown)
  {
      this.sprite.body.rotateRight(this.rotationSpeed * 10);
  }
  else
  {
      this.sprite.body.setZeroRotation();
  }

  if (this.instance.cursors.up.isDown || this.instance.upKey.isDown || this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown)
  {
      this.sprite.body.thrust(this.rotationSpeed * 8);
      this.sprite.animations.play('forward');
      this.thrusting = true;
  }
  else if (this.instance.cursors.down.isDown || this.instance.downKey.isDown)
  {
      this.sprite.body.reverse(this.rotationSpeed * 2);
      this.thrusting = true;
      this.sprite.animations.play('reverse');
  }

  if (!this.thrusting) {
    this.sprite.animations.play('unpowered');
  }

  soi.state.thrusting = this.thrusting;

  that.center = getCenterPoint(that.sprite);

  _.forEach(that.instance.heavenlyBodies, function(body) {
    // if (well.sprite.inCamera) {
    //   var distanceFromSurface = that.game.physics.arcade.distanceBetween(that.center, well.center) - well.radius;

    //   if (distanceFromSurface > 0 && distanceFromSurface < well.diameter) {
    //     that.inSoi = true;
    //   }
    // }

    if (that.inSoi) {
      var sCenter = getCenterPoint(that.sprite);
      var pCenter = getCenterPoint(body.gravityWell.sprite);

      if (that.game.camera.target) {
        that.game.camera.follow(null);
        that.game.add.tween(that.game.camera).to( {x: pCenter.x - (that.game.camera.width / 2), y: pCenter.y - (that.game.camera.height / 2) }, 750, Phaser.Easing.Quadratic.InOut, true);
      }

      var xQuad = (that.center.x < body.gravityWell.center.x) ? -1 : 1;
      var yQuad = (that.center.y < body.gravityWell.center.y) ? -1 : 1;
      var distanceFromSurface = game.physics.arcade.distanceBetween(getCenterPoint(that.sprite), getCenterPoint(body.gravityWell.sprite));
      var force = body.gravityWell.accelleration * Math.abs((body.gravityWell.diameter - distanceFromSurface) / body.gravityWell.diameter);
      //that.sprite.body.data.applyForce([force * xQuad, force * yQuad], new Phaser.Point(1022,1022));
      that.sprite.body.data.applyForce([force * xQuad, force * yQuad], that.center);
      that.sprite.body.angularForce = 0;
    } else {
      if (!that.__tweeningCameraToShip && !that.game.camera.target) {
        that.__tweeningCameraToShip = true;
        var sCenter = getCenterPoint(that.sprite);
        var tween = that.game.add.tween(that.game.camera).to( {x: sCenter.x - (that.game.camera.width / 2), y: sCenter.y - (that.game.camera.height / 2) }, 250, Phaser.Easing.Quadratic.InOut, true);
        tween._lastChild.onComplete.add(function() {
          that.game.camera.follow(that.sprite);
          that.__tweeningCameraToShip = false;
        }, that);
      }

      if (!that.instance.state.thrusting) {
        if (Math.abs(that.sprite.body.velocity.x) < 0.2) {
          that.sprite.body.velocity.x = 0;
        }
        if (Math.abs(that.sprite.body.velocity.y) < 0.2) {
          that.sprite.body.velocity.y = 0;
        }
      }
    }
  });
};