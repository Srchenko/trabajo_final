class Nivel_1 extends Phaser.Scene {

  constructor () {
    super('nivel_1');
  }

  preload () {

    //  se cargan las imágenes
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
    this.load.image('bala', 'assets/images/bala.png');

    //  se cargan los spritesheets
    this.load.spritesheet('jugador_derecha', 'assets/images/jugador_derecha.png', { frameWidth: 26, frameHeight: 48});

    //  se carga los tiles de un tilemap
    this.load.tilemapTiledJSON('level_1', 'assets/js/nivel_1.json');

  }

  create () {

    this.anims.create({
      key: 'derecha',
      frames: this.anims.generateFrameNumbers('jugador_derecha', { start: 0, end: 9 }),
      frameRate: 12,
      repeat: -1
    });
    
    //  se crea la imagen de fondo y se repiten las veces que sea necesario para hacer el nivel largo
    let posicion_y = 0;
    for (let i = 0; i < 4; i++) {
      this.add.image(0, posicion_y, 'cielo').setOrigin(0);
      posicion_y += 896;
    }
    
    //  acá se crean las plataformas que se pueden romper con disparos
    plataformas_rompibles = this.physics.add.group();
    let indice_plataforma = 0;
    let plataforma_rompible_hijo;

    for (let index = 24; index < 24 + (64 * 7); index += 64) {
      plataformas_rompibles.create(index, 1040, 'tile_superficie_rompible').setOrigin(0);
      plataforma_rompible_hijo = plataformas_rompibles.getChildren()[indice_plataforma];
      plataforma_rompible_hijo.body.immovable = true;
      plataforma_rompible_hijo.body.moves = false;
      indice_plataforma++;
    }

    //  se crea el mapa restante utilizando tiles
    let mapa = this.make.tilemap({key: 'level_1'});
    const tileset_montania_1 = mapa.addTilesetImage('tile_montania','tile_montania');
    const tileset_montania_2 = mapa.addTilesetImage('tile_montania_2','tile_montania_3');
    const tileset_montania_3 = mapa.addTilesetImage('tile_montania_3','tile_montania_3');

    const costados = [tileset_montania_1, tileset_montania_2, tileset_montania_3];

    const tileset_suelo_montania = mapa.addTilesetImage('tile_suelo_montania','tile_suelo_montania');
    const tileset_superficie_suelo_montania = mapa.addTilesetImage('tile_superficie_suelo_montania','tile_superficie_suelo_montania');

    const plataformas = [tileset_suelo_montania, tileset_superficie_suelo_montania];

    const plataforma_hecha = mapa.createLayer('plataformas', plataformas, 0, 0);
    const costado_hecho = mapa.createLayer('costados', costados, 0, 0);
    plataforma_hecha.setCollisionByProperty({collides:true});
    costado_hecho.setCollisionByProperty({collides:true});

    // const debugGraphics = this.add.graphics().setAlpha(0.7);
    // plataforma_hecha.renderDebug(debugGraphics, {
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

    //  se crea al jugador
    jugador = this.physics.add.sprite(75, 200, 'jugador').setScale(1);
    jugador.setCollideWorldBounds(false);

    //  se añaden eventos para presionar teclas del teclado
    if (cursores =! undefined){
        cursores = this.input.keyboard.createCursorKeys();
    }

    //  se agrega la clase bala general con sus atributos y funciones
    Bala = new Phaser.Class({

      Extends: Phaser.Physics.Arcade.Sprite,

      initialize:

      //  constructor de bala
      function Bala (scene)
      {
          Phaser.Physics.Arcade.Sprite.call(this, scene, 0, 0, 'bala');

          scene.add.existing(this);
          scene.physics.add.existing(this);
      },

      //  cada vez que se dispara una bala
      disparo: function (x, y)
      {
          this.setPosition(x, y + 25);
          this.setVelocityY(jugador.body.velocity.y + 800);
          this.setSize(9, 16, true);

          this.setActive(true);
          this.setVisible(true);
      },

    });

    //  se hace un conjunto de balas
    balas = this.add.group({
      classType: Bala,
      runChildUpdate: true
    });

    //  se agregan todas las colisiones
    let plataformas_no_rompibles = [plataforma_hecha, costado_hecho];

    this.physics.add.collider(jugador, bordes_mapa);
    this.physics.add.collider(balas, bordes_mapa, this.desaparecerBala, null, this);
    this.physics.add.collider(balas, plataformas_no_rompibles, this.desaparecerBala, null, this);
    this.physics.add.collider(balas, plataformas_rompibles, this.desaparecerBalaConPlataforma, null, this);
    this.physics.add.collider(jugador, plataformas_no_rompibles);
    this.physics.add.collider(jugador, plataformas_rompibles);

    window.focus();
  }

  update (time, delta) {
    
    //  la camara siempre sigue al jugador en el eje vertical a cierta altura
    camara.centerOn(0,jugador.y + 168);

    //  movimiento de personaje, izquierda, derecha y arriba
    if (cursores.left.isDown)
    {
      jugador.setVelocityX(-250);
    }
    else{
      if(cursores.right.isDown){
        jugador.anims.play('derecha', true);
        jugador.setVelocityX(250);
      }
      else{
        jugador.setVelocityX(0);
      }
    }

    //  el personaje salta cuando está tocando el suelo
    if (cursores.up.isDown && jugador.body.onFloor()) {
      jugador.setVelocityY(-400);
    }

    //  el personaje dispara cuando está en el aire
    if (cursores.space.isDown && !jugador.body.onFloor() && time > ultimo_disparo)
    {
      var balita = balas.get();

      this.children.bringToTop(balita);
      this.children.bringToTop(jugador);

      if (balita)
      {
        balita.disparo(jugador.x, jugador.y);

        ultimo_disparo = time + 500;
      }
    }

  }

  desaparecerBala(bala, plataforma){

    bala.destroy();

  }

  desaparecerBalaConPlataforma(bala, plataforma){

    bala.destroy();
    plataforma.destroy();

  }

}