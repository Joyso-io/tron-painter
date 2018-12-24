const TronPixel = artifacts.require('./tronPixel.sol');

module.exports =function(deployer) {
  deployer.deploy(TronPixel, 100, 1000000, 20, 30);
};
