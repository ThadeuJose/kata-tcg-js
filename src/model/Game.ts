import type Card from './Card';
import type Player from './Player';

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
  private readonly _player1: Player;
  private readonly _player2: Player;

  private _log: string[];
  private readonly isAggressiveAI: boolean;

  private _activePlayer: Player;

  private _isPlaying: boolean;

  constructor(
    isAggressiveAI: boolean,
    shouldStartInitProcess: boolean,
    player1: Player,
    player2: Player
  ) {
    this._player1 = player1;
    this._player2 = player2;
    this._activePlayer = this._player1;
    this._log = [];
    this.isAggressiveAI = isAggressiveAI;
    this._isPlaying = true;
    if (shouldStartInitProcess) {
      this.init();
    }
  }

  init(): void {
    this.drawAction(this._activePlayer, 3);
    const nonActivePlayer =
      this._activePlayer.name === this._player1.name ? this._player2 : this._player1;
    this.drawAction(nonActivePlayer, 4);

    this._activePlayer.increaseManaSlot();
    this._activePlayer.refillMana();
  }

  reset(): void {
    this._activePlayer = this._player1;
    this._log = [];
    this._isPlaying = true;

    this._player1.reset();
    this._player2.reset();

    this.init();
  }

  canCast(index: number): boolean {
    return this._player1.canCast(index);
  }

  play(index: number): void {
    this.playDamageCard(this._player1, index, this._player2);
  }

  heal(index: number): void {
    const owner: Player = this._player1;
    const card: Card = owner.getCard(index);
    const healingValue = card.healingValue;
    const manaCost = card.manaCost;

    owner.spendMana(manaCost);
    owner.heal(healingValue);
    this._log.push(`${owner.name} heal ${healingValue} damage`);
  }

  pass(): void {
    this.passAction();
    this.AITurn();
  }

  public AITurn(): void {
    if (this.isAggressiveAI) {
      let index: number = this.AIFindIndexOfMostPowerfulCard();
      while (index !== -1 && this._isPlaying) {
        this.playDamageCard(this._player2, index, this._player1);
        index = this.AIFindIndexOfMostPowerfulCard();
      }
    }
    if (this._isPlaying) {
      this.passAction();
    }
  }

  private AIFindIndexOfMostPowerfulCard(): number {
    return findIndexOfMaxLesserThen(
      this._player2.hand.map((elem) => {
        return elem.manaCost;
      }),
      this._player2.mana
    );
  }

  private passAction(): void {
    this._log.push(`${this._activePlayer.name} pass`);
    this._activePlayer =
      this._activePlayer.name === this._player1.name ? this._player2 : this._player1;
    this.drawAction(this._activePlayer);
    this._activePlayer.increaseManaSlot();
    this._activePlayer.refillMana();
  }

  private drawAction(player: Player, amount: number = 1): void {
    for (let index = 0; index < amount; index++) {
      const card: Card | undefined = player.drawToHand();
      if (card === undefined) {
        player.dealDamage(1);
        this._log.push(`${player.name} receive 1 damage`);
        this.checkIfGameEnded();
      } else {
        player.addCardInHand(card);
      }
    }
  }

  private checkIfGameEnded(): void {
    if (this._player1.isDeath()) {
      const otherPlayer: Player = this._player2;
      this._log.push(`${otherPlayer.name} wins`);
      this._isPlaying = false;
    }
    if (this._player2.isDeath()) {
      const otherPlayer: Player = this._player1;
      this._log.push(`${otherPlayer.name} wins`);
      this._isPlaying = false;
    }
  }

  private playDamageCard(owner: Player, index: number, target: Player): void {
    const card: Card = owner.getCard(index);
    const damageValue = card.damageValue;
    const manaCost = card.manaCost;

    owner.spendMana(manaCost);
    target.dealDamage(damageValue);
    this._log.push(`${owner.name} deal ${damageValue} damage to ${target.name}`);
    this.checkIfGameEnded();
  }

  public isPlaying(): boolean {
    return this._isPlaying;
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
        hand: this._player2.hand.map((elem) => {
          return { manaCost: elem.manaCost };
        }),
        mana: this._player2.mana,
        manaSlot: this._player2.manaSlot,
        deckSize: this._player2.deckSize
      },
      log: [...this._log]
    };
  }
}

export function findIndexOfMaxLesserThen(array: number[], x: number): number {
  let index: number = -1;
  let maxLesser: number = -1;

  for (let i = 0; i < array.length; i++) {
    if (array[i] <= x && array[i] > maxLesser) {
      maxLesser = array[i];
      index = i;
    }
  }

  return index;
}
