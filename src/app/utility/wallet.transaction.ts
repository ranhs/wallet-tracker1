export class WalletTransaction {
  constructor(
    private _id: number = null as never,
    private _date: Date = null as never,
    private _description: string = null as never,
    private _value: number = null as never,
    private _total: number = null as never) {
  }

  public get id(): number {
    return this._id;
  }

  public get date(): Date {
    return this._date;
  }

  private dd(val: number): string {
    return `${(val < 10) ? '0' : ''}${val}`;
  }

  private date2string(date: Date): string {
    return `${this.dd(date.getDate())}/${this.dd(date.getMonth() + 1)}/${date.getFullYear()}`;
  }

  public get displayDate(): string {
    return `${this.date2string(this._date)}`;
  }

  public get description(): string {
    return this._description;
  }

  public get value(): number {
    return this._value;
  }

  public get displayValue(): string {
    return `${(this._value > 0) ? '+' : ''}${this._value}`;
  }

  public get total(): number {
    return this._total;
  }

  private _prev_id: number = undefined as never;

  public get prev_id(): number {
    return this._prev_id;
  }

  public rename(new_id: number) {
    this._prev_id = this.id;
    this._id = new_id;
  }

  public adjustTotal(gap: number) {
    this._total += gap;
    this._total = Math.round(this._total * 10) / 10;
  }
}