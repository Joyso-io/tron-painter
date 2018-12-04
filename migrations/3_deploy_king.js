var KingOfTrx = artifacts.require("./KingOfTrx.sol");

module.exports = function(deployer) {
  deployer.deploy(KingOfTrx, 1);
};
