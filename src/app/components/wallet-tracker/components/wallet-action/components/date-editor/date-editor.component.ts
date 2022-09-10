import {
  Component,
  forwardRef,
  Input
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';

const DAY = 24 * 60 * 60 * 1000;

export const DATE_EDIT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateEditorComponent),
  multi: true
};

@Component({
  selector: 'date-editor',
  templateUrl: './date-editor.component.html',
  styleUrls: ['./date-editor.component.scss'],
  providers: [DATE_EDIT_CONTROL_VALUE_ACCESSOR]
})
export class DateEditorComponent implements ControlValueAccessor {
  @Input() public max: Date = null as never;
  @Input() public min: Date = null as never;

  private onChangeCallback :(innerValue: Date)=>void  = null as never;
  //private onTouchedCallback;

  private _innerValue: Date = null as never;

  constructor() {
  }

  private dd(val: number): string {
    return `${(val < 10) ? '0' : ''}${val}`;
  }

  public get dateStr(): string {
    var date: Date = this.innerValue;
    var dateStr: string = '';
    var month: string;

    if (!date) {
      return '';
    }
    switch (date.getMonth() + 1) {
      case 1:
        month = 'ינו';
        break;
      case 2:
        month = 'פבר';
        break;
      case 3:
        month = 'מרץ';
        break;
      case 4:
        month = 'אפר';
        break;
      case 5:
        month = 'מאי';
        break;
      case 6:
        month = 'יוני';
        break;
      case 7:
        month = 'יולי';
        break;
      case 8:
        month = 'אוג';
        break;
      case 9:
        month = 'ספט';
        break;
      case 10:
        month = 'אוקט';
        break;
      case 11:
        month = 'נוב';
        break;
      case 12:
        month = 'דצמ';
        break;
      default:
        month = '';
        break;
    }

    dateStr += `${date.getDate()}`;
    dateStr += ' ';
    dateStr += month;
    dateStr += ' ';
    dateStr += `${date.getFullYear()}`;

    return dateStr;
  }

  private onValueChange() {
    if (this.onChangeCallback) {
      this.onChangeCallback(this.innerValue);
    }
  }

  private get innerValue(): Date {
    return this._innerValue;
  }

  private set innerValue(value: Date) {
    if (this._innerValue !== value) {
      this._innerValue = value;
      this.onValueChange();
    }
  }

  public writeValue(value: Date) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  public registerOnChange(fn: (innerValue: Date) => void) {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any) {
    //this.onTouchedCallback = fn;
  }

  public get upEnabled(): boolean {
    return this.innerValue > this.min;
  }

  public get downEnabled(): boolean {
    return this.innerValue < this.max;
  }

  public upClicked() {
    this.innerValue = new Date(this.innerValue.valueOf() - DAY);
  }

  public downClicked() {
    this.innerValue = new Date(this.innerValue.valueOf() + DAY);
  }
}
