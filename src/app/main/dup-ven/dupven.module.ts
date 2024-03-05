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

import { DupvenRoutingModule } from './dupven-routing.module';
import { DupvenAdminComponent } from './dupven-admin/dupven-admin.component';
import { DupvenOppComponent } from './dupven-opp/dupven-opp.component';
import { PrepareGuideComponent } from './dupven-opp/prepare-guide/prepare-guide.component';
import { GuideListComponent } from './dupven-opp/guide-list/guide-list.component';


@NgModule({
  declarations: [
    // DupvenAdminComponent,
    // DupvenOppComponent

    PrepareGuideComponent,
    GuideListComponent
  ],
  imports: [
    CommonModule,
    DupvenRoutingModule,
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
export class DupvenModule { }
