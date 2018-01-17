# RDMClient

## 環境
Homebrewインストール済み

### nodebrewインストール
```bash
brew install nodebrew

nodebrew setup
```

### nodebrewのパスが表示されるので、.bash_profileなりに追記
```bash
echo "export PATH=\$HOME/.nodebrew/current/bin:\$PATH" >> ~/.bash_profile

source ~/.bash_profile
```

### Node.js(とnpm)をインストール
```bash
nodebrew install-binary stable

nodebrew use stable
```

## npmでパッケージ管理

### 依存パッケージインストール

```bash
npm install
```

### webpack-dev-server起動
コンパイルはされるが、生成コードはメモリ上に展開される。
ファイル生成する場合は、後述のビルドを実行する。

Development環境

```bash
npm run dev
```

### ビルド
src配下のjsをコンパイルし、distディレクトリにbundle.jsとして出力する。

Production環境

```bash
npm run build
```

ファイル監視して自動ビルドする場合は以下。

```bash
npm run watch
```

### RDMServletへ
RDMServlet/WebContent配下に、RDMClient/dist配下のindex.htmlとbundle.jsを配置する。

```bash
npm run cp
```

## 各環境への対応

App.jsのステートrootPathを変更することで各環境に対応。

```javascript
rootPath: "/",  // Azure & local: "/", Univ: "/B09/"
```
