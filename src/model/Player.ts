import { shuffleDeck } from '../Store';
import Card from './Card';

export interface PlayerConfig {
  name: string;
  hand: number[];
  mana: number;
  health: number;
  deck: number[];
}

export default class Player {
  private readonly STARTER_HEALTH: number = 30;
  private _health: number;

  private readonly MAX_MANA: number = 10;
  private readonly STARTER_MANA_SLOT: number = 0;
  private _manaSlot: number;
  private readonly STARTER_MANA: number = 0;
  private _mana: number;

  private _hand: Card[];
  private readonly STARTER_DECK: Card[];
  private _deck: Card[];

  private readonly _name: string;

  constructor({ name, hand, health, mana, deck }: PlayerConfig) {
    this._name = name;
    this._health = health;

    this._hand = hand.map((elem) => {
      return new Card(elem);
    });

    this._deck = deck.map((elem) => {
      return new Card(elem);
    });

    this.STARTER_DECK = [...this._deck];

    this._mana = mana;
    this._manaSlot = 0;
  }

  public get name(): string {
    return this._name;
  }

  public get health(): number {
    return this._health;
  }

  public get hand(): Card[] {
    return [...this._hand];
  }

  public get deckSize(): number {
    return this._deck.length;
  }

  public get mana(): number {
    return this._mana;
  }

  public get manaSlot(): number {
    return this._manaSlot;
  }

  public dealDamage(value: number): void {
    this._health -= value;
  }

  public heal(value: number): void {
    this._health = Math.min(this.health + value, this.STARTER_HEALTH);
  }

  public getCard(index: number): Card {
    return this._hand.splice(index, 1)[0];
  }

  public refillMana(): void {
    this._mana = this._manaSlot;
  }

  public increaseManaSlot(): void {
    this._manaSlot = Math.min(this._manaSlot + 1, this.MAX_MANA);
  }

  public spendMana(manaCost: number): void {
    this._mana -= manaCost;
  }

  public canCast(index: number): boolean {
    return this.hand[index].manaCost <= this._mana;
  }

  public drawToHand(): Card | undefined {
    return this._deck.shift();
  }

  public addCardInHand(card: Card): void {
    if (this._hand.length < 5) {
      this._hand.push(card);
    }
  }

  public isDeath(): boolean {
    return this._health <= 0;
  }

  reset(): void {
    this._health = this.STARTER_HEALTH;
    this._mana = this.STARTER_MANA;
    this._manaSlot = this.STARTER_MANA_SLOT;
    this._deck = shuffleDeck(this.STARTER_DECK);
    this._hand = [];
  }
}
