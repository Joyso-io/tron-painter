const TronPixel = artifacts.require('./tronPixel.sol');

module.exports =function(deployer) {
  deployer.deploy(TronPixel, 10, 100000, 20, 30);
};
