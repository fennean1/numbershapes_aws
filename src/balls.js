// https://github.com/photonstorm/phaser/issues/3532


import React, { Component } from 'react';
import Phaser from 'phaser';
import Script from 'react-load-script';

export default class MyBalls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null
    };

    this.game = null;
  }


  handleScriptLoad() {

    this.setState({config:  {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: '#1d1d1d',
        parent: 'balls',
        physics: {
            default: 'matter',
            matter: {
                enableSleeping: true

            }
        },
        scene: {
            preload: this.preload,
            create: this.create,
        }
    } });

    this.game = new Phaser.Game(this.state.config);

  }

  preload ()
  {
      this.load.image('ball', 'assets/sprites/pangball.png');
  }

  create()
  {
      this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);

      //  Add in a stack of balls

      for (var i = 0; i < 64; i++)
      {
          var ball = this.matter.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(-600, 0), 'ball');
          ball.setCircle();
          ball.setFriction(0.005);
          ball.setBounce(1);
      }
  }



  render() {
    return (
      <section>
        <Script
          url="//cdn.jsdelivr.net/npm/phaser@3.3.0/dist/phaser.min.js"
          onLoad={() => this.handleScriptLoad()}
        />
        <div id="balls" className="balls" />
      </section>
    );
  }
}
