import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-button/paper-button.js';

class MyWeb3 extends PolymerElement {

    static get template() {
        return html`
		 	<style is="custom-style" include="iron-flex iron-flex-alignment"></style>
			<style include="iron-flex">
				:host {
					--app-primary-color: #4285f4;
					--app-secondary-color: black;
			
					display: block;
				}
				@media only screen and (max-width: 600px) {
					.small {
						font-size: 9px;
					} 
				}
				@media only screen and (min-width: 600px) {
					.small {
						font-size: 18px;
					}
				}
			</style>
			
			<template is="dom-if" if="{{!accounts_available}}">
				<paper-button raised on-tap="connect" style="background: #292929; color: #eeeeee; font-size: 14px;">Connect to MetaMask</paper-button>
			</template>

			<template is="dom-if" if="{{accounts_available}}">
				<p class="small">{{account}}</p>
			</template>
        `;
    }

    static get properties() {
		return {
			web3: {
				type: Object,
				notify: true
			},
			metamask: {
				type: Object,
				notify: true
			},
			accounts_available: {
				type: Boolean,
				value: false,
				notify: true
			},
			accounts: {
				type: Array,
				observer: '_accountsChanged'
			},
			account: {
				type: String,
				value: 'Not Connected',
				notify: true
			},
			account_index: {
				type: Number,
				value: 0
			},
			notification: {
				type: String,
				notify: true
			}
		};
    }

    async connect() {
		var provider = await detectEthereumProvider();

		if (typeof window.ethereum !== 'undefined') {
			if(window.ethereum.isMetaMask == true) {
				this.metamask = window.ethereum;
				this.web3 = new Web3(provider);
				this.accounts = await this.metamask.request({ method: 'eth_requestAccounts' });
				this.notification = 'Connected to MetaMask';
			}

			try {
				await this.metamask.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: "0x609E" }],
				});
			} catch (switchError) {
				// This error code indicates that the chain has not been added to MetaMask.
				if (switchError.code === 4902) {
					try {
						await this.metamask.request({
							method: "wallet_addEthereumChain",
							params: [
							{
								chainId: "0x609E",
								chainName: "MintMe",
								nativeCurrency: {
									name: "mintme",
									symbol: "MINTME",
									decimals: 18,
								},
								rpcUrls: [
									"https://node1.mintme.com:443/",
									"https://node2.mintme.com:443/",
								],
								blockExplorerUrls: ["https://www.mintme.com/explorer"],
							},
							],
						});
					} catch (addError) {
						this.notification = "Error adding Ethereum chain: " + addError.message;
					}
				}
				this.notification = "Error switching to Ethereum chain: " + switchError.message;
			}
		}
    }

    _accountsChanged(accounts) {
        if(accounts.length > 0) {
            this.accounts_available = true;
            this.account = accounts[this.account_index];
        }
    }
}

window.customElements.define('my-web3', MyWeb3);