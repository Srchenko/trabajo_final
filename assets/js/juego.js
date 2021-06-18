var config = {
  type: Phaser.WEBGL,
  width: 504,
  height: 896,
  physics: {
      default: 'arcade',
      arcade: {
          tileBias: 32,
          gravity: { y: 700 },
          debug: true
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
var texto_puntuacion;

var camara;
var bordes_mapa;
var bordes_invisibles;
var plataformas_rompibles;
var plataformas_no_rompibles;

var balas;
var ultimo_disparo = 0;
var Bala;

var dron;

var animacion_jugador_suelo;
var animacion_jugador_aire;

var vida;
var jugador_overlap;
var espera_un_segundo_capo = 0;

var game = new Phaser.Game(config);
window.focus();