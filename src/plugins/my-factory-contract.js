import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class MyFactoryContract extends PolymerElement {
    static get properties() {
		return {
			web3: {
				type: Object,
				observer: '_web3Changed'
			},
			contract: {
				type: Object,
				notify: true
			},
			address: String
		};
    }

	ready() {
		super.ready();
		this.abi = [
			{
				"inputs": [],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "tokenAddress",
						"type": "address"
					}
				],
				"name": "ERC20Created",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "tokenName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "tokenSymbol",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "initialSupply",
						"type": "uint256"
					}
				],
				"name": "createTokenMintable",
				"outputs": [
					{
						"internalType": "address",
						"name": "newTokenAddress",
						"type": "address"
					}
				],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "tokenName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "tokenSymbol",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "initialSupply",
						"type": "uint256"
					}
				],
				"name": "createTokenNormal",
				"outputs": [
					{
						"internalType": "address",
						"name": "newTokenAddress",
						"type": "address"
					}
				],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getDB",
				"outputs": [
					{
						"internalType": "address[]",
						"name": "owners",
						"type": "address[]"
					},
					{
						"internalType": "address[]",
						"name": "tokens",
						"type": "address[]"
					},
					{
						"internalType": "string[]",
						"name": "_type",
						"type": "string[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "returnMintBalance",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"stateMutability": "payable",
				"type": "receive"
			}
		];
	}

	async _web3Changed(web3) {
		this.contract = await new web3.eth.Contract(this.abi, this.address);
	}
}

//factory address 0x60c6ED942B0EAF5D227f4b56A0f6D78C5D87bf1E
window.customElements.define('my-factory-contract', MyFactoryContract);