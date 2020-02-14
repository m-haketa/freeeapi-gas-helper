# はじめに
GAS（Google Apps Script）用のfreee-apiを使いやすくするためのライブラリです。

## 使用方法
### 事前準備
#### freeeアプリストアのアプリケーション登録

`client_id` および `client_secret` を取得するため、freeeアプリストアの開発者ページでアプリケーションを登録します。

**コールバックURLを、`https://script.google.com/macros/d/（プロジェクトID）/usercallback`に設定してください**。

<br >

参考URL↓
[freeeヘルプ-アプリケーションを作成する](https://app.secure.freee.co.jp/developers/tutorials/2-%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)

[github - gsuitedevs/apps-script-oauth2（※RedirectURIの項）](https://github.com/gsuitedevs/apps-script-oauth2)

<br>

### プログラムを作成する
下記の手順でプログラムを作成してください。

なお、[サンプルファイル](https://docs.google.com/spreadsheets/d/1WsBef3Yd_apNQMAvGJRHL_HQtXCiEFLJm6jXr3Av70w/edit?usp=sharing)を準備していますので、**コピーしてお使いください**。

→[サンプルファイルはこちら](https://docs.google.com/spreadsheets/d/1WsBef3Yd_apNQMAvGJRHL_HQtXCiEFLJm6jXr3Av70w/edit?usp=sharing)

<br>

#### ライブラリの設定
まず、GASのスクリプトエディタを開きます。

そして、メニューから「リソース」→「ライブラリ」を選んでください。

|設定項目|設定すべき値|備考|
|--|--|--|
|Add a Library|`1Nbsmhyvhy0us-RE4M6DqJAGZjVr-eHkyL3x6tuvrzm5zA-Sz4IPSQrLU`を入力して「追加」をクリック| |
|バージョン|※最新のバージョン| |
|Identifier|FreeeApiGasHelper|（注）|

（注）：Identifierは変更可能ですが、下記サンプルでは、この名前で設定した前提で説明しています。

上記項目を設定後「保存」をクリックしてください。

<br>

#### ソースコード（定型）の準備
GASのスクリプトエディタで、下記ソースコードをコピペしてください。
また、clientID、clientSecretを指定してください。

```JavaScript
const clientId = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const clientSecret = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

const freeeapi = new FreeeApiGasHelper.FreeeApi(clientId, clientSecret);

const authCallback = function(request: any): GoogleAppsScript.HTML.HtmlOutput {
  return freeeapi.authCallback(request);
};

function login(): void {
  freeeapi.login();
}

function logout(): void {
  freeeapi.logout();
}
```

<br>

#### 認可コード~アクセストークン取得

上記のfunction「login」を実行すると、認可コード~アクセストークンの取得ができます。

<br>

参考URL↓

[freeeヘルプ-アクセストークンを取得する](https://app.secure.freee.co.jp/developers/tutorials/3-アクセストークンを取得する#認可コードを取得する)

<br>

#### APIを呼び出す
APIを呼び出すには`freeeapi.request`メソッドを呼び出してください。

- 例1: 一番簡単な例
```JavaScript
const companiesRoot = freeeapi.request('get', '/companies');
```

- 例2: URLで指定する引数もまとめて指定できます
```JavaScript
  const walletRoot = freeeapi.request('get', '/walletables/{type}/{id}', {
    id: '123456'
    type: 'credit_card',
    company_id: 1234567,
  });
```

- 例3: POST、PUTなども同じように呼び出せます。
```JavaScript
  const partnerRoot = freeeapi.request('post', '/partners', {
    company_id: 1234567,
    name: 'テスト取引先',
  });
```


## トラブルシューティング

### Access not granted or expired
`Error: Access not granted or expired.（行 33、ファイル「oauthWrapper」、プロジェクト「FreeeApi-Gas-Helper」）`

freeeへのログイン処理が必要です。

最初に「function login()」を実行してください。


### 変更履歴

#### Ver0.2
- トークンのrefreshに対応
- アクセストークンの有効期間切れの場合に、自動でトークンをrefreshするように変更
- ソースコード（定型）の仕様変更

#### Ver0.3
- 返り値がJSONでないときにエラーが出るのを修正
- 返り値がJSONでないときに文字コードをShift_JIS → UTF8に自動変換する機能を追加

### Ver0.4
- 引数に配列を渡したときにQueryStringsに正しく変換できるように修正