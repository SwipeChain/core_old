#!/usr/bin/env bash

cd ~/swipechain-core
pm2 delete swipechain-core
pm2 delete swipechain-core-relay
git reset --hard
git pull
git checkout master
yarn run bootstrap
yarn run upgrade

pm2 --name 'swipechain-core-relay' start ~/swipechain-core/packages/core/dist/index.js -- relay --network mainnet
