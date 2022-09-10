import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { WalletTransaction } from '../../../../utility/wallet.transaction';
import { TransactionServiceGen } from '../../services/transaction.service/transection.service.gen';
import { ActionManagerService } from '../../services/action-manager.service';
import { Subject } from 'rxjs';

@Component({
             selector: 'wallet-table',
             templateUrl: './wallet-table.component.html',
             styleUrls: ['./wallet-table.component.scss']
           })
export class WalletTableComponent implements OnInit, OnDestroy {
  @Output() itemsLoaded = new EventEmitter();
  private destroy$ = new Subject<null>();

  constructor(private transactionStorageSrv: TransactionServiceGen,
    public actionManager: ActionManagerService) {
  }

  ngOnInit() {
    const today = new Date();
    const lastMonth = new Date(
      today.getFullYear() - ((today.getMonth() === 1) ? 1 : 0),
      (today.getMonth() === 1) ? 12 : today.getMonth() - 1,
      1);
    this.transactionStorageSrv.getTransactions(lastMonth, today).then(
      (transactions) => {
        this.actionManager.transactionList = transactions;
        for (const trans of this.actionManager.transactionList) {
          this.actionManager.nextId = Math.max(this.actionManager.nextId, trans.id + 1);
        }
        setTimeout(()=>{
          this.itemsLoaded.emit('loaded');
        },0);
      }
    );
  }

  public selectTransaction(transaction: WalletTransaction): void {
    if (this.actionManager.selected_id === transaction.id) {
      this.actionManager.selected_id = 0;
    } else {
      this.actionManager.selected_id = transaction.id;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
