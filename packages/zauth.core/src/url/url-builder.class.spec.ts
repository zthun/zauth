import { ZUrlBuilder } from './url-builder.class';

describe('ZUrlBuilder', () => {
  let protocol: string;
  let host: string;

  beforeEach(() => {
    protocol = 'https';
    host = 'facebook.com';
  });

  function assertBuildsUrl(expected: string, buildFn: (target: ZUrlBuilder) => ZUrlBuilder) {
    // Arrange
    const target = new ZUrlBuilder(protocol, host);
    // Act
    const actual = buildFn(target).build();
    // Assert
    expect(actual).toEqual(expected);
  }

  describe('Parts', () => {
    it('sets the correct protocol.', () => {
      const expected = `${protocol}://${host}`;
      assertBuildsUrl(expected, (t) => t.protocol(protocol));
    });

    it('cleans the protocol.', () => {
      const expected = `${protocol}://${host}`;
      assertBuildsUrl(expected, (t) => t.protocol(`${protocol}://`));
    });

    it('sets the correct host.', () => {
      const expected = `${protocol}://www.yahoo.com`;
      assertBuildsUrl(expected, (t) => t.hostname('www.yahoo.com'));
    });

    it('cleans the host.', () => {
      const expected = `${protocol}://${host}`;
      assertBuildsUrl(expected, (t) => t.hostname(`////////${host}////`));
    });

    it('sets the correct path.', () => {
      const expected = `${protocol}://${host}/a/b/c/d`;
      assertBuildsUrl(expected, (t) => t.append('a/b').append('/c/d/'));
    });

    it('cleans the path.', () => {
      const expected = `${protocol}://${host}/a/b/c/d`;
      assertBuildsUrl(expected, (t) => t.append('////a/b/////').append('c').append('/d///'));
    });

    it('sets the hash.', () => {
      const expected = `${protocol}://${host}/a/b#abcd`;
      assertBuildsUrl(expected, (t) => t.append('/a/b').hash('abcd'));
    });

    it('sets the port.', () => {
      const expected = `${protocol}://${host}:8080`;
      assertBuildsUrl(expected, (t) => t.port(8080));
    });

    it('ignores port 0.', () => {
      const expected = `http://${host}`;
      assertBuildsUrl(expected, (t) => t.protocol('http').port(0));
    });

    it('ignores default ports.', () => {
      const expected = `http://${host}`;
      assertBuildsUrl(expected, (t) => t.protocol('http').port(80));
    });

    it('adds the search.', () => {
      const expected = `${protocol}://${host}/?paramA=a&paramB=b`;
      assertBuildsUrl(expected, (t) => t.param('paramA', 'a').param('paramB', 'b'));
    });

    it('adds a subdomain.', () => {
      const expected = `${protocol}://mail.${host}`;
      assertBuildsUrl(expected, (t) => t.subdomain('mail'));
    });

    it('sets the domain as the host if the host is not set.', () => {
      const expected = `${protocol}://mail`;
      assertBuildsUrl(expected, (t) => t.hostname('').subdomain('mail'));
    });

    it('encodes the parameter values.', () => {
      const valA = 'ab&cd&e//fg';
      const expected = `${protocol}://${host}/?paramA=${encodeURIComponent(valA)}`;
      assertBuildsUrl(expected, (t) => t.param('paramA', valA));
    });

    it('sets the user.', () => {
      const expected = `${protocol}://user@${host}`;
      assertBuildsUrl(expected, (t) => t.username('user'));
    });

    it('sets the password.', () => {
      const expected = `${protocol}://user:password@${host}`;
      assertBuildsUrl(expected, (t) => t.username('user').password('password'));
    });

    it('ignores the password if the user is not set.', () => {
      const expected = `${protocol}://${host}`;
      assertBuildsUrl(expected, (t) => t.password('password'));
    });
  });

  describe('Parsing', () => {
    function createParseTestTarget(url) {
      return new ZUrlBuilder().parse(url);
    }

    it('correctly parses a url.', () => {
      // Arrange
      const url = 'https://user:password@www.google.com:9086/foo/bar/?valA=a&valB=b#hhh';
      // Act
      const actual = createParseTestTarget(url).build();
      // Assert
      expect(actual).toEqual(url);
    });

    it('supports partial uri values.', () => {
      // Arrange
      const expected = '/foo/bar/?valA=a&valB=b#hhh';
      // Act
      const actual = new ZUrlBuilder().parse(expected).build();
      // Assert
      expect(actual.endsWith(expected)).toBeTruthy();
    });

    it('can be modified.', () => {
      // Arrange
      const url = 'https://google.com:9086/foo/bar#hhh';
      const expected = 'http://user:password@mail.google.com:9099/a/b/c/?valA=c&valB=d#h32';
      // Act
      const actual = createParseTestTarget(url)
        .protocol('http')
        .port(9099)
        .path('a')
        .append('b/c')
        .param('valA', 'c')
        .param('valB', 'd')
        .hash('h32')
        .username('user')
        .password('password')
        .subdomain('mail')
        .build();
      // Assert
      expect(actual).toEqual(expected);
    });

    it('can be modified to use a different port.', () => {
      // Arrange
      const url = 'https://www.google.com';
      const expected = 'https://www.google.com:9999';
      // Act
      const actual = createParseTestTarget(url).port(9999).build();
      // Assert
      expect(actual).toEqual(expected);
    });
  });
});
