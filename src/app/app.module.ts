import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WalletActionComponent } from './components/wallet-tracker/components/wallet-action/wallet-action.component';
import { CurrencyInputComponent } from './components/wallet-tracker/components/wallet-action/components/currencyInput/currency-input.component';
import { DateEditorComponent } from './components/wallet-tracker/components/wallet-action/components/date-editor/date-editor.component';
import { WalletTableComponent } from './components/wallet-tracker/components/wallet-table/wallet-table.component';
import { TransactionStorageService } from './components/wallet-tracker/services/transaction.service/transaction-storage.service';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { WalletTrackerComponent } from './components/wallet-tracker/wallet-tracker.component';
import { LoginInfoService } from './components/login/services/login-info.service';
import { TransactionServiceGen } from './components/wallet-tracker/services/transaction.service/transection.service.gen';
import { TransactionMockService } from './components/wallet-tracker/services/transaction.service/transaction-mock.service';
import { ActionManagerService } from './components/wallet-tracker/services/action-manager.service';
import { ActionsButtonsComponent } from './components/wallet-tracker/components/actions-buttons/actions-buttons.component';
import { TransactionEditorService } from './components/wallet-tracker/services/transaction-editor.service';
import { ScrollToBottomDirective } from './components/wallet-tracker/directives/scroll-to-bottom.directive';
import { ButtonsService } from './components/wallet-tracker/services/buttons.service';

@NgModule({
            declarations: [
              AppComponent,
              WalletActionComponent,
              CurrencyInputComponent,
              DateEditorComponent,
              WalletTableComponent,
              LoginComponent,
              WalletTrackerComponent,
              ActionsButtonsComponent,
              ScrollToBottomDirective
            ],
            imports: [
              BrowserModule,
              HttpClientModule,
              FormsModule,
              AppRoutingModule
            ],
            providers: [
              TransactionStorageService,
              TransactionServiceGen,
              TransactionMockService,
              LoginInfoService,
              ActionManagerService,
              TransactionEditorService,
              ButtonsService
            ],
            bootstrap: [AppComponent]
          })
export class AppModule {
}
