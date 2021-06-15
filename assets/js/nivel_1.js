class Nivel_1 extends Phaser.Scene {

  constructor () {
    super('nivel_1');
  }

  preload () {

    // se cargan las imágenes
    this.load.image('cielo', 'assets/images/cielo.png');
    this.load.image('jugador', 'assets/images/jugador.png');
    this.load.image('plataforma', 'assets/images/plataforma.png');
    this.load.image('pared_invisible_horizontal', 'assets/images/pared_invisible_horizontal.png');
    this.load.image('pared_invisible_vertical', 'assets/images/pared_invisible_vertical.png');

    this.load.image('tile_montania', 'assets/images/tile_montania.png');
    this.load.image('tile_montania_2', 'assets/images/tile_montania_2.png');
    this.load.image('tile_montania_3', 'assets/images/tile_montania_3.png');
    this.load.image('tile_suelo_montania', 'assets/images/tile_suelo_montania.png');
    this.load.image('tile_superficie_suelo_montania', 'assets/images/tile_superficie_suelo_montania.png');
    this.load.image('tile_superficie_rompible', 'assets/images/tile_superficie_rompible.png');
    this.load.tilemapTiledJSON('level_1', 'assets/js/nivel_1.json');

  }

  create () {
    
    //  se crea la imagen de fondo y se repiten las veces que sea necesario para hacer el nivel largo
    let posicion_y = 0;
    for (let i = 0; i < 4; i++) {
      this.add.image(0, posicion_y, 'cielo').setOrigin(0);
      posicion_y += 896;
    }
    
    const map = this.make.tilemap({key: 'level_1'});
    const tileset_montania_1 = map.addTilesetImage('tile_montania','tile_montania');
    const tileset_montania_2 = map.addTilesetImage('tile_montania_2','tile_montania_3');
    const tileset_montania_3 = map.addTilesetImage('tile_montania_3','tile_montania_3');

    const costados = [tileset_montania_1, tileset_montania_2, tileset_montania_3];

    const tileset_suelo_montania = map.addTilesetImage('tile_suelo_montania','tile_suelo_montania');
    const tileset_superficie_suelo_montania = map.addTilesetImage('tile_superficie_suelo_montania','tile_superficie_suelo_montania');
    const tileset_superficie_rompible = map.addTilesetImage('tile_superficie_rompible','tile_superficie_rompible');

    const plataformas = [tileset_suelo_montania, tileset_superficie_suelo_montania, tileset_superficie_rompible];

    const plataforma_hecha = map.createLayer('plataformas', plataformas, 0, 0);
    const costado_hecho = map.createLayer('costados', costados, 0, 0);

    plataforma_hecha.setCollisionByProperty({collides:true});
    costado_hecho.setCollisionByProperty({collides:true});

    // const debugGraphics = this.add.graphics().setAlpha(0.7);
    // plataforma_hecha.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    // })
    // costado_hecho.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    // })
    
    //  se crea la cámara que seguirá al jugador
    camara = this.cameras.main;
    this.cameras.main.setBounds(0, 0, 504, 3584);

    //  se crean bordes de mapa invisibles para que el jugador no salga fuera de la zona de juego
    bordes_mapa = this.physics.add.staticGroup();

    bordes_mapa.create(252, 0, 'pared_invisible_horizontal');
    bordes_mapa.create(252, 3584, 'pared_invisible_horizontal');

    posicion_y = 448;
    for (let i = 0; i < 4; i++) {
      bordes_mapa.create(0, posicion_y, 'pared_invisible_vertical');
      bordes_mapa.create(504, posicion_y, 'pared_invisible_vertical');
      posicion_y += 896;
    }

    //  se crean las plataformas
    // plataformas = this.physics.add.staticGroup();

    // plataformas.create(100, 250, 'plataforma');
    // plataformas.create(300, 500, 'plataforma');
    // plataformas.create(400, 750, 'plataforma');
    // plataformas.create(200, 1000, 'plataforma');

    // se crea al jugador
    jugador = this.physics.add.sprite(75, 200, 'jugador').setScale(1.75);
    jugador.setCollideWorldBounds(false);

    // se añaden eventos para presionar teclas del teclado
    if (cursores =! undefined){
        cursores = this.input.keyboard.createCursorKeys();
    }

    //this.physics.add.collider(jugador, plataformas);
    this.physics.add.collider(jugador, bordes_mapa);
    this.physics.add.collider(jugador, plataforma_hecha);
    this.physics.add.collider(jugador, costado_hecho);

  }

  update (time, delta) {
    
    //  la cámara sigue al jugador si solo está bajando
    // if(posicion_y_salto <= jugador.y){
    //   camara.centerOn(0,jugador.y + 168);
    // }

    camara.centerOn(0,jugador.y + 168);

    if (cursores.left.isDown)
    {
      jugador.setVelocityX(-250);
    }
    else{
      if(cursores.right.isDown){
        jugador.setVelocityX(250);
      }
      else{
        jugador.setVelocityX(0);
      }
    }

    if (cursores.up.isDown && jugador.body.onFloor()) {
      posicion_y_salto = jugador.y;
      jugador.setVelocityY(-400);
    }

  }

}