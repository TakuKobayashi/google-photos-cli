import path from 'path';
import os from 'os';
import fs from 'fs';
import { Credentials } from 'google-auth-library';

export class LoginTokens {
  private static instance: LoginTokens;
  private tokenFilePath = path.join(os.homedir(), `.google-photosrc.json`);
  private cachedCredentials?: Credentials = undefined;

  private constructor() {}

  update(credentials: Credentials) {
    const currentTokens = this.load();
    const newTokens = { ...currentTokens, ...credentials };
    fs.writeFileSync(this.tokenFilePath, JSON.stringify(newTokens));
    this.cachedCredentials = newTokens;
  }

  load(): Credentials {
    if (!fs.existsSync(this.tokenFilePath)) {
      return {};
    }
    if (this.cachedCredentials) {
      return this.cachedCredentials;
    }
    const tokensJsonString = String(fs.readFileSync(this.tokenFilePath));
    const tokens = JSON.parse(tokensJsonString) as Credentials;
    this.cachedCredentials = tokens;
    return tokens;
  }

  clear() {
    this.cachedCredentials = undefined;
    fs.unlinkSync(this.tokenFilePath);
  }

  static getInstance(): LoginTokens {
    if (!LoginTokens.instance) {
      LoginTokens.instance = new LoginTokens();
    }

    return LoginTokens.instance;
  }
}
