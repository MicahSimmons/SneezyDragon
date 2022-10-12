class Skybox extends BasicObject {
    create () {
      super.create();
      this.graphics = this.scene.add.graphics();
      this.graphics.fillGradientStyle(0x2A42C9, 0x2A42C9, 0x8194FD, 0x8194FD, 1);
      this.graphics.fillRect(0, 0, 800, 600);
      this.graphics.setDepth(-1);
      this.graphics.setScrollFactor(0,0);

    }
  }