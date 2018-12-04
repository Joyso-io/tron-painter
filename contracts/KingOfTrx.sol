pragma solidity ^0.4.23;

contract KingOfTrx {
  uint storedData;
  
  function set(uint x) public {
    storedData = x;
  }
  
  function get() public view returns (uint) {
    return storedData;
  }
}
