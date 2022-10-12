class BasicObject {
  constructor (scene) {
    this.scene = scene;
    this.init = this.init.bind(this);
    this.preload = this.preload.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
  }

  init () { }
  preload () { }
  create () { }
  update () { }
}
