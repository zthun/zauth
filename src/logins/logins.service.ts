import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IZDatabase } from '@zthun/dal';
import { compare } from 'bcrypt';
import { utc } from 'moment';
import { Collections } from '../common/collections.enum';
import { ZHttpAssert } from '../common/http-assert.class';
import { DatabaseToken } from '../common/injection.constants';
import { ZUserBuilder } from '../users/user-builder.class';
import { IZUser } from '../users/user.interface';
import { IZLogin } from './login.interface';

@Injectable()
export class ZLoginsService {
  /**
   * Initializes a new instance of this object.
   *
   * @param _dal The data access layer.
   */
  public constructor(@Inject(DatabaseToken) private readonly _dal: IZDatabase) { }

  /**
   * Sets the login timestamp for the user.
   *
   * This method is idempotant.
   *
   * @param login The login that contains the email and password.
   *
   * @return The user that was logged in.
   *
   * @throws UnauthorizedException if the user cannot be logged in.
   * @throws BadRequestException if the login has no email.
   * @throws BadRequestException if the login has no password.
   */
  public async login(dto: IZLogin): Promise<IZUser> {
    ZHttpAssert.assert(!!dto.email, () => new BadRequestException('User email is required.'));
    ZHttpAssert.assert(!!dto.password, () => new BadRequestException('Password is required.'));

    const blobs = await this._dal.read<IZUser>(Collections.Users).filter({ email: dto.email }).run();
    ZHttpAssert.assert(blobs.length > 0, () => new UnauthorizedException('User email or password is incorrect.'));

    const user = blobs[0];
    const passwordsMatch = await compare(dto.password, user.password);
    ZHttpAssert.assert(passwordsMatch, () => new UnauthorizedException('User email or password is incorrect.'));

    await this._dal.update<IZUser>(Collections.Users, { login: utc().unix() }).filter({ _id: user._id }).run();
    const updated = await this._dal.read<IZUser>(Collections.Users).filter({ _id: user._id }).run();
    return new ZUserBuilder().copy(updated[0]).redact().user();
  }

  /**
   * Marks the user as logged out.
   *
   * @param id The id of the user to log out.
   */
  public async logout(id: string) {
    const blobs = await this._dal.read<IZUser>(Collections.Users).filter({ _id: id }).run();
    ZHttpAssert.assert(blobs.length > 0, () => new NotFoundException('Unable to log out a user that does not exist.'));
    const user = blobs[0];

    await this._dal.update(Collections.Users, { logout: utc().unix() }).filter({ _id: user._id }).run();
    const updated = await this._dal.read<IZUser>(Collections.Users).filter({ _id: id }).run();
    return new ZUserBuilder().copy(updated[0]).redact().user();
  }
}
