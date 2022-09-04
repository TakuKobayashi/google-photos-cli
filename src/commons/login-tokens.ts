import path from 'path';
import os from 'os';
import fs from 'fs';
import { Credentials } from 'google-auth-library';

export class LoginTokens {
  private static instance: LoginTokens;
  private tokenFilePath = path.join(os.homedir(), `.google-photosrc.json`);
  private constructor() {}

  update(credentials: Credentials) {
    const currentTokens = this.load();
    fs.writeFileSync(this.tokenFilePath, JSON.stringify({ ...currentTokens, ...credentials }));
  }

  load(): Credentials {
    if (!fs.existsSync(this.tokenFilePath)) {
      return {};
    }
    const tokensJsonString = String(fs.readFileSync(this.tokenFilePath));
    const tokens = JSON.parse(tokensJsonString) as Credentials;
    return tokens;
  }

  static getInstance(): LoginTokens {
    if (!LoginTokens.instance) {
      LoginTokens.instance = new LoginTokens();
    }

    return LoginTokens.instance;
  }
}
