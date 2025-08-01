# keycloak-template

## 本プロジェクトの構築手順

本プロジェクトの作成フローを記載（参考程度）

- Mavenプロジェクト作成
```
mvn archetype:generate -DgroupId=me.tutttuwi.keycloak.example -DartifactId=example-spi -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveModel=false

```

- 必要なDockerファイル作成
- KeyCloakカスタマイズに必要なテーマディレクトリ作成
- Makefile作成

## 環境構築

- インストール
  - Intellij IDEA
  - maven
    - Mac
      - `brew install maven`
  - Java JDK21
    - Mac
      -  `brew install openjdk@21`
  - make (Makefile実行)
  - docker (DockerDesktop/RancherDesktop)

## カスタマイズ手順

### プロバイダ定義

### テーマ作成

## ローカル 動作確認手順

### Dockerコンテナ起動

```shell
make build
```

- 起動状況確認
  - エラーが出ていないことの確認
```shell
make log
```

### KeyCloak ユーザー登録手順

- KeyCloakのWelcomeページアクセス
  - <http://localhost:8090/>
- SMTPサーバ設定
  - `custom-realm` のSMTPサーバに`maildev`を設定
    - <http://localhost:8090/admin/master/console/#/custom-realm/realm-settings/email>
      - Connection & Authentication > HOSt > `maildev`
      - Connection & Authentication > HOSt > `1025`

- Auth認証エンドポイント

```shell
http://localhost:8090/realms/custom-realm/protocol/openid-connect/auth?
prompt=login
&registration=true
&response_type=code
&scope=openid profile email
&redirect_uri=http://example.com
&client_id=custom-client

#&nonce=hoge
#&state=piyo
#&code_challenge_method=S256
#&code_challenge=fuga

```

