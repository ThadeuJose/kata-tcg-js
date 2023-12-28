import type Card from './Card';
import Player, { type PlayerConfig } from './Player';

export interface CardState {
  manaCost: number;
}

export interface PlayerState {
  health: number;
  hand: CardState[];
  mana: number;
  manaSlot: number;
  deckSize: number;
}

export interface GameState {
  player1: PlayerState;
  player2: PlayerState;
  log: string[];
}

export class Game {
  private readonly PLAYER_1_NAME: string = 'Player 1';
  private readonly PLAYER_2_NAME: string = 'Player 2';
  private readonly _player1: Player;
  private readonly _player2: Player;

  private readonly _log: string[];
  private readonly isAggressiveAI: boolean;

  private _activePlayer: Player;

  constructor(
    isAggressiveAI: boolean,
    shouldStartInitProcess: boolean,
    player1Config: PlayerConfig,
    player2Config: PlayerConfig
  ) {
    this._player1 = new Player(this.PLAYER_1_NAME, player1Config);
    this._player2 = new Player(this.PLAYER_2_NAME, player2Config);
    this._activePlayer = this._player1;
    this._log = [];
    this.isAggressiveAI = isAggressiveAI;
    if (shouldStartInitProcess) {
      this.init();
    }
  }

  init(): void {
    this._activePlayer.draw(3);
    // const nonActivePlayer =
    //   this._activePlayer.name === this.PLAYER_1_NAME ? this._player2 : this._player1;
    // nonActivePlayer.draw(4);

    this._activePlayer.increaseManaSlot();
    this._activePlayer.refillMana();
  }

  canCast(index: number): boolean {
    return this._player1.canCast(index);
  }

  play(index: number): void {
    this.playDamageCard(this._player1, index, this._player2);
  }

  pass(): void {
    this.passAction();
    if (this.isAggressiveAI) {
      this.playDamageCard(this._player2, 0, this._player1);
    }
    this.passAction();
  }

  private passAction(): void {
    this._log.push(`${this._activePlayer.name} pass`);
    this._activePlayer =
      this._activePlayer.name === this.PLAYER_1_NAME ? this._player2 : this._player1;
    this._activePlayer.draw();
    this._activePlayer.increaseManaSlot();
    this._activePlayer.refillMana();
  }

  private playDamageCard(owner: Player, index: number, target: Player): void {
    const card: Card = owner.getCard(index);
    const damageValue = card.damageValue;
    const manaCost = card.manaCost;

    target.dealDamage(damageValue);
    owner.spendMana(manaCost);
    this._log.push(`${owner.name} deal ${card.damageValue} damage to ${target.name}`);
  }

  getState(): GameState {
    return {
      player1: {
        health: this._player1.health,
        hand: this._player1.hand.map((elem) => {
          return { manaCost: elem.manaCost };
        }),
        mana: this._player1.mana,
        manaSlot: this._player1.manaSlot,
        deckSize: this._player1.deckSize
      },
      player2: {
        health: this._player2.health,
        hand: [],
        mana: this._player2.mana,
        manaSlot: this._player2.manaSlot,
        deckSize: this._player2.deckSize
      },
      log: [...this._log]
    };
  }
}