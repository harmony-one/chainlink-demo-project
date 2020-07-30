const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");

const hmy = new Harmony("https://api.s0.b.hmny.io", {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});
// aggregator contract address
const contractAddr = "0x448b8ba6255a133b150171bc42c6b9c58cdd082b";
const contractJson = require("../build/contracts/Aggregator.json");
const contract = hmy.contracts.createContract(contractJson.abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

(function(abi, addr) {
  const hmy_ws = new Harmony("wss://ws.s0.b.hmny.io", {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  });
  const contract = hmy_ws.contracts.createContract(abi, addr);
  contract.events
    .NewRound()
    .on("data", (event) => {
      console.log(event);
      contract.methods
        .latestAnswer()
        .call(options2)
        .then((answer) => {
          let num = parseInt(answer.toString()) / 10 ** 8;
          console.log("price before request fulfil: " + num);
        });
    })
    .on("error", console.error);

  contract.events
    .ResponseReceived()
    .on("data", (event) => {
      console.log(event);
      contract.methods
        .latestAnswer()
        .call(options2)
        .then((answer) => {
          let num = parseInt(answer.toString()) / 10 ** 8;
          console.log("price after request fulfil: " + num);
          process.exit(0);
        });
    })
    .on("error", console.error);
})(contractJson.abi, contractAddr);

contract.methods
  .requestRateUpdate()
  .send(options2)
  .then((response) => {
    // console.log(response);
  });
