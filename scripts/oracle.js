require("dotenv").config();
const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToNumber } = require("@harmony-js/utils");
const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "https://api.s0.b.hmny.io",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);

const linkAddr = "0x58ac417d8277a72fd3bb8e128e95214c7678073d";
const oracleJson = require("../build/contracts/Oracle.json");
let oracleContract = hmy.contracts.createContract(oracleJson.abi);
oracleContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_ORACLE);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };
let options3 = { data: oracleJson.bytecode, arguments: [linkAddr] };

oracleContract.methods
  .contractConstructor(options3)
  .send(options2)
  .then((response) => {
    if (response.transaction.txStatus == "REJECTED") {
      console.log("Reject");
      process.exit(0);
    }
    console.log(
      "oracle contract deployed at " +
        response.transaction.receipt.contractAddress
    );
    process.exit(0);
  });
