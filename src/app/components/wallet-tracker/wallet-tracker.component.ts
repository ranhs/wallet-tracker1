import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { LoginInfoService } from '../login/services/login-info.service';
import { ActionManagerService } from './services/action-manager.service';
import { TransactionEditorService } from './services/transaction-editor.service';
import { ButtonsService, BtnFilter } from './services/buttons.service';
import { ScrollToBottomDirective } from './directives/scroll-to-bottom.directive';

@Component({
             selector: 'app-wallet-tracker',
             templateUrl: './wallet-tracker.component.html',
             styleUrls: ['./wallet-tracker.component.scss']
           })
export class WalletTrackerComponent implements OnInit {
  @ViewChild(ScrollToBottomDirective) scrollDirective : ScrollToBottomDirective = null as never;

  constructor(private loginInfoService: LoginInfoService,
    public actionManager: ActionManagerService,
    public transactionEditor: TransactionEditorService,
    public buttonsSrv: ButtonsService) {
  }

  ngOnInit() {
    // Initialize the scrollContentToBottom function - TODO: find a better way of doing it
    this.buttonsSrv.add.visible = true;
    this.buttonsSrv.edit.visible = false;
    this.buttonsSrv.remove.visible = false;
    this.buttonsSrv.filter = BtnFilter.ADD | BtnFilter.EDIT | BtnFilter.REMOVE;
    this.buttonsSrv.add.onClick( () => {
      this.actionManager.addNewTransaction();
    });
    this.buttonsSrv.remove.onClick( () => {
      this.actionManager.deleteSelectedTransaction();
    })
    this.buttonsSrv.edit.onClick( () => {
      this.actionManager.editSelectedTransaction();
    })
  }

  public get loginName(): string {
    return this.loginInfoService.name;
  }

  public onItemsLoaded() {
    this.scrollDirective.scrollDown();
  }
  
}
