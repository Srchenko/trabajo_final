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
var texto_puntuacion;

var camara;
var bordes_mapa;
var plataformas_rompibles;
var plataformas_no_rompibles;

var balas;
var ultimo_disparo = 0;
var Bala;

var dron;

var animacion_jugador_suelo;
var animacion_jugador_aire;

var tecla_espacio = false;
var tecla_arriba = false;

var game = new Phaser.Game(config);
window.focus();