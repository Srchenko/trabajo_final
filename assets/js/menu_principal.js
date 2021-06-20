class Menu_Principal extends Phaser.Scene {

  constructor () {
    super('menu_principal');
  }

  preload () {
    //  se cargan las imágenes
    this.load.image('cielo', 'assets/images/cielo.png');
    this.load.image('pared_invisible_horizontal', 'assets/images/pared_invisible_horizontal.png');
    this.load.image('tile_montania', 'assets/images/tile_montania.png');
    this.load.image('tile_montania_2', 'assets/images/tile_montania_2.png');
    this.load.image('tile_montania_3', 'assets/images/tile_montania_3.png');
    this.load.image('tile_suelo_montania', 'assets/images/tile_suelo_montania.png');
    this.load.image('tile_superficie_suelo_montania', 'assets/images/tile_superficie_suelo_montania.png');
    this.load.image('tile_superficie_rompible_1', 'assets/images/tile_superficie_rompible_1.png');
    this.load.image('tile_superficie_rompible_2', 'assets/images/tile_superficie_rompible_2.png');
    this.load.image('tile_superficie_rompible_3', 'assets/images/tile_superficie_rompible_3.png');
    this.load.image('tile_superficie_rompible_4', 'assets/images/tile_superficie_rompible_4.png');

    this.load.image('bala', 'assets/images/bala.png');
    this.load.image('base_final', 'assets/images/base_final.png');
    this.load.image('bandera_argentina', 'assets/images/bandera_argentina.png');
    this.load.image('item_1', 'assets/images/item_1.png')
    this.load.image('item_2', 'assets/images/item_2.png')

    this.load.image('fondo_hud', 'assets/images/fondo_hud.png');

    //  se cargan los spritesheets
    this.load.spritesheet('jugador_movimiento', 'assets/images/jugador_movimiento.png', { frameWidth: 26, frameHeight: 48});
    this.load.spritesheet('dron_animacion', 'assets/images/dron_animacion.png', { frameWidth: 64, frameHeight: 56});

    //  se carga los tiles de un tilemap
    this.load.tilemapTiledJSON('level_1', 'assets/js/nivel_1.json');
  }

  create (){
    //  se cargan animaciones del jugador y de los enemigos
    this.anims.create({
      key: 'derecha',
      frames: this.anims.generateFrameNumbers('jugador_movimiento', { start: 0, end: 9 }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'izquierda',
      frames: this.anims.generateFrameNumbers('jugador_movimiento', { start: 10, end: 19 }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: 'derecha_aire',
      frames: [ { key: 'jugador_movimiento', frame: 22} ],
      frameRate: 12
    });

    this.anims.create({
      key: 'izquierda_aire',
      frames: [ { key: 'jugador_movimiento', frame: 23} ],
      frameRate: 12
    });

    this.anims.create({
      key: 'derecha_suelo',
      frames: [ { key: 'jugador_movimiento', frame: 20} ],
      frameRate: 12
    });

    this.anims.create({
      key: 'izquierda_suelo',
      frames: [ { key: 'jugador_movimiento', frame: 21} ],
      frameRate: 12
    });

    this.anims.create({
      key: 'dron_movimiento',
      frames: this.anims.generateFrameNumbers('dron_animacion', { start: 0, end: 1 }),
      frameRate: 12,
      repeat: -1
    });

    this.scene.start('nivel_1');
  }

}