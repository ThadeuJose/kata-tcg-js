import Card from './Card';

export interface PlayerConfig {
  hand: number[];
  mana: number;
  deck: number[];
}

export default class Player {
  private readonly STARTER_HEALTH: number = 30;
  private _health: number;

  private readonly MAX_MANA: number = 10;
  private _manaSlot: number;
  private _mana: number;

  private readonly _hand: Card[];
  private readonly _deck: Card[];

  private readonly _name: string;

  constructor(name: string, { hand, mana, deck }: PlayerConfig) {
    this._name = name;
    this._health = this.STARTER_HEALTH;

    this._hand = hand.map((elem) => {
      return new Card(elem);
    });

    this._deck = deck.map((elem) => {
      return new Card(elem);
    });

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

  public draw(amount: number = 1): void {
    for (let index = 0; index < amount; index++) {
      const card = this._deck.shift();
      if (card !== undefined) {
        this._hand.push(card);
      }
    }
  }
}
