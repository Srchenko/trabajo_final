class Nivel_1 extends Phaser.Scene {

  constructor () {
    super('nivel_1');
  }

  create () {
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
    let indice_y = 1128;

    for (let indice = 0; indice < 3; indice++) {
      for (let index = 28; index < 28 + (64 * 7); index += 64) {
        plataformas_rompibles.create(index, indice_y, 'tile_superficie_rompible_' + Phaser.Math.Between(1,4)).setOrigin(0);
        plataforma_rompible_hijo = plataformas_rompibles.getChildren()[indice_plataforma];
        plataforma_rompible_hijo.body.immovable = true;
        plataforma_rompible_hijo.body.moves = false;
        indice_plataforma++;
      }
      indice_y += 64;
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

    //  se crean bordes de mapa invisibles para que el jugador no salga fuera de la zona de juego
    bordes_mapa = this.physics.add.staticGroup();

    bordes_mapa.create(252, 0, 'pared_invisible_horizontal');
    bordes_mapa.create(252, 3584, 'pared_invisible_horizontal');

    //  se crea al jugador
    jugador = this.physics.add.sprite(75, 200, 'jugador_movimiento');
    jugador.setSize(18, 48, true);
    animacion_jugador_suelo = 'derecha_suelo';
    animacion_jugador_aire = 'derecha_aire';
    jugador.setCollideWorldBounds(false);

    dron = this.physics.add.sprite(445, 950, 'dron_animacion');
    dron.body.immovable = true;
    dron.body.moves = false;
    dron.setCollideWorldBounds(false);
    dron.anims.play('dron_movimiento', true);

    //  se crea la cámara que seguirá al jugador
    this.cameras.main.setBounds(0, 0, 504, 3584);
    camara = this.cameras.main;

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
          this.setPosition(x, y + 20);
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
    plataformas_no_rompibles = [plataforma_hecha, costado_hecho];

    //game.physics.enable(plataformas_no_rompibles, Phaser.Physics.ARCADE);
    
    this.physics.add.collider(balas, bordes_mapa, this.desaparecerBala, null, this);
    this.physics.add.collider(balas, plataformas_no_rompibles, this.desaparecerBala, null, this);
    this.physics.add.collider(balas, plataformas_rompibles, this.desaparecerBalaConPlataforma, null, this);
    this.physics.add.collider(jugador, bordes_mapa);
    this.physics.add.collider(jugador, plataformas_no_rompibles);
    this.physics.add.collider(jugador, plataformas_rompibles);

    window.focus();
  }

  update (time, delta) {
    //  la camara siempre sigue al jugador en el eje vertical a cierta altura
    camara.centerOn(0,jugador.y + 168);

    //  movimiento de personaje, izquierda, derecha, parado y salto

    if (cursores.left.isDown && jugador.body.onFloor()){
      jugador.anims.play('izquierda', true);
      animacion_jugador_suelo = 'izquierda_suelo';
      animacion_jugador_aire = 'izquierda_aire';
      jugador.setVelocityX(-250);
    }
    else{
      if(cursores.left.isDown && !jugador.body.onFloor()){
        jugador.anims.play('izquierda_aire', true);
        animacion_jugador_suelo = 'izquierda_suelo';
        animacion_jugador_aire = 'izquierda_aire';
        jugador.setVelocityX(-250);
      }
      else{
        if(cursores.right.isDown && jugador.body.onFloor()){
          jugador.anims.play('derecha', true);
          animacion_jugador_suelo = 'derecha_suelo';
          animacion_jugador_aire = 'derecha_aire';
          jugador.setVelocityX(250);
        }
        else{
          if(cursores.right.isDown && !jugador.body.onFloor()){
            jugador.anims.play('derecha_aire', true);
            animacion_jugador_suelo = 'derecha_suelo';
            animacion_jugador_aire = 'derecha_aire';
            jugador.setVelocityX(250);
          }
          else{
            if(!jugador.body.onFloor()){
              jugador.anims.play(animacion_jugador_aire, true);
              jugador.setVelocityX(0);
            }
            else{
              jugador.anims.play(animacion_jugador_suelo, true);
              jugador.setVelocityX(0);
            }
          }
        }
      }
    }

    jugador.setSize(18, 48, true);

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