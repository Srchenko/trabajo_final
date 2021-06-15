var config = {
  type: Phaser.WEBGL,
  width: 504,
  height: 896,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 700 },
          debug: false
      }
  },
  scene: [Nivel_1],
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
var posicion_y_salto = 0;

var game = new Phaser.Game(config);
window.focus();