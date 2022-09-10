import { Injectable, OnInit } from "@angular/core";

@Injectable()
export class LoginInfoService {
    private currentName : string = '';
    private users : {[key: string] :  UserInfo} = {};

    constructor() {
        this.load();
    }

    public load() {
        this.users = JSON.parse(localStorage.getItem("wallet-users-info") as string);
        this.currentName = localStorage.getItem("waller-user-name") as string;
        if ( !this.users || Object.keys(this.users).length == 0 ) {
            let host = localStorage.getItem("wallet-host") || "host";
            let user = localStorage.getItem("wallet-user") || "user";
            let password = localStorage.getItem("wallet-password") || "password";
            let database = localStorage.getItem("wallet-database") || "database";
            let userInfo : UserInfo = {
                host,
                user,
                password,
                database
            }
            this.users = {};
            this.users['0'] = userInfo;
        }
        if ( !this.currentName || !this.users[this.currentName] ) {
            this.currentName = Object.keys(this.users)[0];
        }
    }

    public save() {
        if ( localStorage.getItem("wallet-host") ) 
            localStorage.removeItem("wallet-host");
        if ( localStorage.getItem("wallet-user") )
            localStorage.removeItem("wallet-user");
        if ( localStorage.getItem("wallet-password") )
            localStorage.removeItem("wallet-password");
        if ( localStorage.getItem("wallet-database") )
            localStorage.removeItem("wallet-database");
        localStorage.setItem("wallet-users-info", JSON.stringify(this.users));
        localStorage.setItem("waller-user-name", this.currentName);
    }

    public get name() : string {
        return this.currentName;
    }

    public get userInfo() : UserInfo {
        return this.users[this.currentName];
    }

    public get host() : string {
        return this.userInfo.host;
    }

    public get user() : string {
        return this.userInfo.user;
    }

    public get password() : string {
        return this.userInfo.password;
    }

    public get database() : string {
        return this.userInfo.database;
    }

    // rename current user
    public set name(value: string) {
        if ( this.currentName === value ) return;
        if ( this.names.indexOf(value) >=0 ) return;
        this.users[value] = this.userInfo;
        delete this.users[this.currentName];
        this.currentName = value;
    }

    public set host(value: string) {
        this.userInfo.host = value;
    }

    public set user(value: string) {
        this.userInfo.user = value;
    }

    public set password(value: string) {
        this.userInfo.password = value;
    }

    public set database(value: string) {
        this.userInfo.database = value;
    }

    public get names() : string[] {
        return Object.keys(this.users);
    }

    public switchUser(name: string) : void {
        if ( this.users[name] ) {
            this.currentName = name;
        }
    }

    public addUser(name:string, userInfo: UserInfo) : boolean {
        if ( !name || !userInfo || this.users[name] ) return false;   
        this.users[name] = userInfo;
        return true;
    }

    public removeUser(name: string) : boolean {
        if ( !this.users[name] ) return false;
        let userInfo = this.userInfo;
        delete this.users[name];
        if ( Object.keys(this.users).length === 0 ) {
            this.users['0'] = userInfo;
        }
        if ( name === this.currentName ) {
            this.currentName = Object.keys(this.users)[0];
        }
        return true;
    }
}

export class UserInfo {
    public host: string = '';
    public user: string = '';
    public password: string = '';
    public database: string = '';
}