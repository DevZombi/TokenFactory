/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './shared-styles.js';

import './my-token-display.js';

class MyERC20Factory extends PolymerElement {
	static get template() {
		return html`
		<style is="custom-style" include="iron-flex iron-flex-alignment"></style>
		<style include="shared-styles iron-flex">
			:host {
			display: block;

			padding: 10px;
			}
			@media only screen and (max-width: 600px) {
				.small {
					@apply --layout-vertical;
				} 
				.input-large {
					width: 90%;
				}
				.input-small {
					width: 85%;
				}
			}
			@media only screen and (min-width: 600px) {
				.small {
					@apply --layout-horizontal;
				}
				.input-large {
					width: 50%;
				}
				.input-small {
					width: 25%;
				}
			}
		</style>

		<template is="dom-if" if="{{accounts_available}}">
			<div class="card">
			<h1>Mint ERC-20 Token</h1>
			<p>This will be a normal token, no advance features.</p>
			<div class="layout small center-center">
				<paper-input label="Token Name" value="{{tokenName}}" style="margin-right: 10px;" class="input-large"></paper-input>
				<paper-input label="Token Symbol" value="{{tokenSymbol}}" style="margin-right: 10px;" class="input-small"></paper-input>
				<paper-input label="Token Total Supply" value="{{tokenTotalSupply}}" class="input-small"></paper-input>
			</div>
			<paper-button style="background: #292929; color: #eeeeee;" raised on-tap="tokenNormal">Mint</paper-button>
			</div>

			<div class="card">
			<h1>Mint Advance ERC-20</h1>
			<p>This will be a normal token, with advance capabilities, like minting, burning, and contract ownership.</p>
			<div class="layout small center-center">
				<paper-input label="Token Name" value="{{tokenNameMint}}" style="margin-right: 10px;" class="input-large"></paper-input>
				<paper-input label="Token Symbol" value="{{tokenSymbolMint}}" style="margin-right: 10px;" class="input-small"></paper-input>
				<paper-input label="Token Total Supply" value="{{tokenTotalSupplyMint}}" class="input-small"></paper-input>
			</div>
			<paper-button style="background: #292929; color: #eeeeee;" raised on-tap="tokenMintable">Mint</paper-button>
			</div>

			<template is="dom-if" if="{{createdTokenAddress}}">
				<div class="card">
					<h1>Token Address</h1>
					<p>{{createdTokenAddress.events.ERC20Created.returnValues.tokenAddress}}</p>
				</div>
			</template>

			<div class="layout vertical flex" style="margin-top: 40px;">
				<template is="dom-repeat" items="{{tokenDB.tokens}}">
					<template is="dom-if" if="{{doIOwnToken(item)}}">
						<my-token-display web3="{{web3}}" metamask="{{metamask}}" address="{{item}}" myindex="{{getIndex(item)}}" db="{{tokenDB}}" style="margin: 0px;"></my-token-display>
					</template>
				</template>
			</div>

		</template>

		<template is="dom-if" if="{{!accounts_available}}">
			<div class="card">
			<center>
				<h1>In order to use this tool you must have a MetaMask enabled web browser.</h1>
			</center>
			</div>
		</template>

		<paper-dialog id="creation" class="card layout vertical">
			<h1>Creating Token</h1>
			<paper-progress indeterminate></paper-progress>
		</paper-dialog>
		`;
	}

	static get properties() {
		return {
			web3: {
				type: Object
			},
			metamask: {
				type: Object
			},
			account: String,
			accounts_available: {
				type: Boolean,
				observer: '_accountsAvailableChanged'
			},
			notification: {
				type: String,
				notify: true
			},
			createdTokenAddress: {
				type: Object,
				observer: '_createdTokenAddressChanged'
			},
			count: {
				type: Number,
				value: 0
			},
			contract: {
				type: Object
			},
			tokenDB: {
				type: Object
			}
		};
	}

	ready() {
		super.ready();
	}

	_createdTokenAddressChanged(value) {
		this.$.creation.close();
		this.notification = "Token created at " + value.events.ERC20Created.returnValues.tokenAddress;
		this.tokenName = this.tokenSymbol = this.tokenTotalSupply = this.tokenNameMint = this.tokenSymbolMint = this.tokenTotalSupplyMint = "";
		this.reloadTokens();
	}

	async _accountsAvailableChanged(value) {
		if (value) {
			this.tokenDB = await this.contract.methods.getDB().call();
		}
	}

	getIndex(address) {
		return this.tokenDB.tokens.indexOf(address);
	}

	doIOwnToken(address) {
		var cIndex = this.getIndex(address);
		if(this.tokenDB.owners.lenght != 0) {
			if(this.tokenDB.owners[cIndex].toLowerCase() == this.metamask.selectedAddress.toLowerCase()) {
				return true;
			} else {
				return false;
			}
		}
	}

	async tokenNormal() {
		if(this.tokenName == "" || this.tokenSymbol == "" || this.tokenTotalSupply == "") {
			this.notification = "Please fill out all fields";
		} else {
			this.notification = "Token creation started";
			this.$.creation.open();
			this.tokenTotalSupply = this.tokenTotalSupply.replace(/\,/g, '');
			this.createdTokenAddress = await this.contract.methods.createTokenNormal(this.tokenName, this.tokenSymbol, this.tokenTotalSupply)
			.send({
				from: this.metamask.selectedAddress,
				value: this.web3.utils.toWei("50", 'ether')
			})
		}
	}

	async tokenMintable() {
		if(this.tokenNameMint == "" || this.tokenSymbolMint == "" || this.tokenTotalSupplyMint == "") {
			this.notification = "Please fill out all fields";
		} else {
			this.notification = "Token creation started";
			this.$.creation.open();
			this.tokenTotalSupplyMint = this.tokenTotalSupplyMint.replace(/\,/g, '');
			this.createdTokenAddress = await this.contract.methods.createTokenMintable(this.tokenNameMint, this.tokenSymbolMint, this.tokenTotalSupplyMint)
			.send({
				from: this.metamask.selectedAddress,
				value: this.web3.utils.toWei("50", 'ether')
			})
		}
	}

	async reloadTokens() {
		this.tokenDB = {};
		this.tokenDB = await this.contract.methods.getDB().call();
	}

	testOpen() {
		this.$.creation.open();
	}
}

window.customElements.define('my-erc20-factory', MyERC20Factory);