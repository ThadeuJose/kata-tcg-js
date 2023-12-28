import { expect } from '@jest/globals';
import { Game, findIndexOfMaxLesserThen } from '../src/model/Game';
import { type StoreProps, createDefaultProps } from '../src/Store';
import Player from '../src/model/Player';

describe('AI', () => {
  test('should return max mana cost allow to cast', () => {
    const actual: number = findIndexOfMaxLesserThen([0, 2, 4, 3], 4);
    expect(actual).toBe(2);
  });

  test('should return max mana cost allow', () => {
    const actual: number = findIndexOfMaxLesserThen([8, 5, 6, 7], 4);
    expect(actual).toBe(-1);
  });

  test('should play two card in turn', () => {
    const testProps: StoreProps = createDefaultProps();
    testProps.player1Config.hand = [1];
    testProps.player1Config.mana = 0;
    testProps.player1Config.health = 8;
    testProps.player1Config.deck = [1];

    testProps.player2Config.hand = [4, 4];
    testProps.player2Config.mana = 8;
    testProps.shouldStartInitProcess = false;
    testProps.isAggressiveAI = true;
    const player1: Player = new Player(testProps.player1Config);
    const player2: Player = new Player(testProps.player2Config);

    const game: Game = new Game(
      testProps.isAggressiveAI,
      testProps.shouldStartInitProcess,
      player1,
      player2
    );
    game.AITurn();

    expect(player1.health).toBe(0);
    const log: string[] = game.getState().log;
    expect(log[0]).toBe('Player 2 deal 4 damage to Player 1');
    expect(log[1]).toBe('Player 2 deal 4 damage to Player 1');
    expect(log[2]).toBe('Player 2 wins');
  });
});
