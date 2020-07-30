require("dotenv").config();
const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToNumber } = require("@harmony-js/utils");
const Web3Utils = require('web3-utils');
const { formatBytes32String, toUtf8Bytes } = require('@harmony-js/contract');
const { hexlify } = require('@harmony-js/crypto');

const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "https://api.s0.b.hmny.io",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);

const linkAddr = "0xde57a0e1b91e281c7ebab147d05355a72d2eb683";
const contractJson = require("../build/contracts/Aggregator.json");
let contract = hmy.contracts.createContract(contractJson.abi);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const oracleAddr = "0xbf1b34c593cd18389e0e6d02475f7ca065140a3f";
const jobId = hexlify(toUtf8Bytes("94e1a765911c4c0785f4f9faa8fa2dd6")); // string to bytes32
const amount = 1;
const minResp = 1;
let oracles = [oracleAddr];
let jobIds = [jobId];
// console.log([linkAddr, amount, minResp, oracles, jobIds]);
let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };
let options3 = { data: contractJson.bytecode, arguments: [linkAddr, amount, minResp, oracles, jobIds] };

contract.methods
  .contractConstructor(options3)
  .send(options2)
  .then((response) => {
    if (response.transaction.txStatus == "REJECTED") {
      console.log("Reject");
      process.exit(0);
    }
    let contractAddr = response.transaction.receipt.contractAddress;
    console.log(
      "aggregator deployed at " +
      contractAddr
    );
    process.exit(0);
  });
