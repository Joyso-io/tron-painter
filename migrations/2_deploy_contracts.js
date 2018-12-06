const TronPixel = artifacts.require('./tronPixel.sol');

module.exports =function(deployer) {
  deployer.deploy(TronPixel, 100, 100000, 20, 30);
};
