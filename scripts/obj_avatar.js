class Avatar {
    constructor (scene) {
      this.scene = scene;
      this.init = this.init.bind(this);
      this.preload = this.preload.bind(this);
      this.create = this.create.bind(this);
      this.update = this.update.bind(this);

      this.getXPos = this.getXPos.bind(this);
    }
  
    init () {
        this.fx_throttle = 0;
    }
  
    preload () {
      this.scene.load.spritesheet('dragon', "./sprites/dragon.png", {
        frameWidth: 939,
        frameHeight: 678
      });

      this.scene.load.audio('flap', './sprites/dragonflap.mp3');
    }
  
    create () {
      this.scene.anims.create({
        key: 'dragon',
        frames: this.scene.anims.generateFrameNumbers('dragon', {start:0, end:5}),
        frameRate: 10,
        repeat: 0
      })
      this.avatar_grp = this.scene.physics.add.group();
      this.avatar = this.avatar_grp.create(150, 300, 'dragon');
      this.avatar.setScale(0.1);
      this.avatar.setOrigin(0.5);
      this.avatar.setDepth(99);
      this.avatar.setCollideWorldBounds();
      this.scene.cameras.main.startFollow(this.avatar);
      this.avatar.setVelocity(120, 0);
  
      this.fx = this.scene.sound.add('flap', {volume: 1.0});

      this.scene.input.on('pointerdown', (pointer) => {
        console.log("flap");
        this.avatar.play('dragon');
        this.avatar.setVelocity(120, this.avatar.body.velocity.y-150);

        if (this.fx_throttle == 0) {
            this.fx.play();
            this.fx_throttle = 15;
        }
      });
    }
  
    update () {
      if (this.fx_throttle > 0) {
          this.fx_throttle--;
      }
    }

    getXPos () {
        let pos = this.avatar.getTopRight();
        return pos.x;
    }
  }