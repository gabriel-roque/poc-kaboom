import kaboom from 'kaboom';
import * as React from 'react';

export const Game: React.FC = () => {
  React.useEffect(() => {
    const canvasRef = document.querySelector('#game') as HTMLCanvasElement;

    const k = kaboom({
      global: false,
      canvas: canvasRef,
    });

    canvasRef.width = 1000;
    canvasRef.height = 1000;

    k.debug.inspect = false;

    k.loadSprite('mario', './sprites/mario.png');

    let score = 0;

    k.scene('game', () => {
      const BASE_LINE = 300;

      // COMPONENTS
      const mario = k.add([
        k.sprite('mario'),
        k.pos(80, 630),
        k.area(),
        k.body(),
      ]);

      k.add([
        k.rect(k.width(), 48),
        k.pos(0, k.height() - BASE_LINE),
        k.outline(4),
        k.area(),
        k.solid(),
        k.color(127, 200, 255),
      ]);

      const scoreLabel = k.add([k.text(`Score: ${score}`), k.pos(24, 24)]);

      k.onUpdate(() => {
        score++;
        scoreLabel.text = `Score: ${score}`;
      });

      function spawnTree() {
        k.add([
          k.rect(48, k.rand(24, 64)),
          k.area(),
          k.outline(4),
          k.pos(k.width(), k.height() - BASE_LINE),
          k.origin('botleft'),
          k.color(255, 180, 255),
          k.move(k.LEFT, 240),
          'object',
        ]);
        k.wait(k.rand(1, 1.5), () => spawnTree());
      }

      spawnTree();

      // EVENTS
      k.onKeyPress('space', () => {
        if (mario.isGrounded()) mario.jump(700);
      });

      mario.onCollide('object', () => {
        k.shake(3);
        k.go('lose');
      });
    });

    k.scene('lose', () => {
      k.add([k.text('Game Over'), k.pos(k.center()), k.origin('center')]);
      k.add([
        k.text(`Score: ${score}`, { size: 45 }),
        k.pos(k.center().x, k.center().y + 100),
        k.origin('center'),
      ]);
    });

    k.go('game');
  }, []);

  return <></>;
};
