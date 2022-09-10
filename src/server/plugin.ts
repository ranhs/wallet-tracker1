import * as url from 'url';
import * as bodyParser from 'body-parser';
import {DbInfo, Transaction, WalletDB} from './walletDB';
import {Express} from 'express'


export function plugin(app: Express) {
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());

    app.get('/transactionList', (req, res) => {
        var url_parts : url.Url = url.parse(req.url, true);
        const query = url_parts.query as {host: string, user: string, password: string, database: string}
        var dbInfo = new DbInfo(query.host, query.user, query.password, query.database);
        WalletDB.getTransactions(dbInfo).then( (transactions) => {
            res.json( transactions );
        }, (error) => {
            res.status(400).send(error);
        });
    });

    app.post('/transactionList', (req, res) => {
        var url_parts : url.Url = url.parse(req.url, true);
        const query = url_parts.query as {host: string, user: string, password: string, database: string}
        var dbInfo = new DbInfo(query.host, query.user, query.password, query.database);
        WalletDB.insertTransaction(dbInfo, req.body).then( (data)=> {
            res.send( data );
        }, (error)=> {
            res.status(400).send(error);
        });
    });

    app.put('/transactionList', (req, res) => {
        var url_parts : url.Url = url.parse(req.url, true);
        const query = url_parts.query as {host: string, user: string, password: string, database: string}
        var dbInfo = new DbInfo(query.host, query.user, query.password, query.database);
        var body = req.body;
        if ( !Array.isArray(body) ) {
            body = [ body ];
        }
        WalletDB.Update(dbInfo, body).then( (data) => {
            res.send( undefined );
        }, (error) => {
            res.status(400).send(error);
        });
    });

    app.delete('/transactionList/:id', (req, res) => {
        var url_parts : url.Url = url.parse(req.url, true);
        const query = url_parts.query as {host: string, user: string, password: string, database: string}
        var dbInfo = new DbInfo(query.host, query.user, query.password, query.database);
        WalletDB.delete(dbInfo, req.params.id as never).then( (transaction) => {
            res.send(transaction);
        }, (error) => {
            res.status(400).send(error);
        });
    })
}
