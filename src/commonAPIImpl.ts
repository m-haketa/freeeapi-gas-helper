/* eslint-disable @typescript-eslint/no-explicit-any */
import { Auth, AuthParams } from './oauthWrapper';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ApiImpl {
  private Logger_: ApiConst.LoggerInterface | undefined;
  private apiurlbase_: string;
  private auth_: Auth;

  public constructor(
    apiurlbase: string,
    params: AuthParams,
    logger: ApiConst.LoggerInterface | undefined = undefined
  ) {
    this.Logger_ = logger;
    this.apiurlbase_ = apiurlbase;
    this.auth_ = new Auth(params);
  }

  public request(
    method: ApiConst.HttpMethod,
    urlPathFromBase: string,
    params: { [key: string]: any } = {},
    headers: { [key: string]: string } = {}
  ): any {
    //paramsに明示的にundefinedが渡された場合にも対応できるように追記
    if (params === undefined) {
      params = {};
    }

    const res = this.sendAPIRequest_(method, urlPathFromBase, params, headers);

    try {
      const content = res.getContentText();
      const items = JSON.parse(content);
      return items;
    } catch {
      //CSVデータの場合。Shift_JISコードのようなので、文字コード変換して返す
      return res.getContentText('Shift_JIS');
    }
  }

  public login(): void {
    this.auth_.login();
  }

  public authCallback(request: any): GoogleAppsScript.HTML.HtmlOutput {
    return this.auth_.authCallback(request);
  }

  public logout(): void {
    this.auth_.logout();
  }

  private log_(str: string): void {
    if (this.Logger_ === undefined) {
      return;
    }

    this.Logger_.log(str);
  }

  private getToken_(): string {
    const token = this.auth_.getToken();

    this.log_(`token: ${token}`);
    return token;
  }

  private sendAPIRequest_(
    method: ApiConst.HttpMethod,
    urlPathFromBase: string,
    params: { [key: string]: any } = {},
    headers: { [key: string]: string } = {},
    deleteParams = true
  ): GoogleAppsScript.URL_Fetch.HTTPResponse {
    headers['Authorization'] = 'Bearer ' + this.getToken_();

    //urlPathFromBaseの中に {id} のような引数指定が必要なものがある場合
    //params、urlPathFromBaseを置き換える
    ({ params, urlPathFromBase } = this.moveParamsToURL_(
      params,
      urlPathFromBase,
      deleteParams
    ));

    let url = this.apiurlbase_ + urlPathFromBase;

    const options = {
      method: method,
      headers: headers,
      muteHttpExceptions: true
    } as any;

    if (method === 'get') {
      url += this.buildParams_(params);
    } else {
      headers['Content-Type'] = 'application/json';
      options.payload = JSON.stringify(params);
    }

    this.log_(`url:${url}`);
    this.log_(`options:` + JSON.stringify(options));
    this.log_(`optons.payload:${options.payload}`);

    const res = UrlFetchApp.fetch(url, options);
    this.log_(
      'UrlFetch Response(' + res.getResponseCode() + '):' + res.getContentText()
    );

    return res;
  }

  private buildKeyValue_(key: string, value: string[] | string): string {
    const objectType = Object.prototype.toString.call(value);
    if (objectType === '[object Array]') {
      return (value as string[])
        .map(value => {
          return `${key}[]=` + encodeURIComponent(value);
        })
        .join('&');
    } else {
      return key + '=' + encodeURIComponent(value as string);
    }
  }

  private buildParams_(params: { [key: string]: any }): string {
    if (Object.keys(params).length === 0) {
      return '';
    }

    const paramstring = Object.keys(params)
      .map(key => this.buildKeyValue_(key, params[key]))
      .join('&');

    return '?' + paramstring;
  }

  //パラメータのうちURLで指定すべきものをURL表示に変更する
  //同時にparamsからそのパラメータを削除する（deleteParamsがtrueの場合のみ）
  private moveParamsToURL_(
    params: { [key: string]: any },
    urlPathFromBase: string,
    deleteParams = true
  ): { params: { [key: string]: any }; urlPathFromBase: string } {
    //paramsを、delete ...で一部引数を削除する可能性があるため。
    //引数paramsに影響を与えないようにdeep copyをする。
    //replace内で、paramsDeletedからプロパティをdeleteする
    const paramsDeleted = JSON.parse(JSON.stringify(params));

    const urlPathReplaced = urlPathFromBase.replace(
      /{(.*?)}/g,
      (_, varName) => {
        if (!(varName in paramsDeleted)) {
          //該当パラメータないときは、URL引数を付け加えない
          throw new Error('必要な引数（' + varName + '）が含まれていません。');
        }

        //deleteする場合に備えて、返り値として使う値を、一旦変数に退避
        const ret = paramsDeleted[varName];

        if (deleteParams) {
          delete paramsDeleted[varName];
        }

        return ret;
      }
    );

    return {
      params: paramsDeleted,
      urlPathFromBase: urlPathReplaced
    };
  }
}
