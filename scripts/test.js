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
const linkJson = require("../build/contracts/LinkToken.json");
let linkContract = hmy.contracts.createContract(linkJson.abi, linkAddr);
linkContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_LINK);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };
const addr = "0x8c8489018189cf228311e35dc956ad1d14729e49";

linkContract.methods
  .balanceOf(addr)
  .call(options2)
  .then((balance) => {
    console.log(
      balance.toString()
    );
    process.exit(0);
  });
