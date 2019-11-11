//"userSymbol": "OAuth2",
//"libraryId": "1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF",
//"version": "33"

interface TokenPayload {
  code: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  grant_type: string;
}

//type TOKEN_FORMAT = 'application/json' | 'application/x-www-form-urlencoded'

declare class OAuth2 {
  public static createService(serviceName: string): OAuth2;
  public static getRedirectUri(optScriptId: string): string;

  public setAuthorizationBaseUrl(authorizationBaseUrl: string): OAuth2;
  public setTokenUrl(tokenUrl: string): OAuth2;
  public setRefreshUrl(refreshUrl: string): OAuth2;

  // string -> 本来はOAuth2.TOKEN_FORMATだが書き方がわからない
  public setTokenFormat(tokenFormat: string): OAuth2;

  // 合っているかよくわからない
  public setTokenHeaders(tokenHeaders: { [key: string]: string }): OAuth2;

  public setTokenPayloadHandler(
    tokenHandler: (tokenPayload: TokenPayload) => any
  ): OAuth2;

  public setCallbackFunction(callbackFunctionName: string): OAuth2;
  public setClientId(clientId: string): OAuth2;
  public setClientSecret(clientSecret: string): OAuth2;

  public setPropertyStore(
    propertyStore: GoogleAppsScript.Properties.Properties
  ): OAuth2;

  //any -> 本来はCacheService.Cache だが書き方がわからない。GoogleAppsScript.Cache.Cache?
  public setCache(cache: any): OAuth2;

  //any -> 本来はLockService.Lock だが書き方がわからない。GoogleAppsScript.Lock.Lock?
  public setLock(lock: any): OAuth2;

  // 引数の型が合っているか不明
  public setScope(scope: string[], optSeparator: string): OAuth2;

  public setParam(name: string, value: string): OAuth2;
  public setPrivateKey(privateKey: string): OAuth2;
  public setIssuer(issuer: string): OAuth2;

  // 引数の型が合っているか不明
  public setAdditionalClaims(additionalClaims: {
    [key: string]: string;
  }): OAuth2;

  public setSubject(subject: string): OAuth2;
  public setExpirationMinutes(expirationMinutes: string): OAuth2;
  public setGrantType(grantType: string): OAuth2;
  public setRedirectUri(redirectUri: string): OAuth2;
  public getRedirectUri(): string;

  // any -> 本来は{Object} optAdditionalParameters Additional parameters that should be stored in the state token and made available in the callback function
  public getAuthorizationUrl(optAdditionalParameters?: any): string;

  // any -> 本来は{Object} callbackRequest The request data recieved from the callback
  public handleCallback(callbackRequest: any): boolean;

  public hasAccess(): boolean;
  public getAccessToken(): string;
  public reset(): void;

  // any -> Exception
  public getLastError(): any;

  public refresh(): void;

  // any -> Storage?
  public getStorage(): any;

  public getToken(optSkipMemoryCheck?: boolean): any;
}
