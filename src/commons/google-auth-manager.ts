import { GenerateAuthUrlOpts, OAuth2ClientOptions, OAuth2Client, Credentials } from 'google-auth-library';
import { LoginTokens } from '../commons/login-tokens';
import open from 'open';
const Photos = require('googlephotos');

const globalOauth2ClientSettings: OAuth2ClientOptions = {
  clientId: '1061841266327-8k3vdca5tbbmdiqqkobr8o9eeo81bjom.apps.googleusercontent.com',
  clientSecret: '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',
  redirectUri: 'http://localhost',
};

export class GoogleAuthManager {
  private loginTokens = LoginTokens.getInstance();
  private oauth2Client?: OAuth2Client;

  isLogin(): boolean {
    const tokens = this.loginTokens.load();
    if (tokens && tokens.expiry_date) {
      return tokens.expiry_date! > new Date().getTime();
    }
    return false;
  }

  async getActivateAccessToken(): Promise<String> {
    const tokens = this.loginTokens.load();
    if (this.isLogin() && tokens.access_token) {
      return tokens.access_token;
    } else if (tokens.refresh_token) {
      const newTokens = await this.refreshAccessToken();
      if (newTokens.access_token) {
        return newTokens.access_token;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  async refreshAccessToken(): Promise<Credentials> {
    if (!this.oauth2Client) {
      this.oauth2Client = new OAuth2Client(globalOauth2ClientSettings);
    }
    const prevTokens = this.loginTokens.load();
    this.oauth2Client.setCredentials(prevTokens);
    const response = await this.oauth2Client.refreshAccessToken();
    this.loginTokens.update(response.credentials);
    return response.credentials;
  }

  openLoginPage(options: Partial<OAuth2ClientOptions>) {
    const oauthClientAuthUrlOptions: GenerateAuthUrlOpts = {
      access_type: 'offline',
      scope: [Photos.Scopes.READ_ONLY, Photos.Scopes.SHARING],
    };
    this.oauth2Client = new OAuth2Client({ ...globalOauth2ClientSettings, ...options });
    const authUrl = this.oauth2Client.generateAuthUrl(oauthClientAuthUrlOptions);
    open(authUrl);
  }

  async updateLoginTokens(authCode: string): Promise<void> {
    if (this.oauth2Client) {
      const { tokens } = await this.oauth2Client.getToken(authCode);
      this.loginTokens.update(tokens);
    }
  }

  logout() {
    const tokens = this.loginTokens.load();
    if (tokens.access_token) {
      const client = new OAuth2Client({ ...globalOauth2ClientSettings });
      client.revokeToken(tokens.access_token);
    }
    this.loginTokens.clear();
  }
}
