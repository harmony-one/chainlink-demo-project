const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");

const hmy = new Harmony("https://api.s0.b.hmny.io", {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

const contractAddr = "0x51545fa00994e647013cad894931522c8580241a";
const contractJson = require("../build/contracts/MyContract.json");
const contract = hmy.contracts.createContract(contractJson.abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

contract.methods
  .getCurrentPrice()
  .call(options2)
  .then((price) => {
    console.log(price.toString());
    process.exit(0);
  });
