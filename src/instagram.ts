import * as requestPromise from 'request-promise-native';
import { RequestPromiseOptions, RequestPromise } from 'request-promise-native';
import { RequestAPI, RequiredUriUrl } from 'request';

import { Options, Envelope, EnvelopeError } from './index';

/**
 * Instagram
 */
export default class Instagram {
  private rp: RequestAPI<RequestPromise, RequestPromiseOptions, RequiredUriUrl>;
  public base: string = `https://api.instagram.com/v1/`;
  public accessToken: string;
  public clientId: string;

  constructor(options: Options) {
    if (!options.accessToken) {
      throw new Error(`Invalid access token!`);
    }

    this.accessToken = options.accessToken;
    this.clientId = options.clientId;
    this.base = options.base || this.base;

    this.rp = requestPromise.defaults({
      baseUrl: this.base,
      json: true,
      qs: {
        access_token: this.accessToken
      }
    })
  }
  
  public get(endpoint: string, callback?: Function): Promise<Envelope> {
    return this.rp.get(endpoint)
      .then(res => res as Envelope)
      .catch(err => err);
  }

  public isInstagramError(err: any): boolean {
    const keys = err.meta
      && err.meta.code
      && err.meta.error_type
      && err.meta.error_message;
    return keys ? true : false;
  }
}