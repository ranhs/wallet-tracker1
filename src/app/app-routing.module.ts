import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { WalletTrackerComponent } from './components/wallet-tracker/wallet-tracker.component';

const routes: Routes = [
  // TODO(Shachar): put a 'guard' on the default route and redirect to 'login' if not authenticated
  { path: '', component: WalletTrackerComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
