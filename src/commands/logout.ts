import { GoogleAuthManager } from '../commons/google-auth-manager';

export async function logout(options: any): Promise<void> {
  const googleAuthManager = new GoogleAuthManager();
  googleAuthManager.logout();
}
