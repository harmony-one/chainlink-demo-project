const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");

const hmy = new Harmony("https://api.s0.b.hmny.io", {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

const hmy_ws = new Harmony("wss://ws.s0.b.hmny.io", {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});
const oracleAddr = "0xf89d42ffb658410a30bf769b6cd27c7143c38f55";
const oracleJson = require("../build/contracts/Oracle.json");
const oracleContract = hmy_ws.contracts.createContract(
  oracleJson.abi,
  oracleAddr
);
oracleContract.events
  .OracleRequest()
  .on("data", (event) => {
    console.log(event);
  })
  .on("error", console.error);

const contractJson = require("../build/contracts/MyContract.json");
const contractAddr = "0x4cb3cb9137aeef3c1436064629644c1a2764faae";

(function (abi, addr) {
  const contract = hmy_ws.contracts.createContract(abi, addr);
  contract.events
    .ChainlinkRequested()
    .on("data", (event) => {
      console.log(event);
    })
    .on("error", console.error);

  contract.events
    .ChainlinkFulfilled()
    .on("data", (event) => {
      console.log(event);
    })
    .on("error", console.error);
})(contractJson.abi, contractAddr);


const contract = hmy.contracts.createContract(contractJson.abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

const jobId = "305ee8edf13a4172b3cad72ba69a36ff1";
const payment = 1;

contract.methods
  .requestEthereumPrice(oracleAddr, jobId, payment)
  .send(options2)
  .then((response) => {
    if (response.transaction.txStatus == "REJECTED") {
      console.log("Reject");
      process.exit(0);
    }
    //console.log(response.transaction.receipt.logs);
    // contract.methods.getCurrentPrice().call(options2).then(price => {
    //   console.log(price.toString());
      process.exit(0);
    // });
  });
