import * as React from 'react';
import { ZForgotPasswordForm } from './forgot-password-form';
import { ZLoginForm } from './login-form';
import { ZNewUserForm } from './new-user-form';

export class ZLoginPage extends React.Component {
  public render() {
    return (
      <div className='mx-auto w-font-25 mb-em-5'>
        <div className='mb-sm'>
          <ZLoginForm />
        </div>
        <div className='mb-sm'>
          <ZNewUserForm />
        </div>
        <div className='mb-sm'>
          <ZForgotPasswordForm />
        </div>
      </div>
    );
  }
}
