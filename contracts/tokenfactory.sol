//SPDX-License-Identifier: CC-BY-NC-2.5

//samuel r rivera

//developed, compile, and deployed in Remix

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFactory {

    address private _owner;
    address[] private ownersDB;
    address[] private tokenDB;
    string[] private tokenType;

    event ERC20Created(address tokenAddress);

    constructor() {
        _owner = msg.sender;
    }

    receive() external payable {}    

    function createTokenNormal(string calldata tokenName, string calldata tokenSymbol, uint256 initialSupply) public payable returns (address newTokenAddress) {
        if(msg.value >= 50) {
            require(msg.value >= 50);

            TokenNormal newToken = new TokenNormal(tokenName, tokenSymbol, initialSupply, msg.sender);
            emit ERC20Created(address(newToken));

            addTokenToDB(address(newToken), "normal");

            return address(newToken);
        } else {
            return address(0);
        }
    }

    function createTokenMintable(string calldata tokenName, string calldata tokenSymbol, uint256 initialSupply) public payable returns (address newTokenAddress) {
        if(msg.value >= 50) {
            require(msg.value >= 50);

            TokenMintable newToken = new TokenMintable(tokenName, tokenSymbol, initialSupply, msg.sender);
            emit ERC20Created(address(newToken));

            addTokenToDB(address(newToken), "mintable");

            return address(newToken);
        } else {
            return address(0);
        }
    }

    function addTokenToDB(address tokenAddress, string memory _type) private {
        ownersDB.push(msg.sender);
        tokenDB.push(tokenAddress);
        tokenType.push(_type);
    }

    function getDB() public view returns (address[] memory owners, address[] memory tokens, string[] memory _type) {
        return (ownersDB, tokenDB, tokenType);
    }

    function returnMintBalance() public returns (bool) {
        if(msg.sender == _owner) {
            payable(msg.sender).transfer(address(this).balance);
            return true;
        } else {
            return false;
        }
    }
}

contract TokenNormal is ERC20 {
    constructor(string memory tokenName, string memory tokenSymbol, uint256 initialSupply, address owner) ERC20(tokenName, tokenSymbol) {
        _mint(owner, initialSupply * 10 ** decimals());
    }
}

contract TokenMintable is ERC20, ERC20Burnable, Ownable {
    constructor(string memory tokenName, string memory tokenSymbol, uint256 initialSupply, address owner) ERC20(tokenName, tokenSymbol) {
        _mint(owner, initialSupply * 10 ** decimals());
        _transferOwnership(owner);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}