import { ExtraOptions, Route } from '@angular/router';
import { ZProfilePageComponent } from 'src/profile-page/profile-page.component';
import { ZCreatePageComponent } from '../create-page/create-page.component';
import { ZForgotPageComponent } from '../forgot-page/forgot-page.component';
import { ZLoginPageComponent } from '../login-page/login-page.component';
import { ZCreateAccountPageUrl, ZForgotPageUrl, ZLoginPageUrl, ZProfilePageUrl } from './auth-app.routes';

export const ZLoginPageRoute: Route = {
  path: ZLoginPageUrl,
  component: ZLoginPageComponent
};

export const ZForgotPageRoute: Route = {
  path: ZForgotPageUrl,
  component: ZForgotPageComponent
};

export const ZProfilePageRoute: Route = {
  path: ZProfilePageUrl,
  component: ZProfilePageComponent
};

export const ZCreateAccountPageRoute: Route = {
  path: ZCreateAccountPageUrl,
  component: ZCreatePageComponent
};

export const ZDefaultLoginRoute: Route = {
  path: '',
  pathMatch: 'full',
  redirectTo: ZLoginPageUrl
};

export const ZBadPathLoginRoute: Route = {
  path: '**',
  pathMatch: 'full',
  redirectTo: ZLoginPageUrl
};

export const ZAuthAppRoutes: Route[] = [
  ZLoginPageRoute,
  ZForgotPageRoute,
  ZProfilePageRoute,
  ZCreateAccountPageRoute,
  ZDefaultLoginRoute,
  ZBadPathLoginRoute
];

export const ZAuthAppRoutesOptions: ExtraOptions = {
  useHash: true
};
