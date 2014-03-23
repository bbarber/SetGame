#!/bin/bash

./stop.sh

date=$(date +"%Y-%m-%d")
filename="$date.tar.gz"

#backup the entire data folder
tar -zcvf $filename /home/pi/setgame/data

#upload to dropbox
./dropbox_uploader.sh upload $filename /DbBackups

rm $filename
