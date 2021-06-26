class Creditos extends Phaser.Scene {

  constructor () {

    super('creditos');

  }

  create(){

    if(juego_superado){

      musica = this.sound.add('musica_menu_principal', {volume: 0.2, loop: true});
      
    }

    this.add.image(0, 0, 'menu_principal').setOrigin(0);

    let titulo = this.add.rexBBCodeText(config.width / 2, 100, '[b]CRÉDITOS[/b]', { align: 'center', fontFamily: 'Helvetica', fill: '#000', fontSize: '60px'});
    titulo.setOrigin(0.5);

    //  texto mostrando las personas y organizaciones que participaron en el desarrollo del juego
    let texto_creditos = '[size=20]Universidad[/size]\n[size=24][b]UNRaf[/b][/size]\n\n[size=20]Team Reptiliano[/size]\n[size=24][b]Leandro Airaudo\nSergio Bressán[/b][/size]\n\n[size=20]Música[/size]\n[size=24][b]"Complexity Kills" by Lunar,\nused under CC BY /\nDesaturated from original\n\n[/b][/size][size=20]Team Sacachisperos (Easter Egg)[/size]\n[size=24][b]Valentín Frare\nMariano Trevisán\n\n[/b][/size][size=20]Tester[/size]\n[size=24][b]Sebastián Nazzetta\n\n[/b][/size]';
    let creditos = this.add.rexBBCodeText(config.width / 2, config.height / 2, texto_creditos, { align: 'center', fontFamily: 'Helvetica', fill: '#000', lineSpacing: 8});
    creditos.setOrigin(0.5);

    //  se hace un botón para volver al menú principal
    let volver = this.add.rexBBCodeText(config.width / 2, config.height / 2 + 350, '[b]VOLVER AL MENÚ[/b]', { align: 'center', fontFamily: 'Helvetica', fill: '#00f', fontSize: '40px'});
    volver.setOrigin(0.5);

    volver.setInteractive();

    volver.on('pointerover', () => {
      volver.setFill('#CCC');
    })
    volver.on('pointerout', () => {
      volver.setFill('#00f');
    })
    volver.on('pointerdown', () => {

      if(juego_superado){

        musica_carga.stop();
        juego_superado = false;

      }

      sonido_interactuar_mouse.play();
      this.scene.start('menu_principal');
    })

  }

}