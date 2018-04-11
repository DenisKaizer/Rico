var PreSale = artifacts.require("./PreSale.sol");
var rico = artifacts.require("./rICO.sol");
var RicoToken = artifacts.require("./RicoToken.sol");
var DividentDistributor = artifacts.require("./DividendDistributor.sol");
var unix = Math.round(+new Date()/1000);

var manager = '0xcf11c61b0f877348250a1fa7c25a516126233c9a';

module.exports = function(deployer) {
	deployer.deploy(RicoToken).then(function() {
		return deployer.deploy(DividentDistributor, RicoToken.address);
	}).then(function() {
		return deployer.deploy(PreSale, 1000000, manager, 1000000, RicoToken.address, 1000000000);
	}).then(function() {
		return deployer.deploy(rico, 2000000, manager, PreSale.address, RicoToken.address, 1000000000);
	})
};
