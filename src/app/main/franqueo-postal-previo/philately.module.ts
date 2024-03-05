import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AngularFileUploaderModule } from "angular-file-uploader";


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { BlockUIModule } from 'ng-block-ui';

import { PhilatelyRoutingModule } from './philately-routing.module';
import { PhilatelyAdminComponent } from './philately-admin/philately-admin.component';
import { PhilatelyOppComponent } from './philately-opp/philately-opp.component';
import { SaleFppComponent } from './sale-fpp/sale-fpp.component';
import { AcquisitionComponent } from './acquisition/acquisition.component';
import { BoxOfficeAllocationComponent } from './box-office-allocation/box-office-allocation.component';
import { BoxOfficeAgencyComponent } from './box-office-agency/box-office-agency.component';
import { InventaryStockComponent } from './inventary-stock/inventary-stock.component';


@NgModule({
  declarations: [
    PhilatelyAdminComponent,
    PhilatelyOppComponent,
    SaleFppComponent,
    AcquisitionComponent,
    BoxOfficeAllocationComponent,
    BoxOfficeAgencyComponent,
    InventaryStockComponent,
  ],
  imports: [
    CommonModule,
    PhilatelyRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    AngularFileUploaderModule,
    NgbModule,
    NgSelectModule,
    BlockUIModule,

  ],
  providers: [DatePipe]
})
export class PhilatelyModule { }
