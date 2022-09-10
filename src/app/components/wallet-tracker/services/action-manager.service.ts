import {
  Injectable,
  EventEmitter,
  OnInit
} from '@angular/core';
import { WalletTransaction } from '../../../utility/wallet.transaction';
import { TransactionEditorService } from './transaction-editor.service';
import { ButtonsService } from './buttons.service';
import { TransactionServiceGen } from './transaction.service/transection.service.gen';
import { TransactionService } from './transaction.service/transaction.service';

@Injectable()
export class ActionManagerService implements OnInit {


  // TODO: make this property private
  /*private*/
  nextId: number = 1;
  transactionList: WalletTransaction[] = [];
  private _selected_id : number = 0;
  private transactionStorageSrv: TransactionService;

  // Event Emitters
  addEvent = new EventEmitter<null>();
  cancelEvent = new EventEmitter<null>();
  saveEvent = new EventEmitter<null>();

  constructor(
        private transactionEditor: TransactionEditorService,
        transactionStorageSrv: TransactionServiceGen,
        private buttonsSrv : ButtonsService) {

    this.transactionStorageSrv = transactionStorageSrv;
    transactionEditor.getNextId = () => this.nextId;
    transactionEditor.getLastTotal = () => this.lastTotal;
  }

  get selected_id() {
    return this._selected_id;
  }

  set selected_id(value: number) {
    this._selected_id = value;
    this.buttonsSrv.remove.visible = this.buttonsSrv.edit.visible = (value > 0);
  }

  // get isEditorShown$(): Observable<boolean> {
  //   return this.transactionEditor.showEditor$;
  // }

  // TODO: to be removed
  private get lastTotal(): number {
    if (this.transactionList.length > 0) {
      return this.transactionList[this.transactionList.length - 1].total;
    }
    return 0;
  }

  async editSelectedTransaction(): Promise<void> {
    if ( this.selected_id <=0 ) return;
    let index = this.findTransactionIndex(this.selected_id);
    if ( index < 0 ) return;
    return this.editTransactionOfIndex(index);
  }

  private findTransactionIndex(id: number) : number {
    for (let i=this.transactionList.length-1; i>=0; i--) {
      if ( this.transactionList[i].id === id ) {
        return i;
      }
    }
    return -1;
  }

  async deleteSelectedTransaction(): Promise<void> {
    if ( this.selected_id <=0 ) return;
    let index = this.findTransactionIndex(this.selected_id);
    if ( index < 0 ) return;
    await this.deleteTransactionOfIndex(index);
    this.selected_id = 0;
  }

  async addNewTransaction(): Promise<void> {
    this.selected_id = 0;
    try {
      const newTransaction: WalletTransaction = await this.transactionEditor.getNewTransaction();
      if (newTransaction) {
        this.insertTheNewTransaction(newTransaction);
      }
    } catch {
      // add transaction was canceled, do nothing
    }
  }

  async editTransactionOfIndex(index: number): Promise<void> {
    let transaction = this.transactionList[index];
    try {
      const updatedTransaction: WalletTransaction = await this.transactionEditor.editExistingTransaction(transaction);
      if (updatedTransaction) {
        this.updateTransactionOfIndex(index, updatedTransaction);
      }
    } catch {
      // edit transaction was canceled, do nothing
    }

  }

  ngOnInit(): void {

  }

  private insertTheNewTransaction(value: WalletTransaction) {
    if (value !== undefined && value.id >= this.nextId) {
      // look where to add this transactionList:
      let insertAfterIndex = this.transactionList.length - 1;
      const transactionsToUpdate: WalletTransaction[] = [];
      while (value.date < this.transactionList[insertAfterIndex].date) {
        this.transactionList[insertAfterIndex].rename(this.transactionList[insertAfterIndex].id + 1);
        this.transactionList[insertAfterIndex].adjustTotal(value.value);
        transactionsToUpdate.push(this.transactionList[insertAfterIndex]);
        insertAfterIndex--;
        if (insertAfterIndex < 0) {
          break;
        }
      }
      if (transactionsToUpdate.length > 0) {
        value.rename((insertAfterIndex >= 0) ? this.transactionList[insertAfterIndex].id + 1 : 1);
        value.adjustTotal(
          -value.total + ((insertAfterIndex >= 0) ? this.transactionList[insertAfterIndex].total :
          0) + value.value);
        this.transactionList.splice(insertAfterIndex + 1, 0, value);
        //this.saving = true;
        this.transactionStorageSrv.updateTransactions(transactionsToUpdate).then(() => {
          this.nextId = Math.max(this.nextId, value.id + 1);
          this.transactionStorageSrv.insertTransaction(value).then(() => {
            //this.saving = false;
          });
        }, (e) => {
          console.log('failed to update, ignoring inserting');
        });
      } else {
        this.transactionList.push(value);
        this.nextId = Math.max(this.nextId, value.id + 1);
        this.transactionStorageSrv.insertTransaction(value);
      }
    }
  }

  public async deleteTransactionOfIndex(index : number) : Promise<void> {
    let transactions2update : WalletTransaction[] = [];
    let total : number = this.transactionList[index-1].total;
    for (let i = index + 1; i<this.transactionList.length; i++) {
      this.transactionList[i].rename(this.transactionList[i].id-1);
      total += this.transactionList[i].value;
      this.transactionList[i].adjustTotal(total - this.transactionList[i].total);
      transactions2update.push(this.transactionList[i]);
    }
    let id2delete = this.transactionList[index].id;
    this.transactionList.splice(index, 1);
    //this.saving = true;
    await this.transactionStorageSrv.deleteTransaction(id2delete);
    if ( transactions2update.length > 0 ) {
      await this.transactionStorageSrv.updateTransactions(transactions2update);
    }
    //this.saving = false;
    }

  public async updateTransactionOfIndex(index: number, transaction: WalletTransaction): Promise<void> {
    let update_index: number = index;
    // move updated item up, if need to
    while (this.transactionList[update_index - 1].date > transaction.date && update_index > 1) {
      this.transactionList[update_index] = this.transactionList[update_index - 1];
      update_index--;
    }
    // update the transaction
    this.transactionList[update_index] = transaction;
    // move selected item down, if need to
    let down_index = update_index;
    while (down_index < this.transactionList.length - 1 && this.transactionList[down_index + 1].date <= transaction.date) {
      this.transactionList[down_index] = this.transactionList[down_index + 1];
      this.transactionList[++down_index] = transaction;
    }
    // fix id and total from the updated transaction and forwared
    let prev: WalletTransaction;
    let current: WalletTransaction;
    const transactionsToUpdate: WalletTransaction[] = [];
    let newSelectedId: number = null as never;
    while (
            update_index < this.transactionList.length &&
            (prev = this.transactionList[update_index - 1]) &&
            (current = this.transactionList[update_index]) &&
            (current.id !== prev.id + 1 || current.total !== Math.round(10 * (prev.total + current.value)) / 10)
            ) {
      current.rename(prev.id + 1);
      current.adjustTotal(Math.round(10 * (prev.total - current.total + current.value)) / 10);
      transactionsToUpdate.push(current);
      if (current.prev_id === this.selected_id) {
        newSelectedId = current.id;
      }
      update_index++;
    }
    if (newSelectedId) {
      this.selected_id = newSelectedId;
    }
    if (transactionsToUpdate.length === 0) {
      await this.transactionStorageSrv.updateTransactions([this.transactionList[update_index]]);
      return;
    }
    // this.saving = true;
    // temporaray change the id of the first transaction to avoid loop
    const first_id = transactionsToUpdate[0].id;
    transactionsToUpdate[0].rename(transactionsToUpdate[0].prev_id);
    transactionsToUpdate[0].rename(this.nextId);
    if (this.selected_id === first_id) {
      this.selected_id = this.nextId;
    }
    await this.transactionStorageSrv.updateTransactions(transactionsToUpdate);
    // reupdate the first transaction id
    transactionsToUpdate[0].rename(first_id);
    if (this.selected_id === this.nextId) {
      this.selected_id = first_id;
    }
    await this.transactionStorageSrv.updateTransactions([transactionsToUpdate[0]]);
    // this.saving = false;
  }
}
