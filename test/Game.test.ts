import { expect } from '@jest/globals';
import { Game } from '../src/model/Game';
import { type StoreProps, createDefaultProps } from '../src/Store';
import Player from '../src/model/Player';

describe('Game', () => {
  test('should reset Game', () => {
    const props: StoreProps = createDefaultProps();
    const player1: Player = new Player(props.player1Config);
    const player2: Player = new Player(props.player2Config);
    const game: Game = new Game(
      props.isAggressiveAI,
      props.shouldStartInitProcess,
      player1,
      player2
    );
    for (let index = 0; index <= 50; index++) {
      game.pass();
    }
    game.reset();

    expect(player1.health).toBe(30);
    expect(player1.hand.length).toBe(3);
    expect(player1.deckSize).toBe(17);
    expect(player1.mana).toBe(1);
    expect(player1.manaSlot).toBe(1);

    expect(player2.health).toBe(30);
    expect(player2.hand.length).toBe(4);
    expect(player2.deckSize).toBe(16);
    expect(player2.mana).toBe(0);
    expect(player2.manaSlot).toBe(0);
  });
});
