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
import { SaleFppComponent } from './sale-fpp/sale-fpp.component'


const routes: Routes = [
  {
    path: 'philately/sale-of-philately',
    component: SaleFppComponent,
    canActivate: [AuthGuard, AuthGuardGuard],
    data: { roles: [3] },
  },
  {
    path: 'philately-opp',
    component: PhilatelyOppComponent,
    canActivate: [AuthGuard, AuthGuardGuard],
    data: { roles: [1, 2] },
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
