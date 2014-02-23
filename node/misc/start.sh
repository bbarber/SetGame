

pkill -f node
pkill -f mongod
rm ~/setgame/node/data/mongod.lock


mongod --dbpath ~/setgame/node/data/ --rest --port 27017 > ~/setgame/node/misc/logs/mongod.log &
node ~/setgame/node/app.js > ~/setgame/node/misc/logs/node.log &
