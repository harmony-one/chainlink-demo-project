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

const oracelAddr = "0xf89d42ffb658410a30bf769b6cd27c7143c38f55";
const oracleJson = require("../build/contracts/Oracle.json");
let oracleContract = hmy.contracts.createContract(oracleJson.abi, oracelAddr);
oracleContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_ORACLE);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

const addr = "0x6DCf6e8dB0771A9315C9Cd9Ba0d76980fa128A84";
oracleContract.methods
  .getAuthorizationStatus(addr)
  .call(options2)
  .then((status) => {
    console.log("authorization status " + status);
    if (!status) {
      oracleContract.methods
        .setFulfillmentPermission(addr, true)
        .send(options2)
        .then((response) => {
          console.log(response.transaction.receipt);
          process.exit(0);
        });
    } else {
      process.exit(0);
    }
  });
