var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "nerve clever boil cube same robust genre floor between goat cheese lady";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};

