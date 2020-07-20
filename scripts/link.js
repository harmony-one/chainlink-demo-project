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

const linkJson = require("../build/contracts/LinkToken.json");
let linkContract = hmy.contracts.createContract(linkJson.abi);
linkContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_LINK);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };
let options3 = { data: linkJson.bytecode };

linkContract.methods
  .contractConstructor(options3)
  .send(options2)
  .then((response) => {
    if (response.transaction.txStatus == "REJECTED") {
      console.log("Reject");
      process.exit(0);
    }
    console.log(
      "link contract deployed at " +
        response.transaction.receipt.contractAddress
    );
    process.exit(0);
  });
