export interface AuthTokenModel {
  tokenType: string | null | undefined;
  idToken: string | null | undefined;
  accessToken: string | null | undefined;
  expiresIn: number | null | undefined;
  expiresAt: Date | null | undefined;
  refreshToken: string | null | undefined;
  tokenData: unknown | null | undefined;
}
