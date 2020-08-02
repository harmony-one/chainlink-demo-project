require("dotenv").config();
const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
const { toUtf8Bytes } = require('@harmony-js/contract');
const { hexlify } = require('@harmony-js/crypto');

const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "https://api.s0.b.hmny.io",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);

const linkAddr = "0x91738e20e365abde6d48e081446917a4b5c05cb6";
const contractJson = require("../build/contracts/Aggregator.json");
let contract = hmy.contracts.createContract(contractJson.abi);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

// const oracleAddr = "0xbf1b34c593cd18389e0e6d02475f7ca065140a3f";
// const jobId = hexlify(toUtf8Bytes("94e1a765911c4c0785f4f9faa8fa2dd6")); // string to bytes32
const amount = 1;
const minResp = 1;
let oracles = [
  "0x0185b239a9d2080fd03536213413488a4b171334", // SNZ
  "0x702d75a957a623fb7af3cf021a7c4c4223951589", // Stafi Protocol
  "0x6c6184e1b23d85ca0a13d874ede26adb1fa91cbb" // Validation Capital
];
let jobIds = [
  hexlify(toUtf8Bytes("9ebf01ef2f794f4c95a746840849fd5a")), // SNZ
  hexlify(toUtf8Bytes("ff5dcf90d8a94e62ab9547eb9169e473")), // Stafi Protocol
  hexlify(toUtf8Bytes("db6879bf38384f5699321db973ba07a5")) // Validation Capital
];
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
