import { TransactionService } from "./transaction.service";
import { Injectable } from "@angular/core";
import { WalletTransaction } from "../../../../utility/wallet.transaction";

@Injectable()
export class TransactionMockService  implements TransactionService {
    private transactions : WalletTransaction[] = [
        new WalletTransaction(1, new Date(2018,8-1,31), "יתרה קודמת", 184.2, 184.2),
        new WalletTransaction(2, new Date(2018,9-1,1), "לגנדה גלי", -28, 156.2),
        new WalletTransaction(3, new Date(2018,9-1,2), "צהריים גלי", -50, 106.2),
        new WalletTransaction(4, new Date(2018,9-1,2), "חופשי יומי שחר", -40, 66.2),
        new WalletTransaction(5, new Date(2018,9-1,4), "משיכה", 200, 266.2),
        new WalletTransaction(6, new Date(2018,9-1,4), "מכונת חטיפים", -4.5, 261.7),
        new WalletTransaction(7, new Date(2018,9-1,4), "פתוח קול שחר", -200, 61.7),
        new WalletTransaction(8, new Date(2018,9-1,8), "משיכה", 200, 261.7),
      ];

    private clone(t:WalletTransaction) : WalletTransaction {
        return new WalletTransaction(
            t.id,
            t.date,
            t.description,
            t.value,
            t.total
        );
    }

    async getTransactions(startDate : Date, endDate : Date) : Promise<WalletTransaction[]> {
        let res : WalletTransaction[] = [];
        this.transactions.forEach((value)=>{
            res.push(this.clone(value));
        })
        return res;
    }

    async insertTransaction(trans: WalletTransaction) : Promise<WalletTransaction | null> {
        let t = this.clone(trans);
        for (let i=0; i<this.transactions.length; i++) {
            if ( this.transactions[i].id === t.id ) {
                throw new Error('item already exists');
            }
            if ( this.transactions[i].id > t.id ) {
                this.transactions.splice(i, 0, t);
                return this.clone(t);
            }
            this.transactions.push(t);
            return this.clone(t);
        }
        return null;
    }

    async updateTransactions(transactions: WalletTransaction[]) : Promise<any> {
        let map : {[key:number]:WalletTransaction} = {};
        transactions.forEach((value)=>map[(value.prev_id)?value.prev_id:value.id]=value);
        for (let i = 0; i<this.transactions.length; i++ ) {
            let id = this.transactions[i].id;
            if ( map[id] ) {
                this.transactions[i] = this.clone(map[id]);
            }
        }
        this.transactions.sort((a,b)=>a.id-b.id);
        return null;
    }

    async deleteTransaction(id: number): Promise<WalletTransaction | null> {
        for (let i = 0; i<this.transactions.length; i++) {
            if ( this.transactions[i].id === id ) {
                let t = this.transactions.splice(i, 1)[0];
                return this.clone(t);
            }
            return null;
        }
        return null;
    }

}