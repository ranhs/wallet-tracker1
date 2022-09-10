import { Injectable } from '@angular/core';
import { WalletTransaction } from '../../../utility/wallet.transaction';
import { BehaviorSubject } from 'rxjs';

const DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class TransactionEditorService {

  currentTransaction$ = new BehaviorSubject(null);

  private onEditTransactionMethod : ((trans: WalletTransaction, isNew: boolean)=>Promise<WalletTransaction>) | null = null;

  constructor() {
  }

  public onEditTransaction( callback : (trans: WalletTransaction, isNew: boolean)=>Promise<WalletTransaction> ) {
    this.onEditTransactionMethod = callback;
  }

  // fuction to be override by action-manager-service:
  public getNextId : () => number = ()=>0;
  public getLastTotal: () => number = ()=>0;


  private getToday() : Date {
    let now: number = Date.now();
    let today: Date = new Date(now - now % DAY);
    return today;
  }

  async getNewTransaction(): Promise<WalletTransaction> {
    let newTransaction = new WalletTransaction(
      this.getNextId(),
      this.getToday(),
      "",
      0,
      this.getLastTotal()
    )
    if ( this.onEditTransactionMethod ) {
      newTransaction = await this.onEditTransactionMethod(newTransaction, true);
    }
    return newTransaction;
  }

  async editExistingTransaction(walletTransaction: WalletTransaction): Promise<WalletTransaction> {
    console.log('editExistingTransaction', walletTransaction);
    if ( this.onEditTransactionMethod ) {
      walletTransaction = await this.onEditTransactionMethod(walletTransaction, false);
    }
    console.log('editExistingTransaction', walletTransaction);
    return walletTransaction;
  }
}
