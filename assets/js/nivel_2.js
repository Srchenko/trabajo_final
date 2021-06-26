class Nivel_2 extends Phaser.Scene {

  constructor () {

    super('nivel_2');

  }

  create () {

    puntos_inicial = 0;
    nivel_uno_jugado = false;
    tiempo_inicial = 30;
    temporizador_carga = 3000;
    torreta_disparo_izquierda = false;

    //  se crea la imagen de fondo y se repiten las veces que sea necesario para hacer el nivel largo
    let posicion_y = 0;
    for (let i = 0; i < 12; i++) {

      this.add.image(0, posicion_y, 'base').setOrigin(0);
      posicion_y += 896;
    }

    let robot_definitivo = this.add.image(252, 7597, 'robot_definitivo').setOrigin(0.5);
    robot_definitivo.setAlpha(0.1);
    
    //  acá se crean las plataformas que se pueden romper con disparos
    this.crearPlataformasRompibles();

    //  se crea el mapa restante utilizando el tilemap
    let mapa = this.make.tilemap({key: 'level_2'});
    const tileset_bordes = mapa.addTilesetImage('bordes_nivel_2','bordes_nivel_2');

    const tileset_suelo_base = mapa.addTilesetImage('suelo_base', 'tile_suelo_base');
    const tileset_superficie_suelo_base = mapa.addTilesetImage('superficie_suelo_base', 'tile_superficie_suelo_base');

    //  se crea la capa "plataformas" del tiled
    const plataformas = [tileset_suelo_base, tileset_superficie_suelo_base];

    //  se añaden todas las capas al nivel
    const plataforma_hecha = mapa.createLayer('plataformas', plataformas, 0, 0);
    const costado_hecho = mapa.createLayer('bordes', tileset_bordes, 0, 0);

    //  se ponen a las capas una propiedad de colisión
    plataforma_hecha.setCollisionByProperty({colision:true});
    costado_hecho.setCollisionByProperty({colision:true});

    //  se crean bordes invisibles para que los drones en movimiento no salgan de ciertos límites
    this.crearZonasInvisiblesParaJugador();

    //  se crea al jugador con algunas propiedades
    this.crearJugador();

    //se crean los robot
    this.crearRobot();

    torreta = this.physics.add.group();
    let base_torreta;

    this.add.image(0, 475, 'base_torreta').setOrigin(0);
    torreta.create(20, 500, 'torreta').setOrigin(0);
    torreta.getChildren()[0].setRotation(-0.2);
    torreta.getChildren()[0].max_ang = -0.2;
    torreta.getChildren()[0].cuadrante = 1;

    base_torreta = this.add.image(200, 1660, 'base_torreta').setOrigin(0);
    base_torreta.angle = 90;
    torreta.create(175, 1670, 'torreta').setOrigin(0);
    torreta.getChildren()[1].setRotation(0);
    torreta.getChildren()[1].max_ang = 0;
    torreta.getChildren()[1].cuadrante = 1;

    this.add.image(0, 3850, 'base_torreta').setOrigin(0);
    torreta.create(20, 3875, 'torreta').setOrigin(0);
    torreta.getChildren()[2].setRotation(0);
    torreta.getChildren()[2].max_ang = 0;
    torreta.getChildren()[2].cuadrante = 1;

    this.add.image(472, 4000, 'base_torreta').setOrigin(0);
    torreta.create(484, 4035, 'torreta').setOrigin(0);
    torreta.getChildren()[3].setRotation(3.14);
    torreta.getChildren()[3].max_ang = 3.14;
    torreta.getChildren()[3].cuadrante = 2;

    this.add.image(472, 5650, 'base_torreta').setOrigin(0);
    torreta.create(484, 5685, 'torreta').setOrigin(0);
    torreta.getChildren()[4].setRotation(-2.6);
    torreta.getChildren()[4].max_ang = 0;
    torreta.getChildren()[4].cuadrante = 3;

    this.add.image(472, 5450, 'base_torreta').setOrigin(0);
    torreta.create(484, 5485, 'torreta').setOrigin(0);
    torreta.getChildren()[5].setRotation(-3);
    torreta.getChildren()[5].max_ang = 0;
    torreta.getChildren()[5].cuadrante = 3;

    this.add.image(0, 6300, 'base_torreta').setOrigin(0);
    torreta.create(20, 6325, 'torreta').setOrigin(0);
    torreta.getChildren()[6].setRotation(-0.79);
    torreta.getChildren()[6].max_ang = 0;
    torreta.getChildren()[6].cuadrante = 3;

    this.add.image(472, 6700, 'base_torreta').setOrigin(0);
    torreta.create(484, 6735, 'torreta').setOrigin(0);
    torreta.getChildren()[7].setRotation(-2.6);
    torreta.getChildren()[7].max_ang = 0;
    torreta.getChildren()[7].cuadrante = 3;

    this.add.image(472, 9950, 'base_torreta').setOrigin(0);
    torreta.create(484, 9985, 'torreta').setOrigin(0);
    torreta.getChildren()[8].setRotation(3.14);
    torreta.getChildren()[8].max_ang = 3.14;
    torreta.getChildren()[8].cuadrante = 2;

    this.add.image(0, 8490, 'base_torreta').setOrigin(0);
    torreta.create(20, 8515, 'torreta').setOrigin(0);
    torreta.getChildren()[9].setRotation(0);
    torreta.getChildren()[9].max_ang = 0;
    torreta.getChildren()[9].cuadrante = 1;

    this.add.image(0, 8940, 'base_torreta').setOrigin(0);
    torreta.create(20, 8965, 'torreta').setOrigin(0);
    torreta.getChildren()[10].setRotation(0);
    torreta.getChildren()[10].max_ang = 0;
    torreta.getChildren()[10].cuadrante = 1;

    this.add.image(472, 8740, 'base_torreta').setOrigin(0);
    torreta.create(484, 8775, 'torreta').setOrigin(0);
    torreta.getChildren()[11].setRotation(-2.6);
    torreta.getChildren()[11].max_ang = 0;
    torreta.getChildren()[11].cuadrante = 3;

    for (let indice = 0; indice < torreta.getLength(); indice++) {

      torreta.getChildren()[indice].body.immovable = true;
      torreta.getChildren()[indice].body.setAllowGravity(false);
      torreta.getChildren()[indice].setCollideWorldBounds(false);
      torreta.getChildren()[indice].activar_torreta = false;
      torreta.getChildren()[indice].cadencia_de_fuego = 0;
      
    }

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

    Bala_torreta = new Phaser.Class({

      Extends: Phaser.Physics.Arcade.Sprite,
      initialize:

      //  constructor de bala
      function Bala (scene)
      {

        Phaser.Physics.Arcade.Sprite.call(this, scene, 0, 0, 'bala_enemiga');
        scene.add.existing(this);
        scene.physics.add.existing(this);

      },

      //  cada vez que se dispara una bala
      disparo: function (torreta_elegida)
      {

        this.setPosition(torreta_elegida.x + (Math.cos(torreta_elegida.rotation) * 70), torreta_elegida.y + (Math.sin(torreta_elegida.rotation) * 70));
        this.setRotation(torreta_elegida.rotation - 1.57);
        this.setVelocity(Math.cos(torreta_elegida.rotation) * 600, Math.sin(torreta_elegida.rotation) * 600);
        this.setTint((0xff0000));
        this.body.setAllowGravity(false);
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

    balas_torreta = this.add.group({

      classType: Bala_torreta,
      runChildUpdate: true

    });


    //  se crea un objeto para textos que aparecerán cuando eliminemos enemigos o juntemos items
    texto_objeto_puntos = [this.add.text(0, 0, ""), 2000];
    texto_objeto_puntos[0].visible = false;

    //  se crea el hud y se mantiene en el mismo lugar de la pantalla siempre con el scrollFactor
    this.crearHud();

    let baston = this.physics.add.sprite(50, 10700, "baston");
    baston.body.immovable = true;
    baston.body.moves = false;

    //  se agregan todas las colisiones
    plataformas_no_rompibles = [plataforma_hecha, costado_hecho];
    
    this.physics.add.collider(balas, plataformas_no_rompibles, this.desaparecerBala, null, this);
    this.physics.add.collider(balas, plataformas_rompibles, this.desaparecerBalaConPlataforma, null, this);
    this.physics.add.collider(balas, robot, this.desaparecerBalaConRobot, null, this);

    this.physics.add.collider(balas_torreta, plataformas_no_rompibles, this.desaparecerBala, null, this);
    this.physics.add.collider(balas_torreta, plataformas_rompibles, this.desaparecerBalaConPlataforma, null, this);

    jugador_overlap = this.physics.add.overlap(jugador, balas_torreta, this.bajarVidaJugador, null, this);
    jugador_overlap_robot = this.physics.add.overlap(jugador, robot, this.bajarVidaJugador, null, this);
    this.physics.add.collider(jugador, plataformas_no_rompibles, this.sonidosJugador, null, this);
    this.physics.add.collider(jugador, plataformas_rompibles, this.sonidosJugador, null, this);
    this.physics.add.overlap(jugador, items, this.recolectarItem, null, this);
    this.physics.add.overlap(jugador, bordes_invisibles, this.activarDesactivarTorreta, null, this);
    this.physics.add.collider(jugador, baston, this.ganasteJuego, null, this);

    this.physics.add.collider(robot, bordes_invisibles_enemigo, this.cambiarLado, null, this);
    this.physics.add.collider(robot, plataformas_no_rompibles);

    //  se añaden la música y los sonidos para este nivel
    this.agregarMusicaSonidos();

    fondo_carga_nivel = this.add.image(0, 0, 'fondo_carga_nivel').setOrigin(0);
    fondo_carga_nivel.visible = true;
    texto_carga_nivel = this.add.rexBBCodeText(config.width / 2, config.height / 2, '[b]CARGANDO[/b]\n\n[b]NIVEL 2[/b]', { align: 'center', fontFamily: 'Helvetica', fill: '#fff', fontSize: '60px'});
    texto_carga_nivel.setOrigin(0.5);
    texto_carga_nivel.visible = true;

    this.physics.pause();

    window.focus();
  }

  update (time, delta) {

    if(tiempo_hasta_juego_superado > -2000){

      tiempo_hasta_juego_superado -= delta;
      
      if(tiempo_hasta_juego_superado <= 0){

        if(puntos_inicial > puntuacion_maxima_definitiva[1]){

          puntuacion_maxima_definitiva[1] = puntos_inicial;
          localStorage.setItem(guardado_local_nivel_2, puntuacion_maxima_definitiva[1]);

        } 

        this.scene.start('juego_superado');

      }

      return;

    }

    if (fondo_carga_nivel.visible){

      temporizador_carga -= delta;

      if(temporizador_carga <= 0){

        musica.play();
        this.physics.resume();
        fondo_carga_nivel.visible = false;
        texto_carga_nivel.visible = false;

      }

      return;

    }

    //  si la vida del jugador llega a 0 o termina el tiempo, se detiene el progreso del juego y se hace la animación de muerte con su sonido
    //  se dirige a la pantalla de fin de juego luego de la animación correspondiente
    if(jugador.vida == 0 || tiempo_inicial == 0){

      musica.stop();
      if(tiempo_finalizado){

        robot.getChildren().forEach(function(hijo){

          hijo.anims.stop();

        });
        
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

        if(puntos_inicial > puntuacion_maxima_definitiva[1]){

          puntuacion_maxima_definitiva[1] = puntos_inicial;
          localStorage.setItem(guardado_local_nivel_2, puntuacion_maxima_definitiva[1]);

        }

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
    
    //  sucede cuando el jugador recibe daño, el jugador es invencible por 2 segundos
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
        jugador_overlap_robot.active = true;
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
      torreta_disparo_izquierda = true;

    }
    else{
      if(cursores.left.isDown && !jugador.body.onFloor()){

        jugador.anims.play('izquierda_aire', true);
        animacion_jugador_suelo = 'izquierda_suelo';
        animacion_jugador_aire = 'izquierda_aire';
        jugador.setVelocityX(-250);
        torreta_disparo_izquierda = true;

      }
      else{
        if(cursores.right.isDown && jugador.body.onFloor()){

          jugador.anims.play('derecha', true);
          animacion_jugador_suelo = 'derecha_suelo';
          animacion_jugador_aire = 'derecha_aire';
          jugador.setVelocityX(250);
          torreta_disparo_izquierda = false;

        }
        else{
          if(cursores.right.isDown && !jugador.body.onFloor()){

            jugador.anims.play('derecha_aire', true);
            animacion_jugador_suelo = 'derecha_suelo';
            animacion_jugador_aire = 'derecha_aire';
            jugador.setVelocityX(250);
            torreta_disparo_izquierda = false;

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

    torreta.getChildren().forEach(function(hijo){

      if(hijo.activar_torreta){

        let pos_jug_x = jugador.x;
        let pos_jug_y;
        if(torreta_disparo_izquierda){
  
          pos_jug_y = jugador.y - 12;
  
        }
        else{
  
          pos_jug_y = jugador.y + 12;
  
        }
  
        let pos_tor_x = hijo.x;
        let pos_tor_y = hijo.y;
        
        let angulo = Phaser.Math.Angle.Between(pos_tor_x, pos_tor_y, pos_jug_x, pos_jug_y);
        if(hijo.cuadrante == 1 && angulo < hijo.max_ang){
  
          angulo = hijo.max_ang;
  
        }
        else{

          if(hijo.cuadrante == 2 && (angulo >= (Math.PI * -1) && angulo <= 0)){
  
            angulo = hijo.max_ang;
    
          }

        }
        hijo.setRotation(angulo);
  
        if (time > hijo.cadencia_de_fuego)
        {
  
          var balita_enemiga = balas_torreta.get();
  
          if (balita_enemiga)
          {
            balita_enemiga.disparo(hijo);
            sonido_disparo_torreta.play();
            hijo.cadencia_de_fuego = time + Phaser.Math.Between(750,1500);
  
          }
  
        }
  
      }

    }, this);

  }

  crearPlataformasRompibles(){

    plataformas_rompibles = this.physics.add.group();
    let indice_plataforma = 0;
    let plataforma_rompible_hijo;    


    //crear plataformas


    for (let indice = 752; indice <= 880; indice+=64) {
      
      for (let index = 30; index <= 460; index+=64) {
        plataformas_rompibles.create(index, indice, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
        plataforma_rompible_hijo = plataformas_rompibles.getChildren()[indice_plataforma];
        plataforma_rompible_hijo.body.immovable = true;
        plataforma_rompible_hijo.body.moves = false;
        indice_plataforma++;
    }
    }
   
    for (let indice = 2456; indice <= 2520; indice+=64) {
      
      for (let index = 30; index <= 460; index+=64) {
        plataformas_rompibles.create(index, indice, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
        plataforma_rompible_hijo = plataformas_rompibles.getChildren()[indice_plataforma];
        plataforma_rompible_hijo.body.immovable = true;
        plataforma_rompible_hijo.body.moves = false;
        indice_plataforma++;
    }
    } 

    for (let indice = 3400; indice <= 3464; indice+=64) {
      
      for (let index = 30; index <= 460; index+=64) {
        plataformas_rompibles.create(index, indice, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
        plataforma_rompible_hijo = plataformas_rompibles.getChildren()[indice_plataforma];
        plataforma_rompible_hijo.body.immovable = true;
        plataforma_rompible_hijo.body.moves = false;
        indice_plataforma++;
    }
    } 

    for (let indice = 4616; indice <= 4744; indice+=64) {
      
      for (let index = 30; index <= 460; index+=64) {
        plataformas_rompibles.create(index, indice, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
        plataforma_rompible_hijo = plataformas_rompibles.getChildren()[indice_plataforma];
        plataforma_rompible_hijo.body.immovable = true;
        plataforma_rompible_hijo.body.moves = false;
        indice_plataforma++;
    }
    } 

    for (let indice = 6048; indice <= 6112; indice+=64) {
      
      for (let index = 30; index <= 460; index+=64) {
        plataformas_rompibles.create(index, indice, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
        plataforma_rompible_hijo = plataformas_rompibles.getChildren()[indice_plataforma];
        plataforma_rompible_hijo.body.immovable = true;
        plataforma_rompible_hijo.body.moves = false;
        indice_plataforma++;
    }
    } 

    for (let indice = 7336; indice <= 7400; indice+=64) {
      
      for (let index = 30; index <= 460; index+=64) {
        plataformas_rompibles.create(index, indice, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
        plataforma_rompible_hijo = plataformas_rompibles.getChildren()[indice_plataforma];
        plataforma_rompible_hijo.body.immovable = true;
        plataforma_rompible_hijo.body.moves = false;
        indice_plataforma++;
    }
    } 

    plataformas_rompibles.create(184, 3088, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(184, 3152, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(392, 3760, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(208, 1360, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(48, 2776, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(400, 2776, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(128, 2928, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(288, 2928, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(128, 8024, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(424, 8024, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(16, 8160, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(272, 8160, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(408, 10336, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(216, 10472, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(24, 2000, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(24, 2064, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);
    plataformas_rompibles.create(24, 2128, 'tile_superficie_rompible_base_' + Phaser.Math.Between(1,4)).setOrigin(0);    

    for (let index = 98; index < plataformas_rompibles.getLength(); index++) {
      plataforma_rompible_hijo = plataformas_rompibles.getChildren()[index];
      plataforma_rompible_hijo.body.immovable = true;
      plataforma_rompible_hijo.body.moves = false;
      
    }
    }
  

  crearZonasInvisiblesParaJugador(){

    bordes_invisibles = this.physics.add.staticGroup();
    bordes_invisibles.create(252, 425, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 950, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 1666, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 2200, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 3830, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 4250, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 4003, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 4365, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 5405, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 5855, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 6750, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 6545, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 7125, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 9945, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 10405, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 8475, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 8925, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 9420, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 8615, 'pared_invisible_horizontal');
    bordes_invisibles.create(252, 9235, 'pared_invisible_horizontal');

    bordes_invisibles_enemigo = this.physics.add.staticGroup();
    bordes_invisibles_enemigo.create(152, 1024, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(320, 1024, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(168, 1624, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(18, 1624, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(88, 1992, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(480, 1992, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(392, 2768, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(112, 2768, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(18, 3752, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(384, 3752, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(176, 4312, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(18, 4312, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(144, 4936, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(480, 4936, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(280, 5648, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(18, 5648, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(272, 6672, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(80, 6672, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(18, 7056, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(160, 7056, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(312, 8424, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(18, 8424, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(176, 8880, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(18, 8880, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(400, 9400, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(18, 9400, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(400, 10328, 'pared_invisible_vertical');
    bordes_invisibles_enemigo.create(18, 10328, 'pared_invisible_vertical');

    
  }

  crearJugador(){

    jugador = this.physics.add.sprite(225, 100, 'jugador_movimiento');
    //jugador = this.physics.add.sprite(225, 10712, 'jugador_movimiento');
    //jugador = this.physics.add.sprite(225, 7300, 'jugador_movimiento');
    jugador.setSize(18, 48, true);
    jugador.vida = 3;
    animacion_jugador_suelo = 'derecha_suelo';
    animacion_jugador_aire = 'derecha_aire';
    jugador.setCollideWorldBounds(false);

  }

  crearRobot(){

    robot = this.physics.add.group();

    robot.create(232, 1030, 'robot').setOrigin(0.5,1);
    robot.create(72, 1630, 'robot').setOrigin(0.5,1);
    robot.create(280, 1998, 'robot').setOrigin(0.5,1);
    robot.create(240, 2774, 'robot').setOrigin(0.5,1);
    robot.create(192, 3758, 'robot').setOrigin(0.5,1);
    robot.create(88, 4318, 'robot').setOrigin(0.5,1);
    robot.create(296, 4942, 'robot').setOrigin(0.5,1);
    robot.create(136, 5654, 'robot').setOrigin(0.5,1);
    robot.create(160, 6676, 'robot').setOrigin(0.5,1);
    robot.create(100, 7062, 'robot').setOrigin(0.5,1);
    robot.create(144, 8430, 'robot').setOrigin(0.5,1);
    robot.create(88, 8886, 'robot').setOrigin(0.5,1);
    robot.create(200, 9406, 'robot').setOrigin(0.5,1);
    robot.create(216, 10334, 'robot').setOrigin(0.5,1);

    for (let indice = 0; indice < robot.getLength(); indice++) {

      robot.getChildren()[indice].anims.play('robot_derecha', true);
      robot.getChildren()[indice].setVelocity(300, 0);
      robot.getChildren()[indice].setCollideWorldBounds(false);
      robot.getChildren()[indice].vida = 1;
      robot.getChildren()[indice].puntos = 30;

    }

  }

  crearColeccionables(){

    items = this.physics.add.group();

    items.create(208, 600, this.itemAleatorio());
    items.create(112, 1176, this.itemAleatorio());
    items.create(360, 1176, this.itemAleatorio());
    items.create(400, 1488, this.itemAleatorio());
    items.create(248, 2744, this.itemAleatorio());
    items.create(72, 2880, this.itemAleatorio());
    items.create(424, 2880, this.itemAleatorio());
    items.create(392, 3928, this.itemAleatorio());
    items.create(392, 4408, this.itemAleatorio());
    items.create(104, 4048, this.itemAleatorio());
    items.create(104, 4288, this.itemAleatorio());
    items.create(416, 1688, this.itemAleatorio());
    items.create(416, 1816, this.itemAleatorio());
    items.create(440, 2296, this.itemAleatorio());
    items.create(440, 2424, this.itemAleatorio());
    items.create(360, 3056, this.itemAleatorio());
    items.create(440, 3056, this.itemAleatorio());
    items.create(40, 3728, this.itemAleatorio());
    items.create(120, 3728, this.itemAleatorio());
    items.create(200, 3728, this.itemAleatorio());
    items.create(96, 4992, this.itemAleatorio());
    items.create(96, 5048, this.itemAleatorio());
    items.create(208, 5176, this.itemAleatorio());
    items.create(336, 5176, this.itemAleatorio());
    items.create(72, 5784, this.itemAleatorio());
    items.create(160, 5784, this.itemAleatorio());
    items.create(424, 6464, this.itemAleatorio());
    items.create(456, 6848, this.itemAleatorio());
    items.create(144, 7040, this.itemAleatorio());
    items.create(48, 7992, this.itemAleatorio());
    items.create(384, 8128, this.itemAleatorio());
    items.create(440, 8544, this.itemAleatorio());
    items.create(32, 8856, this.itemAleatorio());
    items.create(456, 9168, this.itemAleatorio());

    //creo items no aleatorios
    items.create(192, 368, 'item_1');
    items.create(40, 9376, 'item_1');
    items.create(40, 10136, 'item_1');
    items.create(40, 10318, 'item_1');
    items.create(376, 9560, 'item_1');
    items.create(248, 9688, 'item_1');
    items.create(112, 9824, 'item_1');

    //  se les da atributos a todos los items
    for (let indice = 0; indice < items.getLength(); indice++) {

      items.getChildren()[indice].body.immovable = true;
      items.getChildren()[indice].body.moves = false;
      if(items.getChildren()[indice].texture.key == 'item_1'){

        items.getChildren()[indice].puntos = 5;

      }
      else{

        if(items.getChildren()[indice].texture.key == 'item_2'){

          items.getChildren()[indice].puntos = 10;

        }

        else{

          items.getChildren()[indice].puntos = 20;

        }

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
    musica_carga = this.sound.add('musica_carga', {volume: 0.2});
    musica_carga.play();
    musica = this.sound.add('musica_nivel_2', {volume: 0.2, loop: true});
    sonido_salto_personaje = [this.sound.add('salto_personaje', {volume: 0.5}), true];
    sonido_caida_personaje = [this.sound.add('caida_personaje', {volume: 0.5}), false];
    sonido_disparo_personaje = this.sound.add('disparo_personaje', {volume: 0.5});
    sonido_disparo_torreta = this.sound.add('disparo_torreta', {volume: 0.5});
    sonido_danio_personaje = this.sound.add('danio_personaje', {volume: 0.5});
    sonido_danio_enemigo = this.sound.add('danio_enemigo', {volume: 0.5});
    sonido_enemigo_destruido = this.sound.add('enemigo_destruido', {volume: 0.5});
    sonido_plataforma_rompible_destruida = this.sound.add('plataforma_rompible_destruida', {volume: 0.5});
    sonido_muerte_personaje = [this.sound.add('muerte_personaje', {volume: 0.5, loop: true}), 2000];
    sonido_juntar_moneda = this.sound.add('juntar_moneda', {volume: 0.5});
    sonido_juntar_cronometro = this.sound.add('juntar_cronometro', {volume: 0.5});
    sonido_juntar_vida = this.sound.add('juntar_vida', {volume: 0.5});
    dialogo_reptiliano = this.sound.add('dialogo_reptiliano_nivel_2', {volume: 1});

  }

  desaparecerBala(bala, cosa){
    bala.destroy();
  }

  desaparecerBalaConPlataforma(bala, plataforma){

    sonido_plataforma_rompible_destruida.play();
    bala.destroy();
    plataforma.destroy();

  }

  desaparecerBalaConRobot(bala, robot_elegido){

    bala.destroy();
    robot_elegido.vida--;

    if(robot_elegido.vida == 0){

      sonido_enemigo_destruido.play();
      puntos_inicial += robot_elegido.puntos;

      texto_objeto_puntos[0].visible = false;
      texto_objeto_puntos = [this.add.text(robot_elegido.x, robot_elegido.y - 10, '+ ' + robot_elegido.puntos, {fontFamily: 'Arial Black', fontSize: '20px', fill: '#000'}).setOrigin(1), 2000];

      texto_puntos.setText("Puntos: " + puntos_inicial);
      robot_elegido.destroy();

    }

  }

  bajarVidaJugador(jugador_elegido, objeto_elegido){

    if(!objeto_elegido.body.allowGravity){

      objeto_elegido.destroy();

    }

    //  se actualiza el hud con las vidas del jugador
    jugador_elegido.vida--;
    texto_vidas.setText("Vidas: " + jugador_elegido.vida);
    jugador_overlap.active = false;
    jugador_overlap_robot.active = false;

    //  dependiendo de la vida del jugador, suceden diferentes sonidos y animaciones
    if (jugador_elegido.vida == 0){

      tiempo_finalizado = true;

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

      if (item_elegido.puntos == 20){

      sonido_juntar_vida.play();
      jugador.vida++;
      this.vidaMax();

      }
      else{

      sonido_juntar_moneda.play();

      }

    }

    item_elegido.destroy();

  }

  tiempoMax(){

    if(tiempo_inicial > 30){

      tiempo_inicial = 30;
      tiempo_segundo_frames = 1000;

    }

    texto_tiempo.setText("Tiempo: " + tiempo_inicial);

  }

  vidaMax(){

    if(jugador.vida > 3){

      jugador.vida = 3;

    }

    texto_vidas.setText("Vidas: " + jugador.vida);

  }

  itemAleatorio(){

    let aleatorio = Phaser.Math.Between(1,3);
    if(aleatorio == 1){

      return 'item_1';

    }
    else{
      if(aleatorio == 2){

        return 'item_2';

      }

      else{

        return 'item_3';

      }

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

  activarDesactivarTorreta(jugador_elegido, borde_elegido){

    if((borde_elegido == bordes_invisibles.getChildren()[0]) && borde_elegido.active){

      torreta.getChildren()[0].activar_torreta = true;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[1]) && borde_elegido.active){

      torreta.getChildren()[0].activar_torreta = false;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[2]) && borde_elegido.active){

      torreta.getChildren()[1].activar_torreta = true;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[3]) && borde_elegido.active){

      torreta.getChildren()[1].activar_torreta = false;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[4]) && borde_elegido.active){

      torreta.getChildren()[2].activar_torreta = true;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[5]) && borde_elegido.active){

      torreta.getChildren()[2].activar_torreta = false;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[6]) && borde_elegido.active){

      torreta.getChildren()[3].activar_torreta = true;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[7]) && borde_elegido.active){

      torreta.getChildren()[3].activar_torreta = false;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[8]) && borde_elegido.active){

      torreta.getChildren()[4].activar_torreta = true;
      torreta.getChildren()[5].activar_torreta = true;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[9]) && borde_elegido.active){

      torreta.getChildren()[4].activar_torreta = false;
      torreta.getChildren()[5].activar_torreta = false;
      torreta.getChildren()[6].activar_torreta = true;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[10]) && borde_elegido.active){

      torreta.getChildren()[6].activar_torreta = false;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[11]) && borde_elegido.active){

      torreta.getChildren()[7].activar_torreta = true;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[12]) && borde_elegido.active){

      torreta.getChildren()[7].activar_torreta = false;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[13]) && borde_elegido.active){

      torreta.getChildren()[8].activar_torreta = true;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[14]) && borde_elegido.active){

      torreta.getChildren()[8].activar_torreta = false;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[15]) && borde_elegido.active){

      torreta.getChildren()[9].activar_torreta = true;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[16]) && borde_elegido.active){

      torreta.getChildren()[9].activar_torreta = false;
      torreta.getChildren()[10].activar_torreta = true;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[17]) && borde_elegido.active){

      torreta.getChildren()[10].activar_torreta = false;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[18]) && borde_elegido.active){

      torreta.getChildren()[11].activar_torreta = true;
      borde_elegido.active = false;
      return;

    }

    if((borde_elegido == bordes_invisibles.getChildren()[19]) && borde_elegido.active){

      torreta.getChildren()[11].activar_torreta = false;
      borde_elegido.active = false;
      return;

    }

  }

  cambiarLado(robot_elegido, borde_elegido){

    if(robot_elegido.anims.currentAnim.key == 'robot_derecha'){

      robot_elegido.anims.play('robot_izquierda');
      robot_elegido.setVelocity(-300, 0);

    }
    else{

      robot_elegido.anims.play('robot_derecha');
      robot_elegido.setVelocity(300, 0);

    }

  }

  ganasteJuego(objeto_1, objeto_2){

    puntuacion_maxima[1] = puntos_inicial;
    juego_superado = true;
    musica.stop();
    dialogo_reptiliano.play();
    tiempo_hasta_juego_superado = 8000;
    this.physics.pause();
    robot.getChildren().forEach(function(hijo){

      hijo.anims.stop();

    });
    jugador.anims.stop();

  }

}