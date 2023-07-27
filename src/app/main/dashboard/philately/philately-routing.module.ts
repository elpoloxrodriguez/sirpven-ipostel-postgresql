import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { NgSelectModule } from '@ng-select/ng-select'
import { CoreCommonModule } from '@core/common.module'
import { TranslateModule } from '@ngx-translate/core'
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AuthGuard } from 'app/auth/helpers';
import { PhilatelyAdminComponent } from './philately-admin/philately-admin.component'
import { PhilatelyOppComponent } from './philately-opp/philately-opp.component'
import { PhilatelyReceiverComponent } from './philately-receiver/philately-receiver.component'
import { PhilatelyInventoryComponent } from './philately-inventory/philately-inventory.component'


const routes: Routes = [
  {
    path: 'philately/philately-receiver',
    component: PhilatelyReceiverComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: [3] },
  },
  {
    path: 'philately/sale-of-philately',
    component: PhilatelyAdminComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: [3] },
  },
  {
    path: 'philately/philately-inventory',
    component: PhilatelyInventoryComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: [3] },
  },
  {
    path: 'philately-opp',
    component: PhilatelyOppComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: [1] },
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    CoreCommonModule,
    TranslateModule
  ],
  exports: [RouterModule]
})
export class PhilatelyRoutingModule { }
