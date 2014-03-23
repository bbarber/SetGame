
mongod --dbpath ~/setgame/data/ --rest --port 27017 > ~/setgame/misc/logs/mongod.log &
node ~/setgame/app.js > ~/setgame/misc/logs/node.log &