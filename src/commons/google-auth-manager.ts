import { LoginTokens } from '../commons/login-tokens';

const globalOauth2ClientSettings: OAuth2ClientOptions = {
  clientId: '1061841266327-8k3vdca5tbbmdiqqkobr8o9eeo81bjom.apps.googleusercontent.com',
  clientSecret: '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',
  redirectUri: 'http://localhost',
};

export class GoogleAuthManager {
  private loginTokens = LoginTokens.getInstance()

  isLogin(): boolean {
    const tokens = this.loginTokens.load();
    if(tokens){
      return tokens.expiry_date < new Date().getTime()
    }
    return false
  }

  getToken(): String {
    const tokens = this.loginTokens.load();
  }
}