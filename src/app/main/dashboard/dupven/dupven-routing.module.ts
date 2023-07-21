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
import { DupvenAdminComponent } from './dupven-admin/dupven-admin.component'
import { DupvenOppComponent } from './dupven-opp/dupven-opp.component'

const routes: Routes = [
  {
    path: 'dupven/admin',
    component: DupvenAdminComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: [3] },
  },
  {
    path: 'dupven/opp',
    component: DupvenOppComponent,
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
export class DupvenRoutingModule { }
