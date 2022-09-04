import { GenerateAuthUrlOpts, OAuth2ClientOptions, OAuth2Client } from 'google-auth-library';
import { createServer, Server, ServerResponse, IncomingMessage } from 'http';
import { AddressInfo } from 'net';
import enableDestroy from 'server-destroy';
import { ReadonlyDeep } from 'type-fest';
import { LoginTokens } from '../commons/login-tokens';
import open from 'open';
const Photos = require('googlephotos');

const globalOauth2ClientSettings: OAuth2ClientOptions = {
  clientId: '1061841266327-8k3vdca5tbbmdiqqkobr8o9eeo81bjom.apps.googleusercontent.com',
  clientSecret: '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',
  redirectUri: 'http://localhost',
};
const scopes = [Photos.Scopes.READ_ONLY, Photos.Scopes.SHARING];
const oAuth2ClientAuthUrlOptions: GenerateAuthUrlOpts = { access_type: 'offline', scope: scopes };

export async function login(options: any): Promise<void> {
  const server = await startLocalServer();
  // { address: '::', family: 'IPv6', port: 50441 } のような形でportの値のみを取得する
  const { port } = server.address() as AddressInfo;
  const client = new OAuth2Client({ ...globalOauth2ClientSettings, redirectUri: `http://localhost:${port}` });
  const authUrl = client.generateAuthUrl(oAuth2ClientAuthUrlOptions);
  open(authUrl);
  const authCode = await recieveOauthCallbackCode(server);
  server.destroy();
  //tokens: {
  //  access_token: '...',
  //  scope: 'https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.sharing',
  //  token_type: 'Bearer',
  //  expiry_date: 1662268930323
  //},
  //res: {
  //  config: {},
  //  data: {}
  //}
  // こんな感じのデータのtokensだけ取得する
  const { tokens } = await client.getToken(authCode);
  console.log(tokens);
  LoginTokens.getInstance().update(tokens);
}

async function startLocalServer(): Promise<Server> {
  return new Promise<Server>((resolve) => {
    const server = createServer();
    enableDestroy(server);
    server.listen(0, () => resolve(server));
  });
}

async function recieveOauthCallbackCode(server: Server): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    server.on('request', (request: ReadonlyDeep<IncomingMessage>, response: ReadonlyDeep<ServerResponse>) => {
      const urlParts = new URL(request.url ?? '', 'http://localhost').searchParams;
      const code = urlParts.get('code');
      const error = urlParts.get('error');
      if (code) {
        resolve(code);
      } else {
        reject(error);
      }
      response.end('Logged in! You may close this page. ');
    });
  });
}
