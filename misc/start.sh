#!/bin/bash

lastBackup=""

# Creates a nightly backup of the mongodb files
while true
do
    curDate=`TZ='America/Chicago' date +"%Y-%m-%d"`
    echo $curDate
    if [ "$curDate" != "$lastBackup" ]
    then
        ./backup.sh
        lastBackup=$curDate

        # Starts mongodb and node
        mongod --dbpath ~/setgame/data/ --rest --port 27017 > ~/setgame/misc/logs/mongod.log &
        node ~/setgame/app.js > ~/setgame/misc/logs/node.log &

    fi
    sleep 600
done
