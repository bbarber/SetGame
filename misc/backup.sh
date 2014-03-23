#!/bin/bash

date=$(date +"%Y-%m-%d")
filename="$date.tar.gz"

#backup the entire data folder
tar -zcvf $filename /home/pi/setgame/data
