

pkill -f node
pkill -f mongod
rm ~/setgame/node/data/mongod.lock


mongod --dbpath ~/setgame/node/data/ --rest --port 27017 &
node ~/setgame/node/app.js &
