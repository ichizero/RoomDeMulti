## isp2からlibをコピー

## コンパイル
```bash
$ javac -d WebContent/WEB-INF/classes -cp "lib/*" src/b09/roomdemulti/*.java
```

## サーバー起動
```bash
$ java -cp "lib/*:bin/classes" server.AppServer 8080 / WebContent
```
