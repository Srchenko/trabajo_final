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
  scene: [Menu_Principal, Nivel_1],
  audio: {
      disableWebAudio: true
  },
  parent: "parent"
};

var jugador;
var plataformas;
var cursores;
var puntuacion = 0;
var fin_juego = false;

var camara;
var bordes_invisibles;
var plataformas_rompibles;
var plataformas_no_rompibles;

var balas;
var ultimo_disparo = 0;
var Bala;

var dron;
var items;

var animacion_jugador_suelo;
var animacion_jugador_aire;

var vida;
var texto_objeto_puntos;
var tiempo_texto_pantalla = 2000;
var jugador_overlap;
var espera_un_segundo_capo = 0;

var fondo_hud;

var texto_puntos;
var puntos_inicial = 0;
var puntos;

var texto_vidas;

var texto_tiempo;
var tiempo_inicial = 60;
var tiempo_segundo_frames = 1000;

var musica;

var game = new Phaser.Game(config);
window.focus();