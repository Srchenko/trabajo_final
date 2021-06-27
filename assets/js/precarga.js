class Precarga extends Phaser.Scene {

  constructor () {

    super('precarga');

  }

  preload(){
    
    var loadingText = this.make.text({
      x: 252,
      y: 448,
      text: 'CARGANDO',
      style: {
          font: '50px monospace',
          fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

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
    this.load.image('fondo_carga_nivel', 'assets/images/fondo_carga_nivel.png');
    

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
    this.load.image('pared_invisible_vertical', 'assets/images/pared_invisible_vertical.png');
    this.load.image('baston', 'assets/images/baston.png');
    this.load.image('robot_definitivo', 'assets/images/robot_definitivo.png');

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
    this.load.spritesheet('robot', 'assets/images/robot.png', { frameWidth: 34.75, frameHeight: 50});


    //  se carga los tiles de un tilemap
    this.load.tilemapTiledJSON('level_1', 'assets/js/nivel_1.json');
    this.load.tilemapTiledJSON('level_2', 'assets/js/nivel_2.json');

    //  se carga la música y los sonidos
    this.load.audio('musica_nivel_1', 'assets/audio/musica_nivel_1.mp3');
    this.load.audio('musica_nivel_2', 'assets/audio/musica_nivel_2.mp3');
    this.load.audio('musica_carga', 'assets/audio/musica_carga.mp3');
    this.load.audio('musica_fin_juego', 'assets/audio/musica_fin_juego.mp3');
    this.load.audio('musica_menu_principal', 'assets/audio/musica_menu_principal.mp3');
    this.load.audio('musica_juego_superado', 'assets/audio/musica_juego_superado.mp3');

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
    this.load.audio('dialogo_reptiliano_nivel_1', 'assets/audio/dialogo_reptiliano_nivel_1.mp3');
    this.load.audio('dialogo_reptiliano_nivel_2', 'assets/audio/dialogo_reptiliano_nivel_2.mp3');

  }

  create(){

    //localStorage.removeItem(guardado_local_nivel_1);
    //localStorage.removeItem(guardado_local_nivel_2);

    if(localStorage.getItem(guardado_local_nivel_1) == null) {

      puntuacion_maxima_definitiva[0] = 0;

    }
    else {

      puntuacion_maxima_definitiva[0] = parseInt(localStorage.getItem(guardado_local_nivel_1));

    }

    if(localStorage.getItem(guardado_local_nivel_2) == null) {

      puntuacion_maxima_definitiva[1] = 0;

    }
    else {

      puntuacion_maxima_definitiva[1] = parseInt(localStorage.getItem(guardado_local_nivel_2));

    }

    this.scene.start('menu_principal');

  }

}