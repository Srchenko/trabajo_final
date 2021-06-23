class Fin_juego extends Phaser.Scene {

  constructor () {

    super('fin_juego');

  }

  create(){

    this.add.image(0, 0, 'fin_juego').setOrigin(0);

    //  se pone la información del juego del nivel anterior del que se perdió
    let informacion = this.add.rexBBCodeText(config.width / 2, config.height / 2, '[b]Vidas: [/b]' + vidas_jugador_fin_juego + ' vidas\n[b]Puntuación: [/b]' + puntos_inicial + ' puntos\n[b]Tiempo restante: [/b]' + tiempo_inicial + ' segundos', { align: 'center', fontFamily: 'Helvetica', fill: '#000', fontSize: '25px'});
    informacion.setOrigin(0.5);

    //  se crea un botón que reinicia el nivel anterior del que se perdió
    let reiniciar = this.add.rexBBCodeText(config.width / 2, config.height / 2 + 300, '[b]REINICIAR[/b]', { align: 'center', fontFamily: 'Helvetica', fill: '#000', fontSize: '40px'});
    reiniciar.setOrigin(0.5);

    reiniciar.setInteractive();

    reiniciar.on('pointerover', () => {
      reiniciar.setFill('#666');
    })
    reiniciar.on('pointerout', () => {
      reiniciar.setFill('#000');
    })
    reiniciar.on('pointerdown', () => {
      this.reiniciarAtributos();
      this.scene.start('nivel_2');
    })

    //  se crea un botón que vuelve al menú principal
    let volver_menu = this.add.rexBBCodeText(config.width / 2, config.height / 2 + 350, '[b]VOLVER AL MENÚ[/b]', { align: 'center', fontFamily: 'Helvetica', fill: '#000', fontSize: '40px'});
    volver_menu.setOrigin(0.5);

    volver_menu.setInteractive();

    volver_menu.on('pointerover', () => {
      volver_menu.setFill('#666');
    })
    volver_menu.on('pointerout', () => {
      volver_menu.setFill('#000');
    })
    volver_menu.on('pointerdown', () => {
      this.reiniciarAtributos();
      this.scene.start('menu_principal');
    })

  }

  //  estos atributos puestos en la configuración global del juego deben reiniciarse para que los niveles empiecen siempre de la misma manera porque fueron modificados en la partida anterior
  reiniciarAtributos(){

    tiempo_inicial = 60;
    puntos_inicial = 0;
    tiempo_segundo_frames = 1000;
    ultimo_disparo = 0;
    tiempo_texto_pantalla = 2000;
    espera_un_segundo_capo = 0;

  }

}