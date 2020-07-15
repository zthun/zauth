import { Inject, Injectable } from '@nestjs/common';
import { IZDatabase } from '@zthun/works.dal';
import { IZLogin, IZProfile, IZUser, ZUserBuilder } from '@zthun/works.core';
import { compare, hash } from 'bcryptjs';
import { v4 } from 'uuid';
import { ZUsersCollections } from './users.collections';
import { ZUsersDatabase } from './users.database';

/**
 * Represents a service to manage the user database with business rules.
 */
@Injectable()
export class ZUsersService {
  /**
   * The password encryption rounds.
   */
  public static readonly BcryptRounds = 10;

  /**
   * Initializes a new instance of this object.
   *
   * @param _dal The data access layer.
   * @param _auth The auth service for simple tasks.
   */
  public constructor(@Inject(ZUsersDatabase.Token) private readonly _dal: IZDatabase) {}

  /**
   * Gets a list of all users in the database.
   *
   * @returns A promise that, when resolved, has returned all users.
   */
  public async list(): Promise<IZUser[]> {
    const users = await this._dal.read<IZUser>(ZUsersCollections.Users).run();
    return users;
  }

  /**
   * Gets a specific user by their id.
   *
   * @param _id The id of the user to find.
   *
   * @returns A promise that, when resolved, has the found user.  Returns undefined if no such user exists.
   */
  public async findById(_id: string): Promise<IZUser> {
    const filter = { _id };
    const [user] = await this._dal.read<IZUser>(ZUsersCollections.Users).filter(filter).run();
    return user;
  }

  /**
   * Gets a specific user by their email.
   *
   * @param email The email of the user to find.
   *
   * @returns A promise that, when resolved, has the found user by their email.  Returns null if no such user exists.
   */
  public async findByEmail(email: string): Promise<IZUser> {
    const filter = { email };
    const [user] = await this._dal.read<IZUser>(ZUsersCollections.Users).filter(filter).run();
    return user;
  }

  /**
   * Creates a new user.
   *
   * @param login The user to create from a login configuration.
   *
   * @returns A promise that, when resolved, has returned the new user.
   */
  public async create(login: IZLogin): Promise<IZUser> {
    const total = await this._dal.count(ZUsersCollections.Users).run();
    const password = await hash(login.password, ZUsersService.BcryptRounds);
    const builder = new ZUserBuilder().email(login.email).password(password);

    // This just generates a random key of some length up to 120ish
    const activator = v4();
    const create = total === 0 ? builder.super().active().build() : builder.inactive(activator).build();
    const [created] = await this._dal.create(ZUsersCollections.Users, [create]).run();
    return created;
  }

  /**
   * Updates an existing user.
   *
   * @param id The id of the user to update.
   * @param profile The profile template to update the user with.
   *
   * @returns A promise that, when resolved, has returned the updated user.
   */
  public async update(id: string, profile: IZProfile): Promise<IZUser> {
    const template: Partial<IZUser> = {};

    if (profile.hasOwnProperty('email')) {
      // Changing the email will cause the account to inactivate.
      const temp = new ZUserBuilder().email(profile.email).inactive(v4()).build();
      template.activator = temp.activator;
      template.email = temp.email;
    }

    if (profile.hasOwnProperty('password')) {
      template.password = await hash(profile.password, ZUsersService.BcryptRounds);
    }

    if (profile.hasOwnProperty('display')) {
      template.display = profile.display;
    }

    if (JSON.stringify(template) === JSON.stringify({})) {
      return await this.findById(id);
    }

    await this._dal.update<IZUser>(ZUsersCollections.Users, template).filter({ _id: id }).run();
    const [updated] = await this._dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: id }).run();

    return updated;
  }

  /**
   * Activates a user.
   *
   * @param user The user to activate.
   *
   * @return A promise that, when resolved, returns the updated user.
   */
  public async activate(user: IZUser): Promise<IZUser> {
    const copy = new ZUserBuilder().copy(user).build();
    copy.activator = null;
    await this._dal.update<IZUser>(ZUsersCollections.Users, copy).filter({ _id: copy._id }).run();
    const [updated] = await this._dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: copy._id }).run();
    return updated;
  }

  /**
   * Deactivates a user.
   *
   * This simply copies the existing user and adds a new activation code.  If the user is already
   * deactivated, then a new activation code is set with an updated expiration.
   *
   * @param user The user to deactivate.
   *
   * @return A promise that, when resolved, returns the updated user.
   */
  public async deactivate(user: IZUser): Promise<IZUser> {
    const copy = new ZUserBuilder().copy(user).inactive(v4()).build();
    await this._dal.update<IZUser>(ZUsersCollections.Users, copy).filter({ _id: copy._id }).run();
    const [updated] = await this._dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: copy._id }).run();
    return updated;
  }

  /**
   * Deletes an existing user.
   *
   * @param id The id of the user to  delete.
   *
   * @returns A promise that, when resolve, has returned the deleted user.
   */
  public async remove(id: string): Promise<IZUser> {
    const [user] = await this._dal.read<IZUser>(ZUsersCollections.Users).filter({ _id: id }).run();
    await this._dal.delete(ZUsersCollections.Users).filter({ _id: id }).run();
    return user;
  }

  /**
   * Compares the user and password to make sure it matches.
   *
   * @returns A promise that resolves to true if the credentials match.  False if they do not.
   */
  public async compare(credentials: IZLogin) {
    const user = await this.findByEmail(credentials.email);

    if (user == null) {
      return false;
    }

    const passwordsMatch = await compare(credentials.password, user.password);

    if (passwordsMatch) {
      return true;
    }

    return false;
  }
}
