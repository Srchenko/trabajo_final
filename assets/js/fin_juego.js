class Fin_juego extends Phaser.Scene {

  constructor () {

    super('fin_juego');

  }

  create(){

    musica = this.sound.add('musica_fin_juego', {volume: 0.2, loop: true});
    musica.play();

    this.add.image(0, 0, 'fin_juego').setOrigin(0);

    //  se pone la información del juego del nivel anterior del que se perdió
    let informacion = this.add.rexBBCodeText(config.width / 2, config.height / 2, '[b]Vidas: [/b]' + vidas_jugador_fin_juego + ' vidas\n[b]Puntuación: [/b]' + puntos_inicial + ' puntos\n[b]Tiempo restante: [/b]' + tiempo_inicial + ' segundos', { align: 'center', fontFamily: 'Helvetica', fill: '#000', fontSize: '25px'});
    informacion.setOrigin(0.5);

    //  se crea un botón que reinicia el nivel anterior del que se perdió
    let reiniciar = this.add.rexBBCodeText(config.width / 2, config.height / 2 + 300, '[b]REINICIAR[/b]', { align: 'center', fontFamily: 'Helvetica', fill: '#00f', fontSize: '40px'});
    reiniciar.setOrigin(0.5);

    reiniciar.setInteractive();

    reiniciar.on('pointerover', () => {
      reiniciar.setFill('#666');
    })
    reiniciar.on('pointerout', () => {
      reiniciar.setFill('#00f');
    })
    reiniciar.on('pointerdown', () => {
      sonido_interactuar_mouse.play();
      musica.stop();
      this.reiniciarAtributos();

      if(nivel_uno_jugado){

        this.scene.start('nivel_1');

      }
      else{
        
        this.scene.start('nivel_2');

      }

    })

    //  se crea un botón que vuelve al menú principal
    let volver_menu = this.add.rexBBCodeText(config.width / 2, config.height / 2 + 350, '[b]VOLVER AL MENÚ[/b]', { align: 'center', fontFamily: 'Helvetica', fill: '#00f', fontSize: '40px'});
    volver_menu.setOrigin(0.5);

    volver_menu.setInteractive();

    volver_menu.on('pointerover', () => {
      volver_menu.setFill('#666');
    })
    volver_menu.on('pointerout', () => {
      volver_menu.setFill('#00f');
    })
    volver_menu.on('pointerdown', () => {
      sonido_interactuar_mouse.play();
      musica.stop();
      musica = this.sound.add('musica_menu_principal', {volume: 0.2, loop: true});
      this.reiniciarAtributos();
      this.scene.start('menu_principal');
    })

  }

  //  estos atributos puestos en la configuración global del juego deben reiniciarse para que los niveles empiecen siempre de la misma manera porque fueron modificados en la partida anterior
  reiniciarAtributos(){

    temporizador_carga = 3000;
    tiempo_hasta_juego_superado = -2000;
    tiempo_inicial = 60;
    puntos_inicial = 0;
    tiempo_segundo_frames = 1000;
    ultimo_disparo = 0;
    tiempo_texto_pantalla = 2000;
    espera_un_segundo_capo = 0;

  }

}