require("dotenv").config();
const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
const hmy = new Harmony(
  "https://api.s0.b.hmny.io",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);

const linkAddr = "0x58ac417d8277a72fd3bb8e128e95214c7678073d";
const contractAddr = "0x4cb3cb9137aeef3c1436064629644c1a2764faae";
const linkJson = require("../build/contracts/LinkToken.json");
let linkContract = hmy.contracts.createContract(linkJson.abi, linkAddr);
linkContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_LINK);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

linkContract.methods
  .transfer(contractAddr, 100)
  .send(options2)
  .then((response) => {
    if (response.transaction.txStatus == "REJECTED") {
      console.log("Reject");
      process.exit(0);
    }
    console.log(response.transaction.receipt);
    process.exit(0);
  });
