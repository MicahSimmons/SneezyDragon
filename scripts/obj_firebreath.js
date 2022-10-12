class FireBreath extends BasicObject {
    constructor (scene) {
      super(scene);
      this.spawn = this.spawn.bind(this);
      this.fx_throttle = 0;
      this.setBig = this.setBig.bind(this);
      this.isBig = false;
    }

    setBig (goBig) {
        this.isBig = goBig;
    }

    preload () {
      this.scene.load.spritesheet('fireball', "./sprites/Fireball.png", {
        frameWidth: 188,
        frameHeight: 108
      });

      this.scene.load.audio('sneeze', "./sprites/sneeze.m4a");
    }

    create () {
      this.fire_grp = this.scene.physics.add.group();

      this.scene.anims.create({
        key: 'fireball',
        frames: this.scene.anims.generateFrameNumbers('fireball', {start:0, end:27}),
        frameRate: 20,
        repeat: 0
      })

      this.fx = this.scene.sound.add('sneeze', {volume: 0.3});

    }

    update () {
      this.fire_grp.children.each( (fireball) => {
        fireball.setAlpha(fireball.alpha * 0.95);
        if (fireball.alpha < 0.01) {
          fireball.destroy(true);
        }
      });

      if (this.fx_throttle > 0) {
        this.fx_throttle--;
      }
    }

    spawn (x_pos, y_pos) {
      let fireball = this.fire_grp.create(x_pos, y_pos, 'fireball');
      fireball.body.setAllowGravity(false);
      fireball.setDepth(98);
      if (this.isBig) {
          fireball.setScale(3.0);
      }
      fireball.play('fireball')

      if ((this.fx_throttle == 0) && (this.isBig == false)) {
        this.fx_throttle = 60;
        this.fx.play();
      }
    }
  }
