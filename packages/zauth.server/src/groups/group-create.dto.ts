import { Optional } from '@nestjs/common';
import { IZGroup } from '@zthun/auth.core';
import { Equals, IsEmpty, IsString } from 'class-validator';
import { IsNotWhiteSpace } from '../validation/is-not-white-space.function';

export class ZGroupCreateDto implements IZGroup {
  @IsString({ message: 'Name must be a string' })
  @IsNotWhiteSpace({ message: 'Name is required and must not be white space' })
  public name: string;

  @Optional()
  @Equals(undefined, { message: 'You cannot create system groups.' })
  public system?: boolean;

  @Optional()
  @IsEmpty({ message: 'Group ids are autogenerated for you.  You should not create your own id.' })
  public _id: string;
}
