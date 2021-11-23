#!/usr/bin/env bash

rm -rf /home/swipechain/swipechain-core
git clone git@github.com:SwipeChain/swipechain-explorer.git -b upgrade /home/swipechain/swipechain-core

mkdir /home/swipechain/.swipechain
touch /home/swipechain/.swipechain/.env

mkdir /home/swipechain/.swipechain/config

mkdir /home/swipechain/.swipechain/database
touch /home/swipechain/.swipechain/database/json-rpc.sqlite
touch /home/swipechain/.swipechain/database/transaction-pool.sqlite
touch /home/swipechain/.swipechain/database/webhooks.sqlite

mkdir /home/swipechain/.swipechain/logs
mkdir /home/swipechain/.swipechain/logs/mainnet
touch /home/swipechain/.swipechain/logs/mainnet/test.log
