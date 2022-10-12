


class SceneOpening extends Phaser.Scene {
  constructor () {
    let key = "SceneOpening";
    super(key);
    this.key = key;
    this.init = this.init.bind(this);
    this.preload = this.preload.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
  }

  init () {
    this.help_counter = 0;
    this.help_text = [
      "Dragons hate spring.",
      "Stanley has a cloud and tree allergy.",
      "Click the Mouse to Fly.",
      "Dragon Sneezes are Highly Explosive.",
      "Find Snacks.",
      "Hide in the Cave."
    ]

    this.fire = new FireBreath(this);
    this.fire.setBig(true);
  }

  preload () {
    this.fire.preload();
  }

  create () {
    this.fire.create();
    this.title = this.add.text(400, 150, "Sneezy Dragon", {
      fontSize: '5rem',
      fill: '#FFEEAA',
      boundsAlignH: 'center',
      boundsAlignV: "middle"
    });
    this.title.setOrigin(0.5);

    this.info = this.add.text(400, 300, "Click to Begin", {
      fontSize: '2rem',
      fill: '#FFEEAA',
      boundsAlignH: 'center',
      boundsAlignV: "middle"
    });
    this.info.setOrigin(0.5);

    this.help = this.add.text(400, 550, "", {
      fontSize: '2rem',
      fill: '#FFEEAA',
      boundsAlignH: 'center',
      boundsAlignV: "middle"
    });
    this.help.setOrigin(0.5);

    this.input.on('pointerdown', (pointer) => {
      this.scene.start("SceneGame");
    });
  }

  update () {
    this.fire.update();
    this.help_counter++;
    this.help.text = this.help_text[ Math.floor(this.help_counter / 180 ) % this.help_text.length]

    if (this.help_counter % 15 == 0) {
      this.fire.spawn(800 * Math.random(), 600 * Math.random())
    }
  }
  
}