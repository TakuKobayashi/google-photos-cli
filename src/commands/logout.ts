import { GenerateAuthUrlOpts, OAuth2ClientOptions, OAuth2Client } from 'google-auth-library';
import { LoginTokens } from '../commons/login-tokens';

const globalOauth2ClientSettings: OAuth2ClientOptions = {
  clientId: '1061841266327-8k3vdca5tbbmdiqqkobr8o9eeo81bjom.apps.googleusercontent.com',
  clientSecret: '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',
  redirectUri: 'http://localhost',
};

export async function logout(options: any): Promise<void> {
  const tokens = LoginTokens.getInstance().load();
  if (tokens.access_token) {
    const client = new OAuth2Client({ ...globalOauth2ClientSettings });
    client.revokeToken(tokens.access_token);
  }
  LoginTokens.getInstance().clear();
}
