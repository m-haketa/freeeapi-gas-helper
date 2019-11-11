interface TypedTemplate extends GoogleAppsScript.HTML.HtmlTemplate {
  authorizationUrl: string;
}

interface AuthParams {
  clientId: string;
  clientSecret: string;
  authorizeurl: string;
  tokenUrl: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Auth {
  //APIのサービスを取得
  public getService(params: AuthParams | undefined = undefined): OAuth2 {
    const oauth2 = OAuth2.createService('freee').setPropertyStore(
      PropertiesService.getUserProperties()
    );

    if (params != undefined) {
      oauth2
        .setAuthorizationBaseUrl(params.authorizeurl)
        .setTokenUrl(params.tokenUrl)
        .setClientId(params.clientId)
        .setClientSecret(params.clientSecret)
        .setCallbackFunction('authCallback');
    }

    return oauth2;
  }

  public getToken(): string {
    const service = this.getService();

    let token = '';
    try {
      token = service.getAccessToken();
    } catch (e) {
      const template = HtmlService.createTemplate(
        'アクセストークン取得時にエラーが発生しました: ' + e.message
      );
      const page = template.evaluate();
      SpreadsheetApp.getUi().showModalDialog(
        page,
        'アクセストークン取得エラー'
      );
      throw e;
    }

    return token;
  }

  public login(params: AuthParams): void {
    const service = this.getService(params);
    const authorizationUrl = service.getAuthorizationUrl();
    const template = HtmlService.createTemplate(
      '<a href="<?= authorizationUrl ?>" target="_blank">認証</a>. ' +
        '認証が完了したら、このウィンドウを消してください。'
    ) as TypedTemplate;

    template.authorizationUrl = authorizationUrl;
    const page = template.evaluate();
    SpreadsheetApp.getUi().showModalDialog(page, '認証が必要です');
  }

  public logout(): void {
    const service = this.getService();
    service.reset();
    const template = HtmlService.createTemplate('ログアウトしました');

    const page = template.evaluate();
    SpreadsheetApp.getUi().showModalDialog(page, 'ログアウトしました');
  }

  //認証コールバック
  public authCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: any,
    params: AuthParams
  ): GoogleAppsScript.HTML.HtmlOutput {
    const service = this.getService(params);
    const isAuthorized = service.handleCallback(request);
    if (isAuthorized) {
      return HtmlService.createHtmlOutput(
        '認証に成功しました。タブを閉じてください。'
      );
    } else {
      return HtmlService.createHtmlOutput(
        '認証に失敗しました。タブを閉じてください。'
      );
    }
  }
}
