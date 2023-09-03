import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { SubscriptionComponent } from './subscription/subscription.component';

const routes: Routes = [
  {
    path:'', component:AccountsComponent, children:[
      {
        path:'subscription', component:SubscriptionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
