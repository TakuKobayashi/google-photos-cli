import { createServer, Server, ServerResponse, IncomingMessage } from 'http';
import { AddressInfo } from 'net';
import enableDestroy from 'server-destroy';
import { ReadonlyDeep } from 'type-fest';
import { GoogleAuthManager } from '../commons/google-auth-manager';

export async function login(options: any): Promise<void> {
  const server = await startLocalServer();
  // { address: '::', family: 'IPv6', port: 50441 } のような形でportの値のみを取得する
  const { port } = server.address() as AddressInfo;
  const googleAuthManager = new GoogleAuthManager();
  googleAuthManager.openLoginPage({ redirectUri: `http://localhost:${port}` });
  const authCode = await recieveOauthCallbackCode(server).finally(() => {
    server.destroy();
  });
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
  return googleAuthManager.updateLoginTokens(authCode);
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
