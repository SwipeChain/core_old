#!/usr/bin/env bash

pm2 delete swipechain-core > /dev/null 2>&1
pm2 delete swipechain-core-relay > /dev/null 2>&1
pm2 delete swipechain-core-forger > /dev/null 2>&1

pm2 delete core > /dev/null 2>&1
pm2 delete core-relay > /dev/null 2>&1
pm2 delete core-forger > /dev/null 2>&1

node ./scripts/upgrade/upgrade.js

# Sometimes the upgrade script doesn't properly replace swipechain_ with CORE_
cd ~

if [ -f .config/swipechain-core/devnet/.env ]; then
    sed -i 's/swipechain_/CORE_/g' .config/swipechain-core/devnet/.env
fi

if [ -f .config/swipechain-core/devnet/plugins.js ]; then
    sed -i 's/ARK_/CORE_/g' .config/swipechain-core/devnet/plugins.js
fi

if [ -f .config/swipechain-core/mainnet/.env ]; then
    sed -i 's/ARK_/CORE_/g' .config/swipechain-core/mainnet/.env
fi

if [ -f .config/swipechain-core/mainnet/plugins.js ]; then
    sed -i 's/ARK_/CORE_/g' .config/swipechain-core/mainnet/plugins.js
fi

cd ~/swipechain-core
yarn setup
