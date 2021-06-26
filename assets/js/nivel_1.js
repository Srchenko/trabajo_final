class Nivel_1 extends Phaser.Scene {

  constructor () {

    super('nivel_1');

  }

  create () {

    torreta_disparo_izquierda = false;
    nivel_uno_jugado = true;

    //  se crea la imagen de fondo y se repiten las veces que sea necesario para hacer el nivel largo
    let posicion_y = 0;
    for (let i = 0; i < 12; i++) {

      this.add.image(0, posicion_y, 'cielo').setOrigin(0);
      posicion_y += 896;
    }
    
    //  acá se crean las plataformas que se pueden romper con disparos
    this.crearPlataformasRompibles();

    //  se crea el mapa restante utilizando el tilemap
    let mapa = this.make.tilemap({key: 'level_1'});
    const tileset_montania_1 = mapa.addTilesetImage('tile_montania','tile_montania');
    const tileset_montania_2 = mapa.addTilesetImage('tile_montania_2','tile_montania_3');
    const tileset_montania_3 = mapa.addTilesetImage('tile_montania_3','tile_montania_3');

    //  se crea la capa "costados" del tiled
    const costados = [tileset_montania_1, tileset_montania_2, tileset_montania_3];

    const tileset_suelo_montania = mapa.addTilesetImage('tile_suelo_montania','tile_suelo_montania');
    const tileset_superficie_suelo_montania = mapa.addTilesetImage('tile_superficie_suelo_montania','tile_superficie_suelo_montania');

    //  se crea la capa "plataformas" del tiled
    const plataformas = [tileset_suelo_montania, tileset_superficie_suelo_montania];

    //  se añaden todas las capas al nivel
    const plataforma_hecha = mapa.createLayer('plataformas', plataformas, 0, 0);
    const costado_hecho = mapa.createLayer('costados', costados, 0, 0);

    //  se ponen a las capas una propiedad de colisión
    plataforma_hecha.setCollisionByProperty({collides:true});
    costado_hecho.setCollisionByProperty({collides:true});

    //  se crean bordes invisibles para que los drones en movimiento no salgan de ciertos límites
    this.crearBordesInvisibles();

    //  se crea al jugador con algunas propiedades
    this.crearJugador();

    //  se crean todos los drones del nivel con sus atributos
    this.crearDrones();

    //  se crean todos los colleccionables con sus atributos
    this.crearColeccionables();

    //  se crea la cámara que seguirá al jugador
    this.cameras.main.setBounds(0, 0, 504, 10752);
    camara = this.cameras.main;

    //  se añaden eventos para presionar teclas del teclado
    if (cursores =! undefined){

        cursores = this.input.keyboard.createCursorKeys();

    }

    //  se agrega la clase "bala" con sus atributos y funciones, esto permitirá disparar al jugador luego
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

    //  se crea el final del nivel 1, que pasará luego al nivel 2
    let base = this.physics.add.sprite(0, 10608, 'base_final').setOrigin(0);
    this.add.image(430, 10520, 'bandera_argentina').setOrigin(0);
    base.body.immovable = true;
    base.body.moves = false;

    //  se crea un objeto para textos que aparecerán cuando eliminemos enemigos o juntemos items
    texto_objeto_puntos = [this.add.text(0, 0, ""), 2000];
    texto_objeto_puntos[0].visible = false;

    //  se crea el hud y se mantiene en el mismo lugar de la pantalla siempre con el scrollFactor
    this.crearHud();

    //  se agregan todas las colisiones
    plataformas_no_rompibles = [plataforma_hecha, costado_hecho];
    
    this.physics.add.collider(balas, plataformas_no_rompibles, this.desaparecerBala, null, this);
    this.physics.add.collider(balas, plataformas_rompibles, this.desaparecerBalaConPlataforma, null, this);
    this.physics.add.collider(balas, dron, this.desaparecerBalaConDron, null, this);
    this.physics.add.collider(balas, base, this.desaparecerBala, null, this);

    jugador_overlap = this.physics.add.overlap(jugador, dron, this.bajarVidaJugador, null, this);
    this.physics.add.collider(jugador, plataformas_no_rompibles, this.sonidosJugador, null, this);
    this.physics.add.collider(jugador, plataformas_rompibles, this.sonidosJugador, null, this);
    this.physics.add.collider(jugador, base, this.pasarSiguienteNivel, null, this);
    this.physics.add.overlap(jugador, items, this.recolectarItem, null, this);
    
    this.physics.add.collider(dron);
    this.physics.add.collider(dron, plataformas_no_rompibles);
    this.physics.add.collider(dron, plataformas_rompibles);
    this.physics.add.collider(dron, bordes_invisibles);

    //  se añaden la música y los sonidos para este nivel
    this.agregarMusicaSonidos();

    fondo_carga_nivel = this.add.image(0, 0, 'fondo_carga_nivel').setOrigin(0);
    fondo_carga_nivel.visible = true;
    texto_carga_nivel = this.add.rexBBCodeText(config.width / 2, config.height / 2, '[b]CARGANDO[/b]\n\n[b]NIVEL 1[/b]', { align: 'center', fontFamily: 'Helvetica', fill: '#fff', fontSize: '60px'});
    texto_carga_nivel.setOrigin(0.5);
    texto_carga_nivel.visible = true;

    this.physics.pause();

    window.focus();
  }

  update (time, delta) {

    if (fondo_carga_nivel.visible){

      temporizador_carga -= delta;

      if(temporizador_carga <= 0){

        this.physics.resume();

        if(nivel_uno_jugado_primera_vez){

          dialogo_reptiliano.play();
          musica.volume = 0.1;
          nivel_uno_jugado_primera_vez = false;

        }

        fondo_carga_nivel.visible = false;
        texto_carga_nivel.visible = false;

      }

      return;

    }

    if(!dialogo_reptiliano.isPlaying){

      musica.volume = 0.2;

    }

    //  si la vida del jugador llega a 0 o termina el tiempo, se detiene el progreso del juego y se hace la animación de muerte con su sonido
    //  se dirige a la pantalla de fin de juego luego de la animación correspondiente
    if(jugador.vida == 0 || tiempo_inicial == 0){

      musica.stop();
      if(tiempo_finalizado){

        sonido_muerte_personaje[0].play();
        jugador.anims.play('perdio_jugador', true);
        tiempo_finalizado = false;

      }

      this.children.bringToTop(jugador);
      this.physics.pause();
      sonido_muerte_personaje[1] -= delta;
      
      if(sonido_muerte_personaje[1] <= 0){

        sonido_muerte_personaje[0].loop = false;

      }

      if(sonido_muerte_personaje[1] <= -1000){

        vidas_jugador_fin_juego = jugador.vida;
        this.scene.start('fin_juego');

      }

      return;

    }

    //  si el jugador está en el aire, el sonido de choque con el suelo se activa para sonar después
    if(!jugador.body.onFloor()){
      
      sonido_caida_personaje[1] = true;

    }

    //  cuando el jugador elimina un enemigo o junta un item, aparecerá un texto, el mismo desaparecerá luego de 2 segundos
    if(texto_objeto_puntos[0].visible){

      //  el hud se pone siempre arriba del todo en pantalla, porque los puntos mostrados (al crearse siempre luego del hud) estaban antes por encima del hud
      this.children.bringToTop(fondo_hud);
      this.children.bringToTop(texto_puntos);
      this.children.bringToTop(texto_tiempo);
      this.children.bringToTop(texto_vidas);

      texto_objeto_puntos[1] -= delta

      if(texto_objeto_puntos[1] <= 0){

        texto_objeto_puntos[0].visible = false;

      }

    }
    
    //  sucede cuando el jugador choca con un enemigo, el jugador es invencible por 2 segundos
    if(!jugador_overlap.active){

      espera_un_segundo_capo += delta;

      //  el jugador cambia entre un tono rojizo y transparente durante 2 segundos indicando su invencibilidad 
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

    //  sirve para ir restando el tiempo del nivel y que se vea en el hud
    tiempo_segundo_frames -= delta;
    if(tiempo_segundo_frames <= 0){

      tiempo_inicial --;
      tiempo_segundo_frames += 1000;
      texto_tiempo.setText("Tiempo: " + tiempo_inicial);

      if(tiempo_inicial == 0){
        tiempo_finalizado = true;
      }

    }

    //  la camara siempre sigue al jugador en el eje vertical a cierta altura
    camara.centerOn(0,jugador.y + 168);

    //  movimiento de personaje, izquierda, derecha, también cuando está parado y saltando
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

    //  hace que el jugador mantenga la misma 'hitbox' dando igual sus movimientos
    jugador.setSize(18, 48, true);

    //  el personaje salta cuando está tocando el suelo
    if (cursores.up.isDown && jugador.body.onFloor()) {

      if (sonido_salto_personaje[1]){

        sonido_salto_personaje[0].play();
        sonido_salto_personaje[1] = false;

      }
      jugador.setVelocityY(-400);

    }

    //  el personaje dispara cuando está en el aire, y hay una pequeña demora entre los disparos
    
    if (cursores.space.isDown && !jugador.body.onFloor() && time > ultimo_disparo)
    {

      var balita = balas.get();

      // esto se hace para que el disparo no aparezca delante del jugador
      this.children.bringToTop(balita);
      this.children.bringToTop(jugador);

      if (balita)
      {

        balita.disparo(jugador.x, jugador.y);
        sonido_disparo_personaje.play();
        ultimo_disparo = time + 300;

      }

    }

  }

  crearPlataformasRompibles(){

    plataformas_rompibles = this.physics.add.group();
    let indice_plataforma = 0;
    let plataforma_rompible_hijo;
    let indice_y = 1128;

    //  los hijos del primer conjunto de plataformas rompibles aparecerán todos, los hijos de las demás plataformas aparecerán de manera aleatoria al crear el nivel
    while (indice_y < 10000) {

      for (let indice = 0; indice < 3; indice++) {

        for (let index = 28; index < 28 + (64 * 7); index += 64) {

          let aleatorio = Phaser.Math.Between(1,100);

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

  }

  crearBordesInvisibles(){

    bordes_invisibles = this.physics.add.staticGroup();
    bordes_invisibles.create(252, 2550, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 2950, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 4075, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 4475, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 6710, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 7275, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 7990, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 9115, 'pared_invisible_horizontal');

  }

  crearJugador(){

    jugador = this.physics.add.sprite(75, 200, 'jugador_movimiento');
    //jugador = this.physics.add.sprite(75, 10000, 'jugador_movimiento');
    jugador.setSize(18, 48, true);
    jugador.vida = 3;
    animacion_jugador_suelo = 'derecha_suelo';
    animacion_jugador_aire = 'derecha_aire';
    jugador.setCollideWorldBounds(false);

  }

  crearDrones(){

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

    //  estos serán los drones que no se mueven
    for (let indice = 0; indice < 7; indice++) {

      dron.getChildren()[indice].body.immovable = true;
      dron.getChildren()[indice].body.moves = false;
      dron.getChildren()[indice].vida = 2;
      dron.getChildren()[indice].anims.play('dron_movimiento', true);
      dron.getChildren()[indice].setCollideWorldBounds(false);
      dron.getChildren()[indice].puntos = 20;

    }

    //  estos serán los drones que se mueven
    for (let indice = 7; indice < 18; indice++) {

      dron.getChildren()[indice].vida = 2;
      dron.getChildren()[indice].anims.play('dron_movimiento', true);
      dron.getChildren()[indice].body.setAllowGravity(false);
      dron.getChildren()[indice].body.setBounce(1);
      dron.getChildren()[indice].setCollideWorldBounds(false);
      dron.getChildren()[indice].puntos = 20;

    }

    //  atributos adicionales para los drones que se mueven
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

  }

  crearColeccionables(){

    items = this.physics.add.group();

    //  el primer item que aparecerá en el nivel siempre será una moneda
    items.create(40, 1981, 'item_1');

    //  en casi todas las demás posiciones aparecerá un item aleatorio entre dos, habrá un 50% de probabilidades de que salga una moneda o un cronómetro
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

    //  se les da atributos a todos los items
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

  }

  crearHud(){

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

  }

  agregarMusicaSonidos(){

    //  algunos sonidos y música estarán dentro de un arreglo, porque su comportamiento será diferente en diferentes puntos del juego dependiendo de las acciones del jugador
    musica = this.sound.add('musica_nivel_1', {volume: 0.2, loop: true});
    musica.play();
    sonido_salto_personaje = [this.sound.add('salto_personaje', {volume: 0.5}), true];
    sonido_caida_personaje = [this.sound.add('caida_personaje', {volume: 0.5}), false];
    sonido_disparo_personaje = this.sound.add('disparo_personaje', {volume: 0.5});
    sonido_danio_personaje = this.sound.add('danio_personaje', {volume: 0.5});
    sonido_danio_enemigo = this.sound.add('danio_enemigo', {volume: 0.5});
    sonido_enemigo_destruido = this.sound.add('enemigo_destruido', {volume: 0.5});
    sonido_plataforma_rompible_destruida = this.sound.add('plataforma_rompible_destruida', {volume: 0.5});
    sonido_muerte_personaje = [this.sound.add('muerte_personaje', {volume: 0.5, loop: true}), 2000];
    sonido_juntar_moneda = this.sound.add('juntar_moneda', {volume: 0.5});
    sonido_juntar_cronometro = this.sound.add('juntar_cronometro', {volume: 0.5});
    dialogo_reptiliano = this.sound.add('dialogo_reptiliano_nivel_1', {volume: 1});

  }

  desaparecerBala(bala, cosa){
    bala.destroy();
  }

  desaparecerBalaConPlataforma(bala, plataforma){

    sonido_plataforma_rompible_destruida.play();
    bala.destroy();
    plataforma.destroy();

  }

  desaparecerBalaConDron(bala, dron_elegido){

    bala.destroy();
    dron_elegido.vida--;

    //  cuando el jugador acierta un disparo, el dron se moverá para abajo con un comportamiento aleatorio
    let aleatorio = Phaser.Math.Between(1,2);
    if(!dron_elegido.body.immovable){
      if(aleatorio == 1){
        dron_elegido.setVelocity(-150, 150);
      }
      else{
        dron_elegido.setVelocity(150, 150);
      }
    }

    //  si el dron es destruido, se añaden los puntos en el hud y se muestra en pantalla también, en el lugar de destrucción, los puntos obtenidos
    //  hay dos sonidos diferentes para el dron, cuando se destruye y cuando recibe daño
    if(dron_elegido.vida == 0){

      sonido_enemigo_destruido.play();
      puntos_inicial += dron_elegido.puntos;

      texto_objeto_puntos[0].visible = false;
      texto_objeto_puntos = [this.add.text(dron_elegido.x, dron_elegido.y, '+ ' + dron_elegido.puntos, {fontFamily: 'Arial Black', fontSize: '20px', fill: '#000'}).setOrigin(0.5), 2000];

      texto_puntos.setText("Puntos: " + puntos_inicial);
      dron_elegido.destroy();

    }
    else{

      sonido_danio_enemigo.play();

    }

  }

  bajarVidaJugador(jugador_elegido, dron_elegido){

    //  se actualiza el hud con las vidas del jugador
    jugador_elegido.vida--;
    texto_vidas.setText("Vidas: " + jugador_elegido.vida);
    jugador_overlap.active = false;

    //  dependiendo de la vida del jugador, suceden diferentes sonidos y animaciones
    if (jugador_elegido.vida == 0){

      sonido_muerte_personaje[0].play();
      jugador_elegido.anims.play('perdio_jugador', true);

    }
    else{

      sonido_danio_personaje.play();

    }

  }

  recolectarItem(jugador_elegido, item_elegido){

    //  si se junta el item, se añaden los puntos en el hud y se muestra en pantalla también, en el lugar de juntada, los puntos obtenidos
    puntos_inicial += item_elegido.puntos;

    texto_objeto_puntos[0].visible = false;
    texto_objeto_puntos = [this.add.text(item_elegido.x, item_elegido.y, '+ ' + item_elegido.puntos, {fontFamily: 'Arial Black', fontSize: '20px', fill: '#000'}).setOrigin(0.5), 2000];

    texto_puntos.setText("Puntos: " + puntos_inicial);

    //  si se junta un item de cronómetro se añaden 10 segundos al temporizador
    //  hay sonidos diferentes para cada tipo de item que se junta
    if (item_elegido.puntos == 10){

      sonido_juntar_cronometro.play();
      tiempo_inicial += item_elegido.puntos;

      //  el tiempo máximo es de 60 segundos, por lo tanto, se hace una función para que al juntar ese item, no supere los 60 segundos
      this.tiempoMax();

    }
    else{

      sonido_juntar_moneda.play();

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

  sonidosJugador(jugador_elegido, plataforma_elegida){
    
    //  al caer al suelo, el jugador hace un solo sonido y se activa en otro lugar cuando está en el aire
    //  también acá se activa el sonido del salto en el aire para reproducirse luego cuando el personaje vuelve a saltar estando en el suelo anteriormente
    sonido_salto_personaje[1] = true;
    if(sonido_caida_personaje[1] && jugador_elegido.body.onFloor()){

      sonido_caida_personaje[0].play();
      sonido_caida_personaje[1] = false;

    }

  }

  pasarSiguienteNivel(objeto_1, objeto_2){

    puntuacion_maxima[0] = puntos_inicial;
    musica.stop();
    this.scene.start('nivel_2');

  }

}