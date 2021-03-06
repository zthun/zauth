import { IZProfile, ZProfileAvatarSize } from '@zthun/works.core';
import { ZUrlBuilder } from '@zthun/works.url';
import Axios from 'axios';
import md5 from 'md5';

/**
 * Gets the current profile from the standard api.
 *
 * @returns A promise that returns the current profile information.
 */
export async function getProfile(): Promise<IZProfile> {
  const url = new ZUrlBuilder().api().append('profiles').build();
  const profile = await Axios.get<IZProfile>(url);
  return profile.data;
}

/**
 * Same as getProfile but returns null in the case of an error.
 *
 * @returns The result from getProfile or null if an error occurred.
 */
export async function tryGetProfile(): Promise<IZProfile> {
  try {
    return await getProfile();
  } catch (err) {
    return null;
  }
}

/**
 * Helper method that retrieves the avatar url for a profile.
 *
 * @param profile The profile to retrieve the avatar url for.
 *
 * @returns The url to load for representation of the profile.
 */
export function getProfileAvatarUrl(profile: IZProfile) {
  const avatar = profile ? profile.avatar : null;
  const email = profile ? profile.email : null;
  return getAvatarUrl(avatar, email);
}

/**
 * Helper method that retrieves the avatar url for a given email and existing avatar.
 *
 * If falsy is passed for both the avatar and email, then the default avatar is returned.
 * If falsy is passed for the avatar and email is set, then the gravatar for the email is returned.
 * If the avatar is set, then it is returned.
 *
 * @param avatar The current avatar url to check.
 * @param email The email to use in the case that the avatar is falsy.
 *
 * @returns The url to load for the profile.
 */
export function getAvatarUrl(avatar: string, email: string) {
  return avatar || new ZUrlBuilder().gravatar(email ? md5(email) : '', ZProfileAvatarSize).build();
}

/**
 * Gets the display for the profile.
 *
 * @param profile The profile to convert to a display string.
 *
 * @returns The appropriate display for the profile.
 */
export function getProfileDisplay(profile: IZProfile) {
  const display = profile ? profile.display : '';
  const email = profile ? profile.email : '';
  return display || email || '';
}
