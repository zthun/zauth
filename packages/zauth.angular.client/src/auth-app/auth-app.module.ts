import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ZLoginModule } from '@zthun/auth.angular';
import { ZCreatePageComponent } from '../create-page/create-page.component';
import { ZForgotPageComponent } from '../forgot-page/forgot-page.component';
import { ZLoginPageComponent } from '../login-page/login-page.component';
import { ZProfilePageComponent } from '../profile-page/profile-page.component';
import { ZAuthAppComponent } from './auth-app.component';
import { ZAuthAppRoutes, ZAuthAppRoutesOptions } from './auth-app.routing';

@NgModule({
  declarations: [
    ZAuthAppComponent,
    ZLoginPageComponent,
    ZCreatePageComponent,
    ZForgotPageComponent,
    ZProfilePageComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule.forRoot(ZAuthAppRoutes, ZAuthAppRoutesOptions),
    ZLoginModule
  ],
  bootstrap: [ZAuthAppComponent]
})
export class ZAuthAppModule { }