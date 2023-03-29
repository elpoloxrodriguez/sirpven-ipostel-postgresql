import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';



import { AuthLoginV2Component } from 'app/main/pages/authentication/auth-login-v2/auth-login-v2.component';
import { AuthResetPasswordV2Component } from './auth-reset-password-v2/auth-reset-password-v2.component';
import { AuthForgotPasswordV2Component } from './auth-forgot-password-v2/auth-forgot-password-v2.component';
import { AuthAdminComponent } from './auth-admin/auth-admin.component';
import { AuthRegisterOppComponent } from './auth-register-opp/auth-register-opp.component';
import { AuthRegisterSubcontratorComponent } from './auth-register-subcontrator/auth-register-subcontrator.component';
import { BlockUIModule } from 'ng-block-ui';
import { FooterComponent } from './footer/footer.component';
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AsistenteVirtualComponent } from 'app/main/asistente-virtual/asistente-virtual.component';



// routing
const routes: Routes = [
  {
    path: 'login',
    component: AuthLoginV2Component,
    // canActivate: [AuthGuard,AuthGuardGuard],
    data: { animation: 'misc' }
  },
  {
    path: 'sirpv-admin',
    component: AuthAdminComponent,
    data: { animation: 'misc' }
  },
  {
    path: '',
    component: AuthLoginV2Component,
    data: { animation: 'misc' }
  },
  {
    path: 'register-private-post-offices',
    component: AuthRegisterOppComponent,
    data: { animation: 'misc' }
  },
  {
    path: 'register-private-post-offices-subcontrator',
    component: AuthRegisterSubcontratorComponent,
    data: { animation: 'misc' }
  },
  {
    path: 'reset-password/:id',
    component: AuthResetPasswordV2Component,
    data: { animation: 'misc' }
  },
  {
    path: 'forgot-password',
    component: AuthForgotPasswordV2Component,
    data: { animation: 'misc' }
  }
];

@NgModule({
  declarations: [
    AuthLoginV2Component,
    AuthResetPasswordV2Component,
    AuthForgotPasswordV2Component,
    AuthRegisterOppComponent,
    AuthRegisterSubcontratorComponent,
    FooterComponent,
    AsistenteVirtualComponent,
    AuthAdminComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule, NgSelectModule,
    FormsModule, ReactiveFormsModule, CoreCommonModule, ContentHeaderModule,
    BlockUIModule,
    CardSnippetModule]
})
export class AuthenticationModule { }
