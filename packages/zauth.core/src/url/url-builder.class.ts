import { trim, trimEnd, trimStart } from 'lodash';
import URLParse from 'url-parse';

/**
 * Represnets an object that is helpful in building a url.
 */
export class ZUrlBuilder {
  /**
   * A mapping between protocol and default port.
   */
  public static ProtocolPorts = {
    http: 80,
    https: 443,
    ftp: 21,
    sftp: 22,
    ssh: 22,
    smtp: 25,
    smb: 445,
  };

  /**
   * Gets whether the given protocols default port is port.
   *
   * There are some special behaviors.
   * 1.  If the port is falsy then this method returns true.
   * 2.  If the port is NaN, then this method returns true.
   * 3.  If the port is a string that evaluates to 0, then this method returns true.
   * 4.  If port is less than 0, then this method returns true.
   *
   * @param protocol The protocol to check.
   * @param port The port to compare.
   *
   * @returns True if the default port for protocol is port.
   */
  public static defaults(protocol: string, port: string | number): boolean {
    const nport = +port;

    if (isNaN(nport) || nport < 1) {
      return true;
    }

    return ZUrlBuilder.ProtocolPorts[protocol] === +port;
  }

  /**
   * The representation of the url object.
   */
  private readonly _url: {
    protocol: string,
    username: string,
    password: string,
    hostname: string,
    port: number,
    path: string[],
    hash: string,
    params: Array<{ key: string, val: string }>
  };

  /**
   * Initializes a new instance of this object.
   *
   * @param protocol The protocol to use.
   * @param hostname The hostname to connect with.
   */
  public constructor(protocol: string = 'http', hostname = 'localhost') {
    this._url = {
      protocol,
      hostname,
      username: null,
      password: null,
      port: null,
      path: ['/'],
      hash: '',
      params: []
    };
  }

  /**
   * Parses an existing url and sets all properties.
   *
   * If you give this a path without the protocol and hostname, then it will
   * automatically append the protocol and host of the browser window if it
   * exists.
   *
   * This method sets all the properties so if you need to modify the url before
   * parsing it, it is best to always call this method first.
   *
   * @param url The url to parse.
   *
   * @returns This object.
   */
  public parse(url: string) {
    const current = new URLParse(url, true);

    this.protocol(current.protocol)
      .username(current.username)
      .password(current.password)
      .hostname(current.hostname)
      .hash(current.hash)
      .path(current.pathname)
      .port(current.port ? +current.port : null);

    Object.keys(current.query).forEach((key) => this.param(key, current.query[key]));

    return this;
  }

  /**
   * Sets the protocol.
   *
   * @param protocol The protocol.
   *
   * @return This object.
   */
  public protocol(protocol: string): this {
    this._url.protocol = protocol;
    return this;
  }

  /**
   * Sets the user name.
   *
   * Used for things like ssh and ftp.
   *
   * @param user The username
   *
   * @returns This object.
   */
  public username(user: string): this {
    this._url.username = user;
    return this;
  }

  /**
   * Sets the password.
   *
   * This is only valid if the username is set.
   *
   * @param pwd The user password.
   *
   * @returns This object.
   */
  public password(pwd: string): this {
    this._url.password = pwd;
    return this;
  }

  /**
   * Sets the host name.
   *
   * This sets the entire hostname as the root domain.  This
   * will blow away any subdomains added, so it's best to
   * call this method first.
   *
   * @param host The hostname.
   *
   * @return This object.
   */
  public hostname(host: string): this {
    this._url.hostname = host;
    return this;
  }

  /**
   * Adds a subdomain in front of the hostname.
   *
   * If a hostname was never set, then domain becomes the hostname.
   *
   * @param domain The domain to append.
   *
   * @returns This object.
   */
  public subdomain(domain: string): this {
    this._url.hostname = this._url.hostname ? `${domain}.${this._url.hostname}` : domain;
    return this;
  }

  /**
   * Sets the port.
   *
   * @param port The port.
   *
   * @return This object.
   */
  public port(port: number): this {
    this._url.port = port;
    return this;
  }

  /**
   * Removes all existing path segments and restarts the path.
   *
   * @param path The starting path.
   *
   * @return This object.
   */
  public path(path: string): this {
    this._url.path = [path];
    return this;
  }

  /**
   * Appends a path segment.
   *
   * @param path The segment to append.
   *
   * @returns This object.
   */
  public append(path: string): this {
    this._url.path.push(path);
    return this;
  }

  /**
   * Sets the hash section.
   *
   * @param hash The hash section.
   *
   * @return This object.
   */
  public hash(hash: string): this {
    this._url.hash = hash;
    return this;
  }

  /**
   * Adds a search parameter.
   *
   * This version assumes that value is not null.
   *
   * @param key The parameter key.
   * @param val The parameter value.
   *
   * @return This object.
   */
  public param(key: string, val: string): this {
    this._url.params.push({ key, val });
    return this;
  }

  /**
   * Builds the url string and returns it.
   *
   * @return The url string.
   */
  public build(): string {
    const search = this._url.params.map((param) => `${param.key}=${encodeURIComponent(param.val)}`).join('&');
    const user = trim(this._url.username);
    const password = trim(this._url.password);
    let protocol = trim(this._url.protocol);
    let host = trim(this._url.hostname);
    let port = String(this._url.port);
    let hash = trim(this._url.hash);
    let path = this._url.path.map((segment) => trim(segment, '/')).join('/');
    let credentials = '';

    protocol = trimEnd(protocol, '/:');
    host = trim(host, '/');
    hash = trimStart(hash, '#');
    path = trim(path, '/');

    if (ZUrlBuilder.defaults(protocol, port)) {
      port = '';
    } else {
      port = `:${port}`;
    }

    if (user) {
      credentials = password ? `${user}:${password}@` : `${user}@`;
    }

    let url = `${protocol}://${credentials}${host}${port}`;

    if (path) {
      url = `${url}/${path}`;
    }

    if (search) {
      url = `${url}/?${search}`;
    }

    if (hash) {
      url = `${url}#${hash}`;
    }

    return url;
  }
}
