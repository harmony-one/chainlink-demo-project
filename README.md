# Chainlink demo project for Harmony

This project mainly helps to deploy chainlink smart contracts to Harmony and run a consumer who makes the oracle request.

Chainlink related contracts that can be deployed are:

- LinkToken - chainlink crypto currency used to pay oracle providers
- Oracle - chainlink oracle contract deployed by oracle providers
- Consumer - contract that invokes chainlink oracle request

## Requirements

- Node, Yarn

## Installation

```bash
yarn install
```

## Compile contracts

```bash
truffle compile
```

## Deploy

Deploy LinkToken to Harmony testnet. Needs `PRIVATE_KEY_LINK` env variable set.

```bash
node scripts/link.js
```

Deploy oracle contract to Harmony testnet. Needs `PRIVATE_KEY_ORACLE` env variable set. Also, link token contract address from deployment above copied to the script `oracle.js`.

```bash
node scripts/oracle.js
```

Deploy consumer contract. Make sure to copy the link token address from the link deployment to this script. Needs `PRIVATE_KEY` env variable set.

```bash
node scripts/consumer.js
```

Funding consumer contract so that price request script next succeeds. Make sure to copy the link contract address to this script.

```bash
node scripts/fund.js
```

Request price from oracle

```bash
node scripts/request_price.js
```

# Steps for the demo

For the demo, we will get the price of ONE in USDT using binance api `https://api.binance.com/api/v1/ticker/price?symbol=ONEUSDT`

1. Deploy oracle contract using link contract address: `0x91738e20e365abde6d48e081446917a4b5c05cb6`

2. Add the following job to your chainlink node using the oracle contract address from previous oracle deployment step.

```json
{
  "initiators": [
    {
      "type": "external",
      "params": {
        "name": "harmony",
        "body": {
          "endpoint": "oracle",
          "addresses": ["<YOUR ORACLE CONTRACT ADDRESS HERE>"]
        }
      }
    }
  ],
  "tasks": [
    {
      "type": "httpget",
      "params": {
        "get": "https://api.binance.com/api/v1/ticker/price?symbol=ONEUSDT"
      }
    },
    {
      "type": "jsonparse",
      "params": { "path": ["price"] }
    },
    {
      "type": "multiply",
      "params": { "times": 100000000 }
    },
    {
      "type": "EthUint256"
    },
    {
      "type": "harmony-adapter"
    }
  ]
}
```

3. Send your oracle contract address and jobId so that we can include them in the aggregator deployment and invoke price feed.

Deploy an Aggregator with oracles and jobIds for aggregating the price

```bash
node scripts/aggregator.js
```

After deploying the aggregator, fund the aggregator contract before running `price_feed.js` using `fund.js`.

Running the price feed using the aggregator contract, add your aggregator contract to `price_feed.js`

```bash
node scripts/price_feed.js
```
