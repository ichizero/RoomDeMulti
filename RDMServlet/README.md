# RDMServlet

## 事前準備
isp2からlibフォルダーとbin/classes/server/*.classをコピー

SQLiteのJDBCドライバをDLして配置


## コンパイル
```bash
javac -d WebContent/WEB-INF/classes -cp "lib/*" src/b09/roomdemulti/*.java
```

もしくは

```bash
./gradlew compile
```

## サーバー起動
```bash
java -cp "lib/*:bin/classes" server.AppServer 8080 / WebContent
```

もしくは

```bash
./gradlew run
```

## WARファイルの作成
```bash
jar cvf ROOT.war -C WebContent .
```

コンパイルとまとめて

```bash
./gradlew makeWar
```

war実行

```bash
./gradlew runWar
```
