/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AbstractStoreState } from '@ng-techpromux-archetype-project/core-api';
import { AuthPayloadModel } from '../../model/auth-payload.model';
import { AuthProviderModel } from '../../model/auth-provider.model';
import { AuthTokenModel } from '../../model/auth-token.model';
import { AuthUserStoreModel } from '../../model/auth-user-data.model';
import { AuthUserPermissionsModel } from '../../model/auth-user-permissions.model';
import { AuthChangeExtraDataStoreAction } from '../action/auth-change-extra-data-store.action';
import { AuthChangeIsDataLoadedFromStorageStoreAction } from '../action/auth-change-is-data-loaded-from-storage-store.action';
import { AuthChangePayloadStoreAction } from '../action/auth-change-payload-store.action';
import { AuthChangeProviderStoreAction } from '../action/auth-change-provider-store.action';
import { AuthChangeTokenStoreAction } from '../action/auth-change-token-store.action';
import { AuthChangeUserDataStoreAction } from '../action/auth-change-user-data-store.action';
import { AuthChangeUserPermissionsStoreAction } from '../action/auth-change-user-permissions-store.action';
import { AuthDoLoginSuccessfullyStoreAction } from '../action/auth-do-login-successfully-store.action';
import { AuthDoLogoutSuccessfullyStoreAction } from '../action/auth-do-logout-successfully-store.action';
import { AuthStoreModel } from '../model/auth-store.model';
import { AUTH_STATE_TOKEN } from '../variable/variables';

@State<AuthStoreModel>({
  name: AUTH_STATE_TOKEN,
  defaults: AuthStoreState.getStoredDefaultsValue(),
})
@Injectable()
export class AuthStoreState extends AbstractStoreState {
  static override getStoredDefaultsValue(): AuthStoreModel {
    return {
      provider: null,
      payload: null,
      token: null,
      userData: null,
      userPermissions: null,
      extraData: null,
      loadedFromStore: true,
      loggedAt: null,
      logged: false,
    };
  }

  static override getStoredKeys(prefix: string = ''): string[] {
    return [
      'logged',
      'loggedAt',
      'payload',
      'provider',
      'token',
      'userData',
      'userPermissions',
      'userData',
    ].map(
      (key) =>
        (prefix && prefix !== '' ? prefix + '.' : '') + 'auth' + '.' + key
    );
  }

  // ----------------------------------------------------------

  @Selector()
  static getPayload(state: AuthStoreModel): AuthPayloadModel | null {
    return state.payload;
  }

  @Selector()
  static getProvider(state: AuthStoreModel): AuthProviderModel | null {
    return state.provider;
  }

  @Selector()
  static getProviderId(state: AuthStoreModel): string | null {
    return state.provider?.providerId ? state.provider?.providerId : null;
  }

  @Selector()
  static getToken(state: AuthStoreModel): AuthTokenModel | null {
    return state.token;
  }

  @Selector()
  static getAccessToken(state: AuthStoreModel): string | null {
    return state.token?.accessToken ? state.token?.accessToken : null;
  }

  @Selector()
  static getUserData(state: AuthStoreModel): AuthUserStoreModel | null {
    return state.userData;
  }

  @Selector()
  static getUserName(state: AuthStoreModel): string | null {
    return state.userData?.userName ? state.userData?.userName : null;
  }

  @Selector()
  static getUserPermissions(
    state: AuthStoreModel
  ): AuthUserPermissionsModel | null {
    return state.userPermissions;
  }

  @Selector()
  static getExtraData(state: AuthStoreModel): any | null {
    return state.extraData;
  }

  @Selector()
  static isLogged(state: AuthStoreModel): boolean {
    return state.logged;
  }

  @Selector()
  static getIsDataLoadedFromStorage(state: AuthStoreModel): boolean | null {
    return state.loadedFromStore;
  }

  // ----------------------------------------------------------

  @Action(AuthChangePayloadStoreAction)
  changePayload(
    ctx: StateContext<AuthStoreModel>,
    action: AuthChangePayloadStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      payload: action.payload,
    });
  }

  @Action(AuthChangeProviderStoreAction)
  changeProvider(
    ctx: StateContext<AuthStoreModel>,
    action: AuthChangeProviderStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      provider: action.provider,
    });
  }

  @Action(AuthChangeTokenStoreAction)
  changeToken(
    ctx: StateContext<AuthStoreModel>,
    action: AuthChangeTokenStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      token: action.token,
    });
  }

  @Action(AuthChangeUserDataStoreAction)
  changeUserData(
    ctx: StateContext<AuthStoreModel>,
    action: AuthChangeUserDataStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      userData: action.userData,
    });
  }

  @Action(AuthChangeUserPermissionsStoreAction)
  changeUserPermissions(
    ctx: StateContext<AuthStoreModel>,
    action: AuthChangeUserPermissionsStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      userPermissions: action.userPermissions,
    });
  }

  @Action(AuthChangeExtraDataStoreAction)
  changeExtraData(
    ctx: StateContext<AuthStoreModel>,
    action: AuthChangeExtraDataStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      extraData: action.extraData,
    });
  }

  @Action(AuthChangeIsDataLoadedFromStorageStoreAction)
  setIsDataLoadedFromStorage(
    ctx: StateContext<AuthStoreModel>,
    action: AuthChangeIsDataLoadedFromStorageStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      logged: action.loadedFromStorage,
      loadedFromStore: true,
    });
  }

  @Action(AuthDoLoginSuccessfullyStoreAction)
  doLoginSuccessfully(
    ctx: StateContext<AuthStoreModel>,
    action: AuthDoLoginSuccessfullyStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      logged: action.loggedIn,
      loggedAt: new Date().toISOString(),
      loadedFromStore: false,
    });
  }

  @Action(AuthDoLogoutSuccessfullyStoreAction)
  doLogoutSuccessfully(
    ctx: StateContext<AuthStoreModel>,
    action: AuthDoLogoutSuccessfullyStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      logged: !action.loggedOut,
      loggedAt: null,
      loadedFromStore: false,
    });
  }
}
