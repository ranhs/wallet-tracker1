import * as mysql from 'mysql';
import {Promise, polyfill} from 'es6-promise';

export class DbInfo  {
    constructor (
        public host : string, 
        public user : string, 
        public password : string, 
        public database : string) {
    }
}

export class Transaction  {
    constructor(
        public id : number, 
        public date: {year : number, month : number, day : number}, 
        public description : string, 
        public value : number, 
        public total : number,
        public prev_id: number = undefined) {
    }
}

export class WalletDB {
    constructor() {
    }

    private static sqlStr(txt: string) : string {
        let parts = txt.split("'");
        if ( parts.length <= 1 ) return txt;
        txt = parts[0];
        for (let i=1; i<parts.length; i++) {
            txt = `${txt}\\'${parts[i]}`;
        }
        return txt;
    }

    public static getTransactions(dbInfo : DbInfo) : Promise<Transaction[]> {
        var pool = mysql.createPool(dbInfo);
        return new Promise<Transaction[]>( (resolve, reject) => {
            pool.query("SELECT * FROM WalletTransactions ORDER BY id", (error, result) => {
                if ( error ) {
                    reject(error);
                } else {
                    var transactions : Transaction[] = [];
                    for (var res of result) {
                        var date : Date = new Date(res.date);
                        var trans = new Transaction(
                            res.id, 
                            {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()},
                            res.description,
                            res.value,
                            res.balance);
                        transactions.push(trans);
                    }
                    resolve(transactions);
                }
            });
        });
    };

    public static insertTransaction(dbInfo: DbInfo, trans: Transaction) : Promise<Transaction>  {
        if ( !dbInfo || !trans ) return;
        var pool = mysql.createPool(dbInfo);
        var date = new Date(trans.date.year, trans.date.month-1, trans.date.day);
        return new Promise<Transaction>( (resolve, reject) => {
            pool.query(`INSERT INTO WalletTransactions (id, date, description, value, balance)  
            VALUES (${trans.id}, '${trans.date.year}-${trans.date.month}-${trans.date.day}' ,'${WalletDB.sqlStr(trans.description)}',${trans.value},${trans.total})`, 
            (error, result) => {
                if ( error ) {
                    reject(error);
                } else {
                    resolve(trans);
                }
            });
        });
    }

    public static Update(dbInfo: DbInfo, transactions : Transaction[]) : Promise<number> {
        if ( !dbInfo || !transactions || transactions.length === 0 ) return;
        var pool = mysql.createPool(dbInfo);
        return new Promise<number> ( (resolve, reject) => {
            var _update  = ( transactions : Transaction[] ) : void => {
                if ( transactions.length === 0 ) {
                    return resolve(0);
                }
                let trans = transactions[0];
                pool.query(`UPDATE WalletTransactions
                            SET id=${trans.id},
                                date='${trans.date.year}-${trans.date.month}-${trans.date.day}',
                                description='${WalletDB.sqlStr(trans.description)}',
                                value=${trans.value},
                                balance=${trans.total}
                            WHERE id=${trans.prev_id ? trans.prev_id : trans.id}`, 
                (error) => {
                    if ( error ) {
                        reject(error);
                    } else {
                        _update( transactions.splice(1, transactions.length-1) );
                    }
                });
                
            };
            _update(transactions);
        });
    }

    public static delete(dbInfo: DbInfo, id : number) : Promise<Transaction> {
        if ( !dbInfo || !id ) return;
        var pool = mysql.createPool(dbInfo);
        return new Promise<Transaction> ((resolve, reject) => {
            pool.query(`SELECT * from WalletTransactions where id=${id}`, 
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    if ( !result || !result.length || result.length !== 1 ) {
                        reject({ mesage: `id ${id} could not found, or found more than one reuslt`,
                        result});
                    }

                    let deletedTransaction = result[0];
                    pool.query(`DELETE from WalletTransactions where id=${id}`,
                    (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(deletedTransaction);
                        }
                    })
                }
            })
        });
    }
}