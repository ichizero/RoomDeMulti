# RDMServlet

## 事前準備
isp2からlibフォルダーとbin/classes/server/*.classをコピー。

### 依存jar
lib、WebContent/WEB-INF/libに配置
- SQLiteのJDBCドライバ
- JSON in Java

### データベース
localで実行する場合、RDMServlet直下にRDMDB.dbを配置する。

## シェルスクリプト
rdm.shに各種コマンドをまとめている。
実行権限を与える必要があるかも。

### コンパイル
```bash
./rdm.sh -C
```

### サーバー起動
```bash
./rdm.sh -R
```

### WARファイルの作成
```bash
./rdm.sh -MW
```

### WARサーバー起動
```bash
./rdm.sh -RW
```

## 各環境への対応
DBManager.java
```Java
// Azure
private static final String DB_PATH = "jdbc:sqlite:webapps/RDMDB.db";
// local
private static final String DB_PATH = "jdbc:sqlite:RDMDB.db";
// Univ
private static final String DB_PATH = "jdbc:sqlite:project/B09/RDMDB.db";
```
