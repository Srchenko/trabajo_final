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

    bordes_invisibles = this.physics.add.staticGroup();
    bordes_invisibles.create(252, 2550, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 2950, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 4075, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 4475, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 6710, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 7275, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 7990, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 9115, 'pared_invisible_horizontal');

    //  se crea al jugador
    jugador = this.physics.add.sprite(75, 200, 'jugador_movimiento');
    //jugador = this.physics.add.sprite(252, 9896, 'jugador_movimiento');
    jugador.setSize(18, 48, true);
    jugador.vida = 3;
    animacion_jugador_suelo = 'derecha_suelo';
    animacion_jugador_aire = 'derecha_aire';
    jugador.setCollideWorldBounds(false);

    dron = this.physics.add.group();
    dron.create(445, 950, 'dron_animacion');
    dron.create(252, 2825, 'dron_animacion');
    dron.create(50, 4825, 'dron_animacion');
    dron.create(454, 4825, 'dron_animacion');
    dron.create(50, 9225, 'dron_animacion');
    dron.create(454, 9225, 'dron_animacion');
    dron.create(252, 9775, 'dron_animacion');
    
    dron.create(252, 2700, 'dron_animacion');
    dron.create(100, 2450, 'dron_animacion');
    dron.create(60, 3750, 'dron_animacion');
    dron.create(100, 4375, 'dron_animacion');
    dron.create(100, 7000, 'dron_animacion');
    dron.create(404, 7000, 'dron_animacion');
    dron.create(100, 8300, 'dron_animacion');
    dron.create(252, 8600, 'dron_animacion');
    dron.create(252, 9000, 'dron_animacion');
    dron.create(252, 9890, 'dron_animacion');
    dron.create(454, 10000, 'dron_animacion');

    for (let indice = 0; indice < 7; indice++) {
      dron.getChildren()[indice].body.immovable = true;
      dron.getChildren()[indice].body.moves = false;
      dron.getChildren()[indice].vida = 2;
      dron.getChildren()[indice].anims.play('dron_movimiento', true);
      dron.getChildren()[indice].setCollideWorldBounds(false);
      dron.getChildren()[indice].puntos = 20;
    }

    for (let indice = 7; indice < 18; indice++) {
      dron.getChildren()[indice].vida = 2;
      dron.getChildren()[indice].anims.play('dron_movimiento', true);
      dron.getChildren()[indice].body.setAllowGravity(false);
      dron.getChildren()[indice].body.setBounce(1);
      dron.getChildren()[indice].setCollideWorldBounds(false);
      dron.getChildren()[indice].puntos = 20;
    }

    dron.getChildren()[7].setVelocity(-150, -150);
    dron.getChildren()[8].body.immovable = true;
    dron.getChildren()[8].setVelocity(-150, 0);
    dron.getChildren()[9].body.immovable = true;
    dron.getChildren()[9].setVelocity(0, -150);
    dron.getChildren()[10].setVelocity(-150, -150);
    dron.getChildren()[11].setVelocity(-150, -150);
    dron.getChildren()[12].setVelocity(150, -150);
    dron.getChildren()[13].setVelocity(-150, -150);
    dron.getChildren()[14].setVelocity(150, -150);
    dron.getChildren()[15].setVelocity(-150, -150);
    dron.getChildren()[16].body.immovable = true;
    dron.getChildren()[16].setVelocity(-150, 0);
    dron.getChildren()[17].body.immovable = true;
    dron.getChildren()[17].setVelocity(0, -150);

    items = this.physics.add.group();
    items.create(40, 1981, 'item_1');
    items.create(252, 2461, this.itemAleatorio());
    items.create(454, 2941, this.itemAleatorio());
    items.create(40, 3501, this.itemAleatorio());
    items.create(425, 4221, this.itemAleatorio());
    items.create(252, 4701, this.itemAleatorio());
    items.create(454, 5581, this.itemAleatorio());
    items.create(100, 6061, this.itemAleatorio());
    items.create(40, 6965, this.itemAleatorio());
    items.create(40, 7661, this.itemAleatorio());
    items.create(252, 8075, this.itemAleatorio());
    items.create(375, 8300, this.itemAleatorio());
    items.create(90, 8700, this.itemAleatorio());
    items.create(252, 9101, this.itemAleatorio());
    items.create(40, 9901, 'item_1');
    items.create(40, 10300, 'item_1');

    for (let indice = 0; indice < 16; indice++) {
      items.getChildren()[indice].body.immovable = true;
      items.getChildren()[indice].body.moves = false;
      if(items.getChildren()[indice].texture.key == 'item_1'){
        items.getChildren()[indice].puntos = 5;
      }
      else{
        items.getChildren()[indice].puntos = 10;
      }
    }


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
          this.setCollideWorldBounds(false);
      },

    });

    //  se hace un conjunto de balas
    balas = this.add.group({
      classType: Bala,
      runChildUpdate: true
    });

    let base = this.physics.add.sprite(0, 10608, 'base_final').setOrigin(0);
    this.add.image(430, 10520, 'bandera_argentina').setOrigin(0);
    base.body.immovable = true;
    base.body.moves = false;

    texto_objeto_puntos = [this.add.text(0, 0, ""), 2000];
    texto_objeto_puntos[0].visible = false;

    fondo_hud = this.add.image(0, 0, 'fondo_hud').setOrigin(0);
    fondo_hud.scrollFactorX = 0;
    fondo_hud.scrollFactorY = 0;

    texto_vidas = this.add.text(5, 32, 'Vidas: ' + jugador.vida, { fontFamily: 'Arial Black', fontSize: '24px', fill: '#F00', stroke: '#000000', strokeThickness: 6 }).setOrigin(0, 0.5);
    texto_vidas.scrollFactorX = 0;
    texto_vidas.scrollFactorY = 0;

    texto_puntos = this.add.text(230, 32, 'Puntos: ' + puntos_inicial, { fontFamily: 'Arial Black', fontSize: '24px', fill: '#F00', stroke: '#000000', strokeThickness: 6 }).setOrigin(0.5, 0.5);
    texto_puntos.scrollFactorX = 0;
    texto_puntos.scrollFactorY = 0;

    texto_tiempo = this.add.text(499, 32, 'Tiempo: ' + tiempo_inicial, { fontFamily: 'Arial Black', fontSize: '24px', fill: '#F00', stroke: '#000000', strokeThickness: 6 }).setOrigin(1, 0.5);
    texto_tiempo.scrollFactorX = 0;
    texto_tiempo.scrollFactorY = 0;

    //  se agregan todas las colisiones
    plataformas_no_rompibles = [plataforma_hecha, costado_hecho];
    
    this.physics.add.collider(balas, plataformas_no_rompibles, this.desaparecerBala, null, this);
    this.physics.add.collider(balas, plataformas_rompibles, this.desaparecerBalaConPlataforma, null, this);
    this.physics.add.collider(balas, dron, this.desaparecerBalaConDron, null, this);
    this.physics.add.collider(balas, base, this.desaparecerBala, null, this);

    jugador_overlap = this.physics.add.overlap(jugador, dron, this.bajarVidaJugador, null, this);
    this.physics.add.collider(jugador, plataformas_no_rompibles);
    this.physics.add.collider(jugador, plataformas_rompibles);
    this.physics.add.collider(jugador, base);
    this.physics.add.overlap(jugador, items, this.recolectarItem, null, this);
    
    this.physics.add.collider(dron);
    this.physics.add.collider(dron, plataformas_no_rompibles);
    this.physics.add.collider(dron, plataformas_rompibles);
    this.physics.add.collider(dron, bordes_invisibles);

    window.focus();
  }

  update (time, delta) {

    if(texto_objeto_puntos[0].visible){
      this.children.bringToTop(fondo_hud);
      this.children.bringToTop(texto_puntos);
      this.children.bringToTop(texto_tiempo);
      this.children.bringToTop(texto_vidas);

      texto_objeto_puntos[1] -= delta
      if(texto_objeto_puntos[1] <= 0){
        texto_objeto_puntos[0].visible = false;
      }
    }
    
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

    tiempo_segundo_frames -= delta;
    if(tiempo_segundo_frames <= 0){
      tiempo_inicial --;
      tiempo_segundo_frames += 1000;
      texto_tiempo.setText("Tiempo: " + tiempo_inicial);
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

  desaparecerBala(bala, cosa){
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
      puntos_inicial += dron_elegido.puntos;

      texto_objeto_puntos[0].visible = false;
      texto_objeto_puntos = [this.add.text(dron_elegido.x, dron_elegido.y, '+ ' + dron_elegido.puntos, {fontFamily: 'Arial Black', fontSize: '20px', fill: '#000'}).setOrigin(0.5), 2000];

      texto_puntos.setText("Puntos: " + puntos_inicial);
      dron_elegido.destroy();
    }
  }

  bajarVidaJugador(jugador_elegido, dron_elegido){
    jugador_elegido.vida--;
    texto_vidas.setText("Vidas: " + jugador_elegido.vida);
    jugador_overlap.active = false;
  }

  recolectarItem(jugador_elegido, item_elegido){
      puntos_inicial += item_elegido.puntos;

      texto_objeto_puntos[0].visible = false;
      texto_objeto_puntos = [this.add.text(item_elegido.x, item_elegido.y, '+ ' + item_elegido.puntos, {fontFamily: 'Arial Black', fontSize: '20px', fill: '#000'}).setOrigin(0.5), 2000];

      texto_puntos.setText("Puntos: " + puntos_inicial);

      if (item_elegido.puntos == 10){
        tiempo_inicial += item_elegido.puntos;
        this.tiempoMax();
      }

      item_elegido.destroy();
  }

  tiempoMax(){
    if(tiempo_inicial > 60){
      tiempo_inicial = 60;
      tiempo_segundo_frames = 1000;
    }
    texto_tiempo.setText("Tiempo: " + tiempo_inicial);
  }

  itemAleatorio(){
    let aleatorio = Phaser.Math.Between(1,2);
    if(aleatorio == 2){
      return 'item_2';
    }
    else{
      return 'item_1';
    }
  }

}