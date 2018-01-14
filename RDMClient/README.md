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

```bash
npm run dev
```

### ビルド
src配下のjsをコンパイルし、distディレクトリにbundle.jsとして出力する。

```bash
npm run build
```

### Servletへ
WebContent配下に、dist配下のindex.htmlとbundle.jsを配置する。

```bash
mv ./dist/bundle.js ../RDMServlet/WebContent/bundle.js
```
