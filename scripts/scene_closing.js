


class SceneClosing extends Phaser.Scene {
  constructor () {
    let key = "SceneClosing";
    super(key);
    this.key = key;
    this.init = this.init.bind(this);
    this.preload = this.preload.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
  }

  init () {
    this.debounce_time = 3.0;
    this.last_time = this.now();
  }

  preload () {

  }

  //return the number of milliseconds since 1 January 1970 00:00:00.
  now() {
    let d = new Date();    
    return d.getTime();
  }

  create () {
    this.title = this.add.text(400, 150, "You Win!!", {
      fontSize: '5rem',
      fill: '#FFEEAA',
      boundsAlignH: 'center',
      boundsAlignV: "middle"
    });
    this.title.setOrigin(0.5);
    if (this.game.model.time_remaining <= 0) {
      this.title.text = "Try Again!";
    } else {

      this.bonus = this.add.text(400, 260, "Time Bonus: 100 x " + Math.floor(this.game.model.time_remaining), {
        fontSize: '2rem',
        fill: '#FFEEAA',
        boundsAlignH: 'center',
        boundsAlignV: "middle"
      });
      this.bonus.setOrigin(0.5);
      this.game.model.score += Math.floor(this.game.model.time_remaining) * 100;
  
    }

    this.score = this.add.text(400, 300, "Final Score: " + Math.floor(this.game.model.score), {
      fontSize: '3rem',
      fill: '#FFEEAA',
      boundsAlignH: 'center',
      boundsAlignV: "middle"
    });
    this.score.setOrigin(0.5);


    this.info = this.add.text(400, 550, "", {
      fontSize: '2rem',
      fill: '#FFEEAA',
      boundsAlignH: 'center',
      boundsAlignV: "middle"
    });
    this.info.setOrigin(0.5);

    this.input.on('pointerdown', (pointer) => {
      if (this.debounce_time < 0) {
        this.scene.start("SceneOpening");
      }
    });
  }

  update () {
    let now = this.now();
    let delta_time = now - this.last_time;
    this.last_time = now;
    this.debounce_time -= (delta_time / 1000);
    if (this.debounce_time < 0) {
      this.info.text = "Click to Continue";
    }
  }
  
}