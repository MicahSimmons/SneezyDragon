class GameHud extends BasicObject {
    constructor (scene) {
      super(scene);
      this.text = "Score";
      this.time = "Time";
    }
  
    create () {
      this.info = this.scene.add.text(650, 50, this.text, {
        fontSize: '2rem',
        fill: '#FFEEAA',
        boundsAlignH: 'center',
        boundsAlignV: "middle"
      });
      this.info.setOrigin(0.5);
      this.info.setDepth(101);
      this.info.setScrollFactor(0,0);

      this.clock = this.scene.add.text(100, 50, this.time, {
        fontSize: '2rem',
        fill: '#FFEEAA',
        boundsAlignH: 'center',
        boundsAlignV: "middle"
      });
      this.clock.setOrigin(0.5);
      this.clock.setDepth(101);
      this.clock.setScrollFactor(0,0);

    }
  
    update () {
      this.info.text = this.text;
      this.clock.text = this.time;
    }
  }