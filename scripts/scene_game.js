
class CloudObj extends BasicObject {
  constructor (scene, x_pos, y_pos, cloud_type) {
    super(scene);
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.type = cloud_type;
    this.type_keys = ['cloud_one', 'cloud_two', 'cloud_three', 'cloud_four'];
    console.log(this.type);
  }

  preload () {
    this.scene.load.image('cloud_one', "./sprites/cloud_1.png");
    this.scene.load.image('cloud_two', "./sprites/cloud_2.png");
    this.scene.load.image('cloud_three', "./sprites/cloud_3.png");
    this.scene.load.image('cloud_four', "./sprites/cloud_4.png");

  }

  create () {
    this.cloud_grp = this.scene.physics.add.group();
    this.cloud = this.cloud_grp.create(this.x_pos, this.y_pos, this.type_keys[this.type]);
    this.cloud.setScale(0.2);
    this.cloud.body.setAllowGravity(false);
    this.cloud.setAlpha(0.75);
    this.cloud.setDepth(97);
    this.cloud.body.setSize(this.cloud.body.width * 0.7, this.cloud.body.height * 0.7);
  }
}

class GridLoader extends BasicObject {
  constructor ( scene ) {
    super(scene);
    this.getBounds = this.getBounds.bind(this);
  }

  preload () {
    this.scene.load.image('base_out', 'terrain/base_out_atlas.png');
    this.scene.load.image('build_atlas', 'terrain/build_atlas.png');
    this.scene.load.image('obj_misc', 'terrain/obj_misk_atlas.png');
    this.scene.load.image('terrain', 'terrain/terrain_atlas.png');

    this.scene.load.tilemapTiledJSON('map', 'terrain/level_one.json');

    let cloud = new CloudObj(this.scene, -500, 0, 1);
    cloud.preload();
  }

  create () {
    this.map = this.scene.make.tilemap({key: 'map'});
    this.tilesets = [
      this.map.addTilesetImage('base_out_atlas', 'base_out'),
      this.map.addTilesetImage('build_atlas', 'build_atlas'),
      this.map.addTilesetImage('obj_misc_atlas', 'obj_misc'),
      this.map.addTilesetImage('terrain_atlas', 'terrain')
    ];

    this.map_layers = [];
    this.map.layers.forEach( (layer) => {
      console.log(layer.name);   
      this.map_layers.push(this.map.createLayer(layer.name, this.tilesets, 0, 0));
    })

    this.map_layers.forEach( (tilemap_layer, index) => {
      tilemap_layer.setDepth(index+1);  
    });

    /* Check for cloud spawn points */
    this.clouds = [];
    this.map_layers.forEach( (tilemap_layer, index) => {
      if (tilemap_layer.layer.name == 'clouds') {          
        for (let x=0; x< this.map.width; x++) {
          for (let y=0; y< this.map.height; y++) {        
            let tile = tilemap_layer.getTileAt(x,y);
            if (tile != null) {
              console.log("Cloud at location (" + x*32 + "," + y*32 + ") : " + tile.index);
              let cloud = new CloudObj(this.scene, x*32, y*32, tile.index-1025);
              cloud.create();
              this.clouds.push(cloud)
            }
          }
        }
      }
    });
  }

  getBounds () {
    return { x: this.map.widthInPixels, y: this.map.heightInPixels };
  }

  
  setCollisions (sprite_obj, callback) {
    this.map_layers.forEach( (tilemap_layer, index) => {
      if (tilemap_layer.layer.name == 'collider') {
        console.log('Adding map collisions');
        tilemap_layer.setCollisionBetween(1, 0xFFFF);
        this.scene.physics.add.collider(sprite_obj, tilemap_layer, callback);
      }    
    });

    this.clouds.forEach( (cloud) => {
      this.scene.physics.add.overlap(sprite_obj, cloud.cloud, callback);
    });
  }

}



class SceneGame extends Phaser.Scene {
  constructor () {
    let key = "SceneGame";
    super(key);
    this.key = key;
 

    this.objects = {
      bgm: new BgmMidi(),
      skybox: new Skybox(this),
      grid: new GridLoader(this),
      avatar: new Avatar(this),
      fire: new FireBreath(this),
      hud: new GameHud(this)
    }

    this.init = this.init.bind(this);
    this.preload = this.preload.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
  }

  init () {
    Object.keys(this.objects).forEach( (key) => this.objects[key].init() );
    this.multiplier = 1.0;
    this.score = 0;
    this.time_remaining = 180.0;
    this.last_update = 0;
  }

  preload () {
    Object.keys(this.objects).forEach( (key) => this.objects[key].preload() );
  }

  create () {
    Object.keys(this.objects).forEach( (key) => this.objects[key].create() );
    this.objects.bgm.toggleBgm(true);
    let bounds = this.objects.grid.getBounds();
    this.physics.world.setBounds(0,0, bounds.x, bounds.y );
    this.cameras.main.setBounds(0, 0, bounds.x, bounds.y);

    this.objects.grid.setCollisions(this.objects.avatar.avatar, () => {
      console.log("hit!")
      this.objects.avatar.avatar.setVelocity(-200, -50);
      this.objects.fire.spawn(this.objects.avatar.avatar.x, this.objects.avatar.avatar.y);
      this.multiplier = 1.0;
    });

    this.last_update = this.now();
  }

  //return the number of milliseconds since 1 January 1970 00:00:00.
  now() {
    let d = new Date();    
    return d.getTime();
  }

  update () {
    Object.keys(this.objects).forEach( (key) => this.objects[key].update() );
    let delta_time = this.now() - this.last_update;

    //console.log("time:" + delta_time);
    this.time_remaining -= delta_time / 1000;
    this.last_update = this.now();

    this.multiplier += (delta_time / 1000) / 5;
    if (this.multiplier > 20) {
      this.multiplier = 20;
    }
    this.score += (this.objects.avatar.getXPos() / 16000.0) * this.multiplier * (delta_time / 100) ;
    this.objects.hud.text = "Score: " + Math.floor(this.score);
    this.objects.hud.time = "Time: " + Math.floor(this.time_remaining);

    if (this.objects.avatar.getXPos() > 16100) {
      this.objects.bgm.toggleBgm(false);
      this.game.model.score = this.score;
      this.game.model.time_remaining = this.time_remaining;
      this.scene.start("SceneClosing");
    }
    
    if (this.time_remaining <= 0) {
      this.objects.bgm.toggleBgm(false);
      this.game.model.score = this.score;
      this.game.model.time_remaining = 0.0;
      this.scene.start("SceneClosing");      
    }
  }
  
}