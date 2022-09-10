import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { WalletTransaction } from '../../../../utility/wallet.transaction';
import { ActionManagerService } from '../../services/action-manager.service';
import { TransactionEditorService } from '../../services/transaction-editor.service';
import { ButtonsService, BtnFilter } from '../../services/buttons.service';

const DAY = 24 * 60 * 60 * 1000;

@Component({
  selector: 'wallet-action',
  templateUrl: './wallet-action.component.html',
  styleUrls: ['./wallet-action.component.scss']
})
export class WalletActionComponent implements OnInit {

  get initTransaction(): WalletTransaction {
    return this.transactionEditor.currentTransaction$.getValue() as never;
  }
  // @Input() public isNew: boolean;
  // @Output() public save: EventEmitter<WalletTransaction> = new EventEmitter<WalletTransaction>();
  // @Output() public cancel: EventEmitter<any> = new EventEmitter<any>();
  public isOpened: boolean;
  public transEdited: WalletTransaction = null as never;
  private baseValue: number = 0;
  private transId: number = 0;
  public minDate: Date;
  public maxDate: Date;
  public date: Date = null as never;
  public description: string = '';
  public valueChange: number = 0;
  private resolve : (value: WalletTransaction)=>void = null as never;
  private reject: (reason?:any)=>void = null as never;

  constructor(private actionManager: ActionManagerService,
              private transactionEditor: TransactionEditorService,
              private buttonSrv: ButtonsService) {
      // init state and events
      this.isOpened = false;
      this.transactionEditor.onEditTransaction(this.editTransaction.bind(this));
      this.buttonSrv.cancel.onClick(() => this.onCancel());
      this.buttonSrv.save.onClick(()=> this.onSave());
      this.buttonSrv.cancel.visible = true;
      this.buttonSrv.save.visible = true;
      
      // set minDate and maxDate
      var now: number = Date.now();
      var today: Date = new Date(now - now % DAY);
      this.maxDate = new Date(today);
      this.minDate = new Date(today);
      var month = this.minDate.getMonth() - 1;
      if (month < 0) {
        this.minDate.setMonth(11);
        this.minDate.setFullYear(this.minDate.getFullYear() - 1);
      } else {
        this.minDate.setMonth(month);
      }
      this.minDate.setDate(1);
  }

  private editTransaction(trans: WalletTransaction, isNew: boolean) : Promise<WalletTransaction> {
    if ( this.isOpened ) {
      return new Promise<WalletTransaction>((resolve,reject)=>reject('cannt edit transaction while editor already opened'));
    }
    let savedFilter = this.buttonSrv.filter;
    this.buttonSrv.filter = BtnFilter.SAVE | BtnFilter.CANCEL;
    this.buttonSrv.save.text = (isNew)?'הוסף':'שמור';
    let p = new Promise<WalletTransaction>((resolve,reject)=>{
      this.isOpened = true;
      this.transEdited = trans;
      this.baseValue = trans.total - trans.value;
      this.valueChange = trans.value;
      this.transId = trans.id;
      this.date = trans.date;
      this.description = trans.description;
      this.resolve = resolve;
      this.reject = reject;
    });
    p.then(()=>{
      this.isOpened = false;
      this.resolve = this.reject = null as never;
      this.buttonSrv.filter = savedFilter;
    },()=>{
      this.isOpened = false;
      this.resolve = this.reject = null as never;
      this.buttonSrv.filter = savedFilter;
    });
    return p;
  }

  onCancel() {
    if ( this.reject ) {
      this.reject("cancelled");
    }
  }

  onSave() {
    if ( this.resolve ) {
      let t = new WalletTransaction(
        this.transId,
        this.date,
        this.description,
        this.valueChange,
        this.total
      );
      console.log('resolving transaction', t);
      this.resolve(t);
    }
  }

  ngOnInit() {
    // if (this.initTransaction) {
    //   let initDate = this.initTransaction.date;
    //   if (initDate && initDate >= this.minDate && initDate <= this.maxDate) {
    //     this.date = initDate;
    //   }
    //   this.valueChange = (this.initTransaction.value) ? this.initTransaction.value : 0;
    //   this.baseValue = (this.initTransaction.total) ? this.initTransaction.total - this.valueChange : 0;
    //   this.description = (this.initTransaction.description) ? this.initTransaction.description : '';
    // }

    // // Initialize event listeners:
    // this.actionManager.cancelEvent.subscribe(() => {
    //   this.transactionEditor.currentTransaction$.next(null);
    // });
    // this.actionManager.saveEvent.subscribe(() => {
    //   this.transactionEditor.currentTransaction$.next(
    //     // TODO: find a better way to get the id
    //     new WalletTransaction(this.actionManager.nextId, this.date, this.description, this.valueChange, this.total));
    // });
  }

  // public get saveText(): string {
  //   return (this.isNew) ? 'הוסף' : 'שמור';
  // }

  public get total(): number {
    let total = Math.round((1 * this.baseValue + 1 * this.valueChange) * 10) / 10;
    return total;
  }

  // public onCancelClicked() {
  //   this.reject('caceled');
  //   this.cancel.emit(undefined);
  // }
}