/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace ApiConst {
  type HttpMethod = 'get' | 'post' | 'put' | 'delete';

  interface Auth {
    clientId: string;
    clientSecret: string;
    apiurlbase: string; // "https:// ....." ※末尾に/を付けない
    authorizeurl: string; // "https:// ....." ※末尾に/を付けない
    tokenUrl: string; // "https:// ....." ※末尾に/を付けない
  }

  interface LogFunction {
    (message: any): LoggerInterface;
  }

  interface LoggerInterface {
    log: LogFunction;
  }
}

declare namespace FreeeApiGasHelper {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class FreeeApi {
    constructor(logger?: ApiConst.LoggerInterface | undefined);

    request(
      method: ApiConst.HttpMethod,
      urlPathFromBase: string,
      params?: { [key: string]: any }
    ): any;

    public login(clientId: string, clientSecret: string): void;
    public logout(): void;
    public authCallback(
      request: any,
      clientId: string,
      clientSecret: string
    ): GoogleAppsScript.HTML.HtmlOutput;
  }
}
