class Menu_Principal extends Phaser.Scene {

  constructor () {

    super('menu_principal');

  }

  preload () {

    //  un plugin para escribir mejor un texto
    this.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);

    //  se cargan las imágenes del menú principal
    this.load.image('pantalla_inicio', 'assets/images/pantalla_inicio.png');
    this.load.image('menu_principal', 'assets/images/menu_principal.png');
    this.load.image('boton_jugar', 'assets/images/boton_jugar.png');
    this.load.image('boton_creditos', 'assets/images/boton_creditos.png');
    
    //  se cargan las imágenes del nivel 1
    this.load.image('cielo', 'assets/images/cielo.png');
    this.load.image('bala', 'assets/images/bala.png');
    this.load.image('base_final', 'assets/images/base_final.png');
    this.load.image('bandera_argentina', 'assets/images/bandera_argentina.png');
    this.load.image('item_1', 'assets/images/item_1.png');
    this.load.image('item_2', 'assets/images/item_2.png');
    this.load.image('fondo_hud', 'assets/images/fondo_hud.png');
    this.load.image('pared_invisible_horizontal', 'assets/images/pared_invisible_horizontal.png');

    //  se cargan las imágenes del tilemap del nivel 1
    this.load.image('tile_montania', 'assets/images/tile_montania.png');
    this.load.image('tile_montania_2', 'assets/images/tile_montania_2.png');
    this.load.image('tile_montania_3', 'assets/images/tile_montania_3.png');
    this.load.image('tile_suelo_montania', 'assets/images/tile_suelo_montania.png');
    this.load.image('tile_superficie_suelo_montania', 'assets/images/tile_superficie_suelo_montania.png');
    this.load.image('tile_superficie_rompible_1', 'assets/images/tile_superficie_rompible_1.png');
    this.load.image('tile_superficie_rompible_2', 'assets/images/tile_superficie_rompible_2.png');
    this.load.image('tile_superficie_rompible_3', 'assets/images/tile_superficie_rompible_3.png');
    this.load.image('tile_superficie_rompible_4', 'assets/images/tile_superficie_rompible_4.png');
    
    //  se cargan las imágenes del nivel 2
    this.load.image('base', 'assets/images/base.png');
    this.load.image('torreta', 'assets/images/torreta.png');
    this.load.image('base_torreta', 'assets/images/base_torreta.png');
    this.load.image('bala_enemiga', 'assets/images/bala_enemiga.png');
    this.load.image('item_3', 'assets/images/item_3.png');

    //  se cargan las imágenes del tilemap del nivel 2
    this.load.image('bordes_nivel_2', 'assets/images/bordes_nivel_2.png');
    this.load.image('tile_superficie_rompible_base_1', 'assets/images/tile_superficie_rompible_base_1.png');
    this.load.image('tile_superficie_rompible_base_2', 'assets/images/tile_superficie_rompible_base_2.png');
    this.load.image('tile_superficie_rompible_base_3', 'assets/images/tile_superficie_rompible_base_3.png');
    this.load.image('tile_superficie_rompible_base_4', 'assets/images/tile_superficie_rompible_base_4.png');
    this.load.image('tile_suelo_base', 'assets/images/tile_suelo_base.png');
    this.load.image('tile_superficie_suelo_base', 'assets/images/tile_superficie_suelo_base.png');

    //  se cargan las imágenes del fin de juego
    this.load.image('fin_juego', 'assets/images/fin_juego.png');
    

    //  se cargan los spritesheets
    this.load.spritesheet('jugador_movimiento', 'assets/images/jugador_movimiento.png', { frameWidth: 26, frameHeight: 48});
    this.load.spritesheet('dron_animacion', 'assets/images/dron_animacion.png', { frameWidth: 64, frameHeight: 56});
    this.load.spritesheet('jugador_perder', 'assets/images/jugador_perder.png', { frameWidth: 64, frameHeight: 64});

    //  se carga los tiles de un tilemap
    this.load.tilemapTiledJSON('level_1', 'assets/js/nivel_1.json');
    this.load.tilemapTiledJSON('level_2', 'assets/js/nivel_2.json');

    //  se carga la música y los sonidos
    this.load.audio('musica_nivel_1', 'assets/audio/musica_nivel_1.mp3');
    this.load.audio('musica_nivel_2', 'assets/audio/musica_nivel_2.mp3');
    this.load.audio('musica_fin_juego', 'assets/audio/musica_fin_juego.mp3');
    this.load.audio('musica_menu_principal', 'assets/audio/musica_menu_principal.mp3');

