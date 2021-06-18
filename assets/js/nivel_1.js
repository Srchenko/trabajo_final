class Nivel_1 extends Phaser.Scene {

  constructor () {
    super('nivel_1');
  }

  create () {
    //  se crea la imagen de fondo y se repiten las veces que sea necesario para hacer el nivel largo
    let posicion_y = 0;
    for (let i = 0; i < 12; i++) {
      this.add.image(0, posicion_y, 'cielo').setOrigin(0);
      posicion_y += 896;
    }
    
    //  acá se crean las plataformas que se pueden romper con disparos
    plataformas_rompibles = this.physics.add.group();
    let indice_plataforma = 0;
    let plataforma_rompible_hijo;
    let indice_y = 1128;

    while (indice_y < 10000) {
      for (let indice = 0; indice < 3; indice++) {
        for (let index = 28; index < 28 + (64 * 7); index += 64) {

          let aleatorio = Phaser.Math.Between(1,100)

          if((indice_y < 1500) || (indice_y > 1500 && aleatorio <= 75)){
            plataformas_rompibles.create(index, indice_y, 'tile_superficie_rompible_' + Phaser.Math.Between(1,4)).setOrigin(0);
            plataforma_rompible_hijo = plataformas_rompibles.getChildren()[indice_plataforma];
            plataforma_rompible_hijo.body.immovable = true;
            plataforma_rompible_hijo.body.moves = false;
            indice_plataforma++;
          }

        }
        indice_y += 64;
      }
      indice_y += 1858;
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
    bordes_mapa.create(252, 10752, 'pared_invisible_horizontal');

    bordes_invisibles = this.physics.add.staticGroup();
    bordes_invisibles.create(252, 2550, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 2950, 'pared_invisible_horizontal');

    //  se crea al jugador
    //jugador = this.physics.add.sprite(75, 200, 'jugador_movimiento');
    jugador = this.physics.add.sprite(252, 3500, 'jugador_movimiento');
    jugador.setSize(18, 48, true);
    jugador.vida = 3;
    animacion_jugador_suelo = 'derecha_suelo';
    animacion_jugador_aire = 'derecha_aire';
    jugador.setCollideWorldBounds(false);

    dron = this.physics.add.group();
    dron.create(445, 950, 'dron_animacion');
    dron.create(252, 2825, 'dron_animacion');
    
    dron.create(252, 2700, 'dron_animacion');
    dron.create(100, 2450, 'dron_animacion');
    dron.create(60, 3750, 'dron_animacion');


    for (let indice = 0; indice < 2; indice++) {
      dron.getChildren()[indice].body.immovable = true;
      dron.getChildren()[indice].body.moves = false;
      dron.getChildren()[indice].vida = 2;
      dron.getChildren()[indice].anims.play('dron_movimiento', true);
    }

    for (let indice = 2; indice < 5; indice++) {
      dron.getChildren()[indice].vida = 2;
      dron.getChildren()[indice].anims.play('dron_movimiento', true);
      dron.getChildren()[indice].body.setAllowGravity(false);
      dron.getChildren()[indice].body.setBounce(1);
    }

    dron.getChildren()[2].setVelocity(-150, -150);
    dron.getChildren()[3].body.immovable = true;
    dron.getChildren()[3].setVelocity(-150, 0);
    dron.getChildren()[4].body.immovable = true;
    dron.getChildren()[4].setVelocity(0, -150);

    //  se crea la cámara que seguirá al jugador
    this.cameras.main.setBounds(0, 0, 504, 10752);
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
    
    this.physics.add.collider(balas, bordes_mapa, this.desaparecerBala, null, this);
    this.physics.add.collider(balas, plataformas_no_rompibles, this.desaparecerBala, null, this);
    this.physics.add.collider(balas, plataformas_rompibles, this.desaparecerBalaConPlataforma, null, this);
    this.physics.add.collider(balas, dron, this.desaparecerBalaConDron, null, this);
    jugador_overlap = this.physics.add.overlap(jugador, dron, this.bajarVidaJugador, null, this);
    this.physics.add.collider(jugador, bordes_mapa);
    this.physics.add.collider(jugador, plataformas_no_rompibles);
    this.physics.add.collider(jugador, plataformas_rompibles);
    this.physics.add.collider(dron);
    this.physics.add.collider(dron, plataformas_no_rompibles);
    this.physics.add.collider(dron, plataformas_rompibles);
    this.physics.add.collider(dron, bordes_invisibles);

    window.focus();
  }

  update (time, delta) {

    if(!jugador_overlap.active){

      espera_un_segundo_capo += delta;

      if((espera_un_segundo_capo >= 0 && espera_un_segundo_capo <= 250) || (espera_un_segundo_capo >= 500 && espera_un_segundo_capo <= 750) || (espera_un_segundo_capo >= 1000 && espera_un_segundo_capo <= 1250) || (espera_un_segundo_capo >= 1500 && espera_un_segundo_capo <= 1750)){
        jugador.setTint(0xff0000);
      }
      else{
        jugador.setTint(0xffffff);
      }
      
      if(espera_un_segundo_capo >= 2000){
        jugador_overlap.active = true;
        espera_un_segundo_capo = 0;
      }

    }

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
        ultimo_disparo = time + 300;
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

  desaparecerBalaConDron(bala, dron_elegido){
    bala.destroy();
    dron_elegido.vida--;

    let aleatorio = Phaser.Math.Between(1,2);
    if(!dron_elegido.body.immovable){
      if(aleatorio == 1){
        dron_elegido.setVelocity(-150, 150);
      }
      else{
        dron_elegido.setVelocity(150, 150);
      }
    }

    if(dron_elegido.vida == 0){
      dron_elegido.destroy();
    }
  }

  bajarVidaJugador(jugador_elegido, dron_elegido){
    jugador_elegido.vida--;
    jugador_overlap.active = false;
  }

}