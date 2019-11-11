// eslint-disable-next-line @typescript-eslint/no-unused-vars
class FreeeApi {
  protected api_: ApiImpl;

  private FreeeApiConst_ = {
    apiurlbase: 'https://api.freee.co.jp/api/1' as const,
    authorizeurl: 'https://secure.freee.co.jp/oauth/authorize' as const,
    tokenUrl: 'https://secure.freee.co.jp/oauth/token' as const
  };

  constructor(logger: ApiConst.LoggerInterface | undefined = undefined) {
    this.api_ = new ApiImpl(this.FreeeApiConst_.apiurlbase, logger);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private required_(varname: string, value: any): void {
    if (value === undefined || value === '') {
      throw new Error(`${varname}は必須です。`);
    }
  }

  /**
   * APIへのアクセスをする
   *
   * @param {ApiConst.HttpMethod} method GET、POST、PUT、DELETEのいずれかを指定
   * @param {string} urlPathFromBase アクセス先のAPIのアクセスポイント（例：/account_items/{id}）を指定
   * @param {{ [key: string]: any }} [params={}] API呼び出し時に使う引数を、オブジェクトで指定　※URLパラメータも、ここで指定する
   * @returns {*} 返り値をオブジェクトに変換したデータ
   * @memberof FreeeApi
   */
  public request(
    method: ApiConst.HttpMethod,
    urlPathFromBase: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: { [key: string]: any } = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    this.required_('method', method);
    this.required_('urlPathFromBase', urlPathFromBase);

    return this.api_.request(method, urlPathFromBase, params);
  }

  /**
   * freeeAPIのtoken発行を行う
   *
   * @param {string} clientId
   * @param {string} clientSecret
   * @memberof FreeeApi
   */
  public login(clientId: string, clientSecret: string): void {
    const params = this.setAuthParams_(clientId, clientSecret);
    this.api_.login(params);
  }

  /**
   * freeeAPI token発行時の、リダイレクトを受けたときに呼び出す
   *
   * @param {*} request
   * @param {string} clientId
   * @param {string} clientSecret
   * @returns {GoogleAppsScript.HTML.HtmlOutput}
   * @memberof FreeeApi
   */
  public authCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: any,
    clientId: string,
    clientSecret: string
  ): GoogleAppsScript.HTML.HtmlOutput {
    const params = this.setAuthParams_(clientId, clientSecret);
    return this.api_.authCallback(request, params);
  }

  /**
   * freeeAPIのtokenを破棄する
   *
   * @memberof FreeeApi
   */
  public logout(): void {
    this.api_.logout();
  }

  private setAuthParams_(clientId: string, clientSecret: string): AuthParams {
    const params = {} as AuthParams;

    params.authorizeurl = this.FreeeApiConst_.authorizeurl;
    params.tokenUrl = this.FreeeApiConst_.tokenUrl;
    params.clientId = clientId;
    params.clientSecret = clientSecret;

    return params;
  }
}
