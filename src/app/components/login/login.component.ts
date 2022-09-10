import { Component, OnInit } from '@angular/core';
import { LoginInfoService, UserInfo } from './services/login-info.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private loginInfoService : LoginInfoService) { }
  public name : string = '';
  public currentName : string = '';

  ngOnInit() {
    this.name = this.currentName = this.loginInfoService.name;
  }

  public get host() : string {
    return this.loginInfoService.host;
  }
  public set host(value: string) {
    this.loginInfoService.host = value;
  }

  public get user() : string {
    return this.loginInfoService.user;
  }
  public set user(value: string) {
    this.loginInfoService.user = value;
  }

  public get password() : string {
    return this.loginInfoService.password;
  }
  public set password(value: string) {
    this.loginInfoService.password = value;
  }

  
  public get database() : string {
    return this.loginInfoService.database;
  }
  public set database(value: string) {
    this.loginInfoService.database = value;
  }


  public onNameChanged() {
    this.loginInfoService.name = this.name;
    if ( this.loginInfoService.name !== this.name) {
      this.name = this.loginInfoService.name;
    }
  }

  public onNameSelected() {
    if ( this.currentName == "add" ) {
      let newUserInfo : UserInfo = {
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.database
      };
      this.loginInfoService.addUser('name', newUserInfo);
      this.loginInfoService.switchUser('name');
      this.name = this.currentName = this.loginInfoService.name;
    } else {
      if ( this.currentName === this.loginInfoService.name ) return;
      this.loginInfoService.switchUser(this.currentName);
      this.name = this.currentName = this.loginInfoService.name;
    }
  }

  public get names() : string[] {
    return this.loginInfoService.names;
  }

  public onSaveClicked() {
    if ( this.name.length === 0 ) {
      this.loginInfoService.name = "_";
      this.loginInfoService.removeUser("_");
    }
    this.loginInfoService.save();
    this.name = this.currentName = this.loginInfoService.name;
  }
}
