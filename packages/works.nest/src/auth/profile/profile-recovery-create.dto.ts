import { IZProfile } from '@zthun/works.core';
import { IsEmail, IsString } from 'class-validator';

export class ZProfileRecoveryCreateDto implements IZProfile {
  @IsString({ message: 'Recovery email must be a string.' })
  @IsEmail({}, { message: 'Recovery email must be a valid email.' })
  public email: string;
}
