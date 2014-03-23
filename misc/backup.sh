./stop.sh


file='date +%Y-%m-%d'


zip '~/misc/data/ + file' ~/setgame/data/*

./dropbox_uploader.sh upload ~/setgame/data/*


./start.sh