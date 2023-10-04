export interface GoogleAuthInitializeConfigModel {
  clientId: string;
  androidClientId?: string;
  iosClientId?: string;
  serverClientId?: string;
  scopes: string[];
  grantOfflineAccess: boolean;
  forceCodeForRefreshToken?: boolean;
}
