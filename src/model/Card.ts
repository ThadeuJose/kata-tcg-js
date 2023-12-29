export default class Card {
  private readonly _manaCost: number;

  constructor(value: number) {
    this._manaCost = value;
  }

  public get manaCost(): number {
    return this._manaCost;
  }

  public get damageValue(): number {
    return this._manaCost;
  }

  public get healingValue(): number {
    return this._manaCost;
  }
}
