class Creditos extends Phaser.Scene {

  constructor () {

    super('creditos');

  }

  create(){

    this.add.image(0, 0, 'menu_principal').setOrigin(0);

    //  texto mostrando las personas y organizaciones que participaron en el desarrollo del juego
    let texto_creditos = '[size=20]Universidad[/size]\n[size=24][b]UNRaf[/b][/size]\n\n[size=20]Team Reptiliano[/size]\n[size=24][b]Leandro Airaudo\nSergio Bressán[/size][/b]\n\n[size=20]Música[/size]\n[size=24][b]"Bamboo Groove" by Lunar,\nused under CC BY /\nDesaturated from original\n\n[/b][/size]';
    let creditos = this.add.rexBBCodeText(config.width / 2, config.height / 2, texto_creditos, { align: 'center', fontFamily: 'Helvetica', fill: '#000', lineSpacing: 8});
    creditos.setOrigin(0.5);

    //  se hace un botón para volver al menú principal
    let volver = this.add.rexBBCodeText(config.width / 2, config.height / 2 + 350, '[b]VOLVER AL MENÚ[/b]', { align: 'center', fontFamily: 'Helvetica', fill: '#000', fontSize: '40px'});
    volver.setOrigin(0.5);

    volver.setInteractive();

    volver.on('pointerover', () => {
      volver.setFill('#CCC');
    })
    volver.on('pointerout', () => {
      volver.setFill('#000');
    })
    volver.on('pointerdown', () => {
      this.scene.start('menu_principal');
    })

  }

}