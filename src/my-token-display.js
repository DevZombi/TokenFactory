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
 import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
 import '@polymer/paper-button/paper-button.js';
 import '@polymer/paper-dialog/paper-dialog.js';
 import './shared-styles.js';
 
 import './plugins/my-token-normal-contract.js';
 import './plugins/my-token-mintable-contract.js';
 
class MyTokenDisplay extends PolymerElement {
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
			}
			@media only screen and (min-width: 600px) {
				.small {
					@apply --layout-horizontal;
				}
			}
		</style>

		<template is="dom-if" if="{{isItNormal(db._type)}}">
			<my-token-normal-contract web3="{{web3}}" address="{{address}}" name="{{tname}}" symbol="{{tsymbol}}" supply="{{tsupply}}"></my-token-normal-contract>
			<div class="card layout small" style="margin-top: -20px;">
				<p style="width: 25%; text-align: center;">Name: {{tname}}</p>
				<p style="width: 25%; text-align: center;">Symbol: {{tsymbol}}</p>
				<p style="width: 25%; text-align: center;">Supply: {{tsupply}}</p>
				<p style="width: 25%; text-align: center;">ERC20</p>
			</div>
		</template>

		<template is="dom-if" if="{{!isItNormal(db._type)}}">
			<my-token-mintable-contract web3="{{web3}}" address="{{address}}" name="{{tname}}" symbol="{{tsymbol}}" supply="{{tsupply}}" tokencontract="{{tokencontract}}"></my-token-mintable-contract>
			<div class="card layout small" style="margin-top: -15px;">
				<p style="width: 20%; text-align: center;">Name: {{tname}}</p>
				<p style="width: 20%; text-align: center;">Symbol: {{tsymbol}}</p>
				<p style="width: 20%; text-align: center;">Supply: {{tsupply}}</p>
				<p style="width: 20%; text-align: center;">Advance ERC20</p>
				<paper-button on-tap="openManager" style="width: 20%; text-align: center; background: #292929; color: #eeeeee;" raised>Manage</paper-button>
			</div>
		</template>

		<paper-dialog id="manager" class="card" style="width: 55%; background: #80DEEA;">
			<div class="layout horizontal center-center" style="width: 100%; margin: 0px;">
				<h1>Manage {{tname}}</h1>
			</div>
			<div class="layout horizontal center-center" style="width: 100%; margin: 0px;">
				<h2>Total Supply: {{tsupply}} {{tsymbol}}</h2>
			</div>
			<div class="layout horizontal center-center" style="width: 100%; margin: 0px;">
				<p>Token Address: {{address}}</p>
			</div>
			<div class="layout horizontal center-center" style="width: 100%; margin: 0px;">
				<paper-input label="Burn Tokens" type="number" value="{{token_burn}}"></paper-input>
				<paper-button on-tap="burn" style="background: #292929; color: #eeeeee;" raised>Burn</paper-button>
			</div>
			<div class="layout horizontal center-center" style="width: 100%; margin: 0px;">
				<paper-input label="Sent to" type="string" value="{{token_sent_to}}" style="width: 50%; margin-right: 5px;"></paper-input>
				<paper-input label="Mint Tokens" type="number" value="{{token_mint}}"></paper-input>
				<paper-button on-tap="mint" style="background: #292929; color: #eeeeee;" raised>Mint</paper-button>
			</div>
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
			tokencontract: {
				type: Object
			},
			address: String,
			tname: String,
			tsymbol: String,
			tsupply: String,
			myindex: Number,
			db: Object,
			token_burn: {
				type: Number,
				value: 0
			},
			token_mint: {
				type: Number,
				value: 0
			}
		};
	}

    ready() {
        super.ready();
    }

	isItNormal(type) {
		if(type != null) {
			if(type[this.myindex] == "normal") {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
		
	}

	openManager(){
		this.$.manager.open();
	}

	burn() {
		this.token_burn = this.token_burn.replace(/\,/g, '');
		this.tokencontract.methods.burn(this.web3.utils.toWei(this.token_burn,'ether')).send({from: this.metamask.selectedAddress});
	}

	mint() {
		this.token_mint = this.token_mint.replace(/\,/g, '');
		this.tokencontract.methods.mint(this.token_sent_to, this.web3.utils.toWei(this.token_mint,'ether')).send({from: this.metamask.selectedAddress});
	}
}
 
 window.customElements.define('my-token-display', MyTokenDisplay);