import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DatePipe} from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AngularFileUploaderModule } from "angular-file-uploader";


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MiscellaneousModule } from '../pages/miscellaneous/miscellaneous.module';

import { BlockUIModule } from 'ng-block-ui';

import { DashboardComponent } from './principal/dashboard.component';
import { OppComponent } from './module-opp-sub/business/opp/opp.component';
import { SubcontractorComponent } from './module-opp-sub/business/subcontractor/subcontractor.component';

import { PaymentsListComponent } from './module-opp-sub/payments/payments-list/payments-list.component';
import { PaymentsRoutingModule } from './module-opp-sub/payments/payments-routing.module';
import { PostagePerMonthComponent } from './module-opp-sub/postage/postage-per-month/postage-per-month.component';
import { ManagementRoutingModule } from './module-admin/management/management-routing.module';
import { ReportsAdminComponent } from './module-admin/admin-reports/reports-admin/reports-admin.component';
import { SystemPullComponent } from './module-admin/update-system/system-pull/system-pull.component';
import { UpdateSystemRoutingModule } from './module-admin/update-system/update-system-routing.module';
import { OppReportsRoutingModule } from './module-opp-sub/opp-reports/opp-reports-routing.module';
import { ListPaymentsComponent } from './module-admin/trakings/list-payments/list-payments.component';
import { PostageRoutingModule } from './module-opp-sub/postage/postage-routing.module';
import { BusinessRoutingModule } from './module-opp-sub/business/business-routing.module';
import { AdminReportsRoutingModule } from './module-admin/admin-reports/admin-reports-routing.module';
import { TrakingsRoutingModule } from './module-admin/trakings/trakings-routing.module';
import { DigitalFileOppRoutingModule } from './module-admin/digital-file-opp/digital-file-opp-routing.module';
import { PrivatePostalOperatorComponent } from './module-admin/management/private-postal-operator/private-postal-operator.component';
import { PriceTableOppComponent } from './module-admin/postage/price-table-opp/price-table-opp.component';
import { PostageOppModule } from './module-admin/postage/postage.module';
import { ConnectionSettingsComponent } from './module-admin/settings/connection-settings/connection-settings.component';
import { SettingsModule } from './module-admin/settings/settings.module';
import { PostalSolvencyComponent } from './module-admin/postal-solvency/postal-solvency.component';
import { PostalSolvencyModule } from './module-admin/postal-solvency/postal-solvency.module';
import { FinesPenaltiesComponent } from './module-admin/fines-and-penalties/fines-penalties/fines-penalties.component';
import { FinesAndPenaltiesModule } from './module-admin/fines-and-penalties/fines-and-penalties.module';
import { PostalSolvencyOppComponent } from './module-opp-sub/postal-solvency-opp/postal-solvency-opp/postal-solvency-opp.component';
import { PostalSolvencyOppModule } from './module-opp-sub/postal-solvency-opp/postal-solvency-opp.module';



@NgModule({
    declarations: [
      DashboardComponent,
      OppComponent,
      SubcontractorComponent,
      PaymentsListComponent,
      PostagePerMonthComponent,
      ReportsAdminComponent,
      SystemPullComponent,
      ListPaymentsComponent,
      PrivatePostalOperatorComponent,
      PriceTableOppComponent,
      ConnectionSettingsComponent,
      PostalSolvencyComponent,
      FinesPenaltiesComponent,
      PostalSolvencyOppComponent,
    ],
  imports: [
    CommonModule,
    AngularFileUploaderModule,
    NgxDatatableModule,
    BlockUIModule,
    DashboardRoutingModule,
    PaymentsRoutingModule,
    ManagementRoutingModule,
    CommonModule,
    ContentHeaderModule,
    CoreCommonModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MiscellaneousModule,
    UpdateSystemRoutingModule,
    OppReportsRoutingModule,
    PostageRoutingModule,
    BusinessRoutingModule,
    AdminReportsRoutingModule,
    TrakingsRoutingModule,
    DigitalFileOppRoutingModule,
    PostageOppModule,
    SettingsModule,
    PostalSolvencyModule,
    FinesAndPenaltiesModule,
    PostalSolvencyOppModule
  ],
  exports: [],
  providers: [DatePipe]

})
export class DashboardModule {
 




 


}



