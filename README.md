## Setup

- Install git-crypt. See git-crypt for details, Mac users can simply run `brew install git-crypt`.
- Install packages: `yarn`
- Before running the app, you need to decrypt the config files. For this you will need the key on your machine, then run: `git-crypt unlock /path/to/key`.

## Start the services
run: `NODE_ENV=development CHAIN_NETWORK=litentry_test yarn start:dev`


Current supported networks: polkadot, kusama, litentry_test.
