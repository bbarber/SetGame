#!/bin/bash

pkill -f node
pkill -f mongod
rm ~/setgame/data/mongod.lock
