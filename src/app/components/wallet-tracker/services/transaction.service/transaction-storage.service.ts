import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WalletTransaction } from '../../../../utility/wallet.transaction';
import { TagContentType } from '@angular/compiler';
import { LoginInfoService } from '../../../login/services/login-info.service';
import { TransactionService } from './transaction.service';


@Injectable()
export class TransactionStorageService implements TransactionService {
  private host: string;
  private user: string;
  private password: string;
  private database: string;

  constructor(private http: HttpClient, private loginInfoService : LoginInfoService) { 
    this.host = this.loginInfoService.host;
    this.user = this.loginInfoService.user;
    this.password = this.loginInfoService.password;
    this.database = this.loginInfoService.database;
  }

  public testConnection() : Promise<boolean> {
    return new Promise<boolean> ((resolve) => {
      let url : string = (location.host === "localhost:4200")?'http://localhost:8080':'/';
      this.http.get(url).subscribe( (data) => resolve(true), (err) => {
        resolve(err.status > 0);
      })
    });
  }

  private apiUrl(path : string) : string{
    var url : string = path;
    if ( location.host === "localhost:4200" )
    {
      // servered from local ng serve
      url = `http://localhost:8080${path}`;
    } 
    url = `${url}?host=${this.host}&user=${this.user}&password=${this.password}&database=${this.database}`;
    return url;
  }

  getTransactions(startDate : Date, endDate : Date) : Promise<WalletTransaction[]> {
    return new Promise<WalletTransaction[]>((resolve, reject) => {
      var rv = this.http.get(this.apiUrl('/transactionList')).subscribe( (data) => {
        var transactions : WalletTransaction[] = [];
        for ( var trans of data as HttpWalletTransaction[] ) {
          transactions.push( new WalletTransaction(trans.id, new Date(trans.date.year, trans.date.month-1, trans.date.day), trans.description, trans.value, trans.total));
        }
        resolve(transactions);
      }, (error) => {
        console.log("failed to fetch data", error);
      });
    });
  }

  insertTransaction(trans: WalletTransaction) : Promise<WalletTransaction> {
    return new Promise<WalletTransaction>( (resolve, reject) => {
      var rv = this.http.post<HttpWalletTransaction>(this.apiUrl('/transactionList'), {
        id : trans.id,
        date: {
          year: trans.date.getFullYear(),
          month: trans.date.getMonth() +1,
          day: trans.date.getDate()
        },
        description: trans.description,
        value: trans.value,
        total: trans.total
      }).subscribe((data:HttpWalletTransaction)=>{
        resolve(new WalletTransaction(
          data.id, 
          new Date(data.date.year, data.date.month-1, data.date.day),
          data.description,
          data.value,
          data.total));
      }, (error) => {
        console.log('post failed', error);
        reject(error);
      })
    });
  }

  updateTransactions(transactions: WalletTransaction[]) : Promise<any> {
    return new Promise<any> ( (resolve, reject) => {
      var httpTrans : HttpWalletTransaction[] = [];
      for ( var trans of transactions ) {
        httpTrans.push( {
          id: trans.id,
          date: {
            year: trans.date.getFullYear(),
            month: trans.date.getMonth() +1,
            day: trans.date.getDate()
          },
          description: trans.description,
          value: trans.value,
          total: trans.total,
          prev_id: trans.prev_id
        });
      }
      this.http.put<HttpWalletTransaction[]>(this.apiUrl('/transactionList'), httpTrans).subscribe(()=>{
        resolve(undefined);
      }, (error) => {
        console.log('post failed', error);
        reject(undefined);
      });
    });
  }

  deleteTransaction(id: number): Promise<WalletTransaction> {
    return new Promise<WalletTransaction> ( (resolve, reject) => {
      this.http.delete(this.apiUrl(`/transactionList/${id}`)).subscribe((body1) => {
        let body = body1 as HttpWalletTransaction;
        var rv = new WalletTransaction(
          body.id, 
          new Date(body.date.year, body.date.month-1, body.date.day),
          body.description,
          body.value,
          body.total);
        resolve(rv);
      }, (error) => reject(error));
    });
  }

}

interface HttpWalletTransaction {
  id: number;
  date : { year: number, month: number, day: number};
  description: string;
  value: number;
  total: number;
  prev_id?: number;
}