    this.load.audio('caida_personaje', 'assets/audio/caida_personaje.mp3');
    this.load.audio('salto_personaje', 'assets/audio/salto_personaje.mp3');
    this.load.audio('disparo_personaje', 'assets/audio/disparo_personaje.mp3');
    this.load.audio('disparo_torreta', 'assets/audio/disparo_torreta.mp3');
    this.load.audio('danio_personaje', 'assets/audio/danio_personaje.mp3');
    this.load.audio('danio_enemigo', 'assets/audio/danio_enemigo.mp3');
    this.load.audio('enemigo_destruido', 'assets/audio/enemigo_destruido.mp3');
    this.load.audio('plataforma_rompible_destruida', 'assets/audio/plataforma_rompible_destruida.mp3');
    this.load.audio('muerte_personaje', 'assets/audio/muerte_personaje.mp3');
    this.load.audio('juntar_moneda', 'assets/audio/juntar_moneda.mp3');
    this.load.audio('juntar_cronometro', 'assets/audio/juntar_cronometro.mp3');
    this.load.audio('interactuar_mouse', 'assets/audio/interactuar_mouse.mp3');
    this.load.audio('juntar_vida', 'assets/audio/juntar_vida.mp3');

  }

  create (){

    //  se cargan animaciones del jugador y de los enemigos
    this.agregarAnimaciones();
    
    this.add.image(0, 0, 'menu_principal').setOrigin(0);

    //  se asignan variables a los botones para usarlos luego
    let jugar = this.add.image(config.width / 2 , config.height / 2 - 200, 'boton_jugar');
    let creditos = this.add.image(config.width / 2 , config.height / 2, 'boton_creditos');

    //  texto con un mini-tutorial de cómo funciona el juego
    let tutorial_menu = '[b]CONTROLES:[/b]\n[b]Flechas:[/b] Saltar, moverse izquierda/derecha\n[b]Barra espaciadora:[/b] Disparar';
    let tutorial = this.add.rexBBCodeText(config.width / 2 , config.height / 2 + 225, tutorial_menu, { align: 'center', fontFamily: 'Helvetica', fill: '#000', fontSize: '22px', lineSpacing: 8});
    tutorial.setOrigin(0.5);

    //  se agrega una imagen de inicio que luego desaparecerá presionando una tecla o haciendo click
    imagen_inicio = this.add.image(0, 0, 'pantalla_inicio').setOrigin(0);

    imagen_inicio.setInteractive();
    this.input.keyboard.on('keydown', () => {
      presiona_cualquier_tecla = true;
      return;
    });
    imagen_inicio.on('pointerdown', () => {
      presiona_cualquier_tecla = true;
    });

    if(musica == undefined){

      musica = this.sound.add('musica_menu_principal', {volume: 0.2, loop: true});

    }

    sonido_interactuar_mouse = this.sound.add('interactuar_mouse', {volume: 0.5});
    //  los botones de jugar y créditos se hacen interactivos
    //  hacen diferentes cosas dependiendo si se pasa el mouse por encima o se lo quita, y también cuando se les hace click se abren las escenas correspondientes
    jugar.setInteractive();
    creditos.setInteractive();

    jugar.on('pointerover', () => {
        jugar.setTint(0x0000ff);
    })
    jugar.on('pointerout', () => {
        jugar.setTint(0xffffff);
    })
    jugar.on('pointerdown', () => {
      if(!imagen_inicio.visible){

        musica.stop();
        sonido_interactuar_mouse.play();
        this.scene.start('nivel_2');

      }
    })

    creditos.on('pointerover', () => {
      creditos.setTint(0x0000ff);
    })
    creditos.on('pointerout', () => {
      creditos.setTint(0xffffff);
    })
    creditos.on('pointerdown', () => {
      if(!imagen_inicio.visible){

        sonido_interactuar_mouse.play();
        this.scene.start('creditos');

      }
    })

    window.focus();
  }

  update(time, delta){

    //  al presionarse cualquier tecla o botón del mouse, empieza la música y se deja de ver la imagen de inicio
    if(imagen_inicio.visible && presiona_cualquier_tecla){

      if(!musica.isPlaying){
        musica.play();
      }
      imagen_inicio.visible = false;
      
    }

  }

  agregarAnimaciones(){

    this.anims.create({

      key: 'perdio_jugador',
      frames: this.anims.generateFrameNumbers('jugador_perder', { start: 0, end: 23 }),
      frameRate: 10,
      repeat: 0

    })

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

  }

}