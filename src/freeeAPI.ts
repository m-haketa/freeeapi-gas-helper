import { ApiImpl } from './commonAPIImpl';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class FreeeApi {
  protected api_: ApiImpl;

  private FreeeApiConst_ = {
    apiurlbase: 'https://api.freee.co.jp' as const,
    authorizeurl:
      'https://accounts.secure.freee.co.jp/public_api/authorize' as const,
    tokenUrl: 'https://accounts.secure.freee.co.jp/public_api/token' as const,
  };

  // ^/api/[0-9]/
  private urlPathFromBaseRegex = /^\/api\/[0-9]\//;

  constructor(
    clientId: string,
    clientSecret: string,
    logger: ApiConst.LoggerInterface | undefined = undefined
  ) {
    this.api_ = new ApiImpl(
      this.FreeeApiConst_.apiurlbase,
      {
        authorizeurl: this.FreeeApiConst_.authorizeurl,
        tokenUrl: this.FreeeApiConst_.tokenUrl,
        clientId: clientId,
        clientSecret: clientSecret,
      },
      logger
    );
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
   * @param {string} urlPathFromBase アクセス先のAPIのアクセスポイント（例：/api/1/account_items/{id}）を指定
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

    if (!this.urlPathFromBaseRegex.test(urlPathFromBase)) {
      throw new Error(
        `urlPathFromBaseの形式が正しくありません。「/api/」の部分から指定してください。`
      );
    }

    const headers = { 'X-Api-Version': '2020-06-15' };
    return this.api_.request(method, urlPathFromBase, params, headers);
  }

  /**
   * freeeAPIのtoken発行を行う
   *
   * @param {string} clientId
   * @param {string} clientSecret
   * @memberof FreeeApi
   */
  public login(): void {
    this.api_.login();

    console.info(
      `（必要に応じて）スプレッドシートの操作画面に切り替えて、表示されたウィンドウから手動で認証処理をしてください。`
    );
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
    request: any
  ): GoogleAppsScript.HTML.HtmlOutput {
    return this.api_.authCallback(request);
  }

  /**
   * freeeAPIのtokenを破棄する
   *
   * @memberof FreeeApi
   */
  public logout(): void {
    this.api_.logout();
  }
}
