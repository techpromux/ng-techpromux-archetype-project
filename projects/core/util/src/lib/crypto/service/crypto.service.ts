/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { UTIL_CRYPTO_SECRET_KEY_TOKEN } from '../variable/variables';

@Injectable()
export class CryptoService {
  private readonly token: string;

  private secretKey: string = inject<string>(UTIL_CRYPTO_SECRET_KEY_TOKEN);

  constructor() {
    this.token = this.generateSecretToken();
  }

  private generateSecretToken(): string {
    return (
      this.md5(((this.secretKey ? this.secretKey : '') + '_SECRET').trim()) +
      '0123456789123456'
    ).substring(0, 16);
  }

  public md5(str: string): string {
    return CryptoJS.MD5(str ? str : '').toString();
  }

  public encrypt(str: string): string {
    const _key = CryptoJS.enc.Utf8.parse(this.token);
    const _iv = CryptoJS.enc.Utf8.parse(this.token);
    const encrypted = CryptoJS.AES.encrypt(str ? str : '', _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  public decrypt(str: string): string {
    const _key = CryptoJS.enc.Utf8.parse(this.token);
    const _iv = CryptoJS.enc.Utf8.parse(this.token);
    const decrypted = CryptoJS.AES.decrypt(str, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
