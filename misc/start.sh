

pkill -f node
pkill -f mongod
rm ~/setgame/data/mongod.lock


mongod --dbpath ~/setgame/data/ --rest --port 27017 > ~/setgame/misc/logs/mongod.log &
node ~/setgame/app.js > ~/setgame/misc/logs/node.log &
