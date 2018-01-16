#!/bin/bash

function usage() {
    cat <<EOF
Usage:
  $0 [Options]

Options:
  compile | -C    ソースをコンパイルします
  run     | -R    AppServerを起動します
  makeWar | -MW   WARファイルを作成します
  runWar  | -RW   WarServerを起動します

EOF
    exit 1
}

if [ "$#" != 1 ]
then
    usage
else
    case $1 in
        compile | -C)
            javac -d WebContent/WEB-INF/classes -cp "lib/*" src/b09/roomdemulti/*.java
        ;;
        run | -R)
            java -cp "lib/*:bin/classes" server.AppServer 8080 / WebContent
        ;;
        makeWar | -MW)
            jar cvf ROOT.war -C WebContent .
        ;;
        runWar | -RW)
            java -cp "lib/*:bin/classes" server.WarServer 8080 / ROOT.war
        ;;
        *)
            echo "Error: Invalid option '$1'"
            usage
            exit 1
        ;;
    esac
fi
