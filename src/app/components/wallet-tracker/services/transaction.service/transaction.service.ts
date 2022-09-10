import { WalletTransaction } from "../../../../utility/wallet.transaction";

export interface TransactionService {
    getTransactions(startDate : Date, endDate : Date) : Promise<WalletTransaction[]>;
    insertTransaction(trans: WalletTransaction) : Promise<WalletTransaction | null>;
    updateTransactions(transactions: WalletTransaction[]) : Promise<any>;
    deleteTransaction(id: number): Promise<WalletTransaction | null>;
}