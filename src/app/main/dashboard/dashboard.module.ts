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
import { OppComponent } from './sirpven/module-opp-sub/business/opp/opp.component';
import { SubcontractorComponent } from './sirpven/module-opp-sub/business/subcontractor/subcontractor.component';

import { PaymentsListComponent } from './sirpven/module-opp-sub/payments/payments-list/payments-list.component';
import { PaymentsRoutingModule } from './sirpven/module-opp-sub/payments/payments-routing.module';
import { PostagePerMonthComponent } from './sirpven/module-opp-sub/postage/postage-per-month/postage-per-month.component';
import { ManagementRoutingModule } from './sirpven/module-admin/management/management-routing.module';
import { ReportsAdminComponent } from './sirpven/module-admin/admin-reports/reports-admin/reports-admin.component';
import { SystemPullComponent } from './sirpven/module-admin/update-system/system-pull/system-pull.component';
import { UpdateSystemRoutingModule } from './sirpven/module-admin/update-system/update-system-routing.module';
import { OppReportsRoutingModule } from './sirpven/module-opp-sub/opp-reports/opp-reports-routing.module';
import { ListPaymentsComponent } from './sirpven/module-admin/trakings/list-payments/list-payments.component';
import { PostageRoutingModule } from './sirpven/module-opp-sub/postage/postage-routing.module';
import { BusinessRoutingModule } from './sirpven/module-opp-sub/business/business-routing.module';
import { AdminReportsRoutingModule } from './sirpven/module-admin/admin-reports/admin-reports-routing.module';
import { TrakingsRoutingModule } from './sirpven/module-admin/trakings/trakings-routing.module';
import { DigitalFileOppRoutingModule } from './sirpven/module-admin/digital-file-opp/digital-file-opp-routing.module';
import { PrivatePostalOperatorComponent } from './sirpven/module-admin/management/private-postal-operator/private-postal-operator.component';
import { PriceTableOppComponent } from './sirpven/module-admin/postage/price-table-opp/price-table-opp.component';
import { PostageOppModule } from './sirpven/module-admin/postage/postage.module';
import { ConnectionSettingsComponent } from './sirpven/module-admin/settings/connection-settings/connection-settings.component';
import { SettingsModule } from './sirpven/module-admin/settings/settings.module';
import { PostalSolvencyComponent } from './sirpven/module-admin/postal-solvency/postal-solvency.component';
import { PostalSolvencyModule } from './sirpven/module-admin/postal-solvency/postal-solvency.module';
import { FinesPenaltiesComponent } from './sirpven/module-admin/fines-and-penalties/fines-penalties/fines-penalties.component';
import { FinesAndPenaltiesModule } from './sirpven/module-admin/fines-and-penalties/fines-and-penalties.module';
import { PostalSolvencyOppComponent } from './sirpven/module-opp-sub/postal-solvency-opp/postal-solvency-opp/postal-solvency-opp.component';
import { PostalSolvencyOppModule } from './sirpven/module-opp-sub/postal-solvency-opp/postal-solvency-opp.module';
import { PanelAsistenteVirtualComponent } from '../asistente-virtual/panel-asistente-virtual/panel-asistente-virtual.component';
import { SystemUsersComponent } from './sirpven/module-admin/settings/system-users/system-users.component';
import { PhilatelyModule } from './philately/philately.module';
import { DupvenRoutingModule } from './dupven/dupven-routing.module';
import { DupvenAdminComponent } from './dupven/dupven-admin/dupven-admin.component';
import { DupvenOppComponent } from './dupven/dupven-opp/dupven-opp.component';



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
      PanelAsistenteVirtualComponent,
      SystemUsersComponent,
      DupvenAdminComponent,
      DupvenOppComponent
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
    PostalSolvencyOppModule,
    PhilatelyModule,
    DupvenRoutingModule
  ],
  exports: [],
  providers: [DatePipe]

})
export class DashboardModule {
 




 


}



