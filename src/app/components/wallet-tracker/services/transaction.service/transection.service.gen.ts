import { TransactionService } from "./transaction.service";
import { Injectable } from "@angular/core";
import { TransactionStorageService } from "./transaction-storage.service";
import { WalletTransaction } from "../../../../utility/wallet.transaction";
import { TransactionMockService } from "./transaction-mock.service";

@Injectable()
export class TransactionServiceGen implements TransactionService {
    private _innerService : TransactionService= null as never;

    constructor(private _transactionSrv : TransactionStorageService, private _transactionMock : TransactionMockService) {
    }

    private async innerService() : Promise<TransactionService> {
        if (this._innerService) return this._innerService;
        if ( await this._transactionSrv.testConnection() ) {
            return this._innerService = this._transactionSrv;
        } else {
            // TBD
            return this._innerService = this._transactionMock;
        }
    }

    async getTransactions(startDate : Date, endDate : Date) : Promise<WalletTransaction[]>{
        return await (await this.innerService()).getTransactions(startDate, endDate);
    }

    async insertTransaction(trans: WalletTransaction) : Promise<WalletTransaction> {
        return await (await this.innerService()).insertTransaction(trans) as never;
    }
    async updateTransactions(transactions: WalletTransaction[]) : Promise<any> {
        return await (await this.innerService()).updateTransactions(transactions);
    }

    async deleteTransaction(id: number): Promise<WalletTransaction> {
        return await (await this.innerService()).deleteTransaction(id) as never;
    }

}
