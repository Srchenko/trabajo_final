class Juego_superado extends Phaser.Scene {

  constructor () {

    super('juego_superado');

  }

  create(){

    this.add.image(0, 0, 'menu_principal').setOrigin(0);

    musica_carga = this.sound.add('musica_juego_superado', {volume: 0.2, loop: true});
    musica_carga.play();

    let titulo = this.add.rexBBCodeText(config.width / 2, 100, '[b]¡GANASTE![/b]', { align: 'center', fontFamily: 'Helvetica', fill: '#000', fontSize: '60px'});
    titulo.setOrigin(0.5);

    let texto_puntuacion = '[b]Puntuación Nivel 1: [/b]' + puntuacion_maxima[0] + ' puntos\n\n[b]Puntuación Nivel 2: [/b]' + puntuacion_maxima[1] + ' puntos';
    let texto_puntuacion_2 = this.add.rexBBCodeText(config.width / 2, config.height / 2, texto_puntuacion, { align: 'center', fontFamily: 'Helvetica', fill: '#000', fontSize: '30px'});
    texto_puntuacion_2.setOrigin(0.5);

    //  se hace un botón para continuar a créditos
    let volver = this.add.rexBBCodeText(config.width / 2, config.height / 2 + 350, '[b]CONTINUAR[/b]', { align: 'center', fontFamily: 'Helvetica', fill: '#00f', fontSize: '40px'});
    volver.setOrigin(0.5);

    volver.setInteractive();

    volver.on('pointerover', () => {
      volver.setFill('#CCC');
    })
    volver.on('pointerout', () => {
      volver.setFill('#00f');
    })
    volver.on('pointerdown', () => {
      this.reiniciarAtributos();
      sonido_interactuar_mouse.play();
      this.scene.start('creditos');
    })

  }

  //  estos atributos puestos en la configuración global del juego deben reiniciarse para que los niveles empiecen siempre de la misma manera porque fueron modificados en la partida anterior
  reiniciarAtributos(){

    nivel_uno_jugado = true;
    tiempo_hasta_juego_superado = -2000;
    temporizador_carga = 3000;
    tiempo_inicial = 60;
    puntos_inicial = 0;
    tiempo_segundo_frames = 1000;
    ultimo_disparo = 0;
    tiempo_texto_pantalla = 2000;
    espera_un_segundo_capo = 0;
    puntuacion_maxima = [0, 0];

  }

}