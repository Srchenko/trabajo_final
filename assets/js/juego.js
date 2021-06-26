var config = {
  type: Phaser.WEBGL,
  width: 504,
  height: 896,
  physics: {
      default: 'arcade',
      arcade: {
          tileBias: 32,
          gravity: { y: 700 },
          debug: false
      }
  },
  scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 504,
        height: 896
    },
  scene: [Precarga, Menu_Principal, Creditos, Nivel_1, Nivel_2, Fin_juego, Juego_superado],
  audio: {
      disableWebAudio: true
  },
  parent: "parent"
};

var nivel_uno_jugado = true;
var nivel_uno_jugado_primera_vez = true;
var juego_superado;
var puntuacion_maxima = [0, 0];
var jugador;
var plataformas;
var cursores;
var fondo_carga_nivel;
var texto_carga_nivel;
var temporizador_carga = 3000;

var camara;
var bordes_invisibles;
var bordes_invisibles_enemigo;
var plataformas_rompibles;
var plataformas_no_rompibles;

var balas;
var balas_torreta;
var ultimo_disparo = 0;
var cadencia_de_fuego = 2000;
var Bala;
var Bala_torreta;

var dron;
var robot;
var items;
var torreta;
var torreta_disparo_izquierda;
var activar_torreta;
var max_ang;
var cuadrante;

var animacion_jugador_suelo;
var animacion_jugador_aire;

var vida;
var texto_objeto_puntos;
var tiempo_texto_pantalla = 2000;
var jugador_overlap;
var jugador_overlap_robot;
var espera_un_segundo_capo = 0;

var fondo_hud;

var texto_puntos;
var puntos_inicial = 0;
var puntos;

var texto_vidas;
var vidas_jugador_fin_juego;

var texto_tiempo;
var tiempo_inicial = 60;
var tiempo_segundo_frames = 1000;
var tiempo_finalizado = false;
var tiempo_hasta_juego_superado = -2000;

var musica;
var musica_carga;
var dialogo_reptiliano;
var sonido_salto_personaje;
var sonido_caida_personaje;
var sonido_disparo_personaje;
var sonido_disparo_torreta;
var sonido_danio_personaje;
var sonido_danio_enemigo;
var sonido_enemigo_destruido;
var sonido_plataforma_rompible_destruida;
var sonido_muerte_personaje;
var sonido_juntar_moneda;
var sonido_juntar_cronometro;
var sonido_interactuar_mouse;
var sonido_juntar_vida;

var imagen_inicio;
var presiona_cualquier_tecla;

var guardado_local_nivel_1 = "guardado_local_nivel_1";
var guardado_local_nivel_2 = "guardado_local_nivel_2";
var puntuacion_maxima_definitiva = [0, 0];

var game = new Phaser.Game(config);
window.focus();