#!/bin/bash

loop=1

while [ $loop = 1 ]
do
    case $1 in
        compile) javac -d WebContent/WEB-INF/classes -cp "lib/*" src/b09/roomdemulti/*.java
        loop=0
        ;;
        run) java -cp "lib/*:bin/classes" server.AppServer 8080 / WebContent
        loop=0
        ;;
        makeWar) jar cvf ROOT.war -C WebContent .
        loop=0
        ;;
    esac
done
