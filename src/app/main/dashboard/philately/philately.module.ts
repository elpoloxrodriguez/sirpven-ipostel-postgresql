import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DatePipe} from '@angular/common';
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
import { PhilatelyReceiverComponent } from './philately-receiver/philately-receiver.component';
import { PhilatelyInventoryComponent } from './philately-inventory/philately-inventory.component';


@NgModule({
  declarations: [
    PhilatelyAdminComponent,
    PhilatelyOppComponent,
    PhilatelyReceiverComponent,
    PhilatelyInventoryComponent
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
