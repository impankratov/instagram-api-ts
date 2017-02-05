import { assert } from 'chai';
import * as nock from 'nock';

import { Instagram } from './index';
import { Envelope } from './interfaces';

describe('Instagram', () => {
  it('should be a class', () => {
    const instagram = new Instagram({ accessToken: 'someToken' });
    assert.ok(instagram instanceof Instagram);
  });

  it('should ignore empty base option for api calls', () => {
    const instagram = new Instagram({
      accessToken: 'someToken',
      base: ''
    });
    assert.equal(instagram.base, 'https://api.instagram.com/v1/');
  });

  it('should set accessToken', () => {
    const instagram = new Instagram({
      accessToken: 'shhhDontTellNobody'
    });
    assert.equal(instagram.accessToken, 'shhhDontTellNobody');
  });

  it('should notify if no accessToken provided for constructor', () => {
    const instagram = () => new Instagram({ accessToken: '' });
    assert.throw(instagram, Error, `Invalid access token!`);
  });

  it('should set clientId', () => {
    const instagram = new Instagram({
      accessToken: 'someToken',
      clientId: 'funkyId'
    });
    assert.equal(instagram.clientId, 'funkyId');
  });

  describe('#get', () => {
    const instagram = new Instagram({
      accessToken: 'anotherOne',
    });

    it('should make get request', async () => {
      const endpoint = 'tag/sunset';

      nock('https://api.instagram.com')
        .get(`/v1/${endpoint}`)
        .query({ access_token: 'anotherOne' })
        .reply(200, 'success');

      const result = await instagram.get(endpoint);
      assert.equal(result, 'success');
    });

    it('should catch error', async () => {
      const endpoint = 'tag/sunset';
      const error = 'Nasty error';

      nock('https://api.instagram.com')
        .get(`/v1/${endpoint}`)
        .query({ access_token: 'anotherOne' })
        .reply(400, error);

      instagram.get(endpoint)
        .catch(e => assert.equal(e, error))
    });
  });

  describe('#isInstagramError', async () => {
    const instagram = new Instagram({
      accessToken: 'anotherOne',
    });

    it('should detect instagram error', async () => {
      const endpoint = 'tag/sunset';
      const error = {
        meta: {
          error_message: 'This request requires scope=public_content, but this access token is not authorized with this scope. The user must re-authorize your application with scope=public_content to be granted this permissions.',
          code: 400,
          error_type: 'OAuthPermissionsException'
        }
      };

      const result = instagram.isInstagramError(error);
      assert.equal(result, true);
    });

    it('should detect other error', async () => {
      const endpoint = 'tag/sunset';
      const error = new Error('Watch out!');

      const result = instagram.isInstagramError(error);
      assert.equal(result, false);
    });
  });

});
