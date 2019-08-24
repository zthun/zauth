import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ZForgotPasswordForm } from './forgot-password-form';
import { IZForgotPasswordProperties } from './forgot-password-properties';

export class ZForgotPasswordPageBase extends Component<Partial<IZForgotPasswordProperties> & RouteComponentProps> {
  public static defaultProps: Partial<IZForgotPasswordProperties> & Partial<RouteComponentProps> = {
    signInRoute: 'login'
  };

  public render() {
    return (
      <div className='ZForgotPasswordPage-root mx-auto w-font-25 mt-em-5'>
        <ZForgotPasswordForm signInRoute={this.props.signInRoute} />
      </div>
    );
  }
}

export const ZForgotPasswordPage = withRouter(ZForgotPasswordPageBase);
