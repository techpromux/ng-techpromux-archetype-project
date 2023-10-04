export interface AuthUserStoreModel {
  userName: string | null | undefined;

  email: string | null | undefined;
  fullName: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  photoUrl: string | null | undefined;

  locale: string | null | undefined;

  providerAuthId: string | null | undefined;
}
