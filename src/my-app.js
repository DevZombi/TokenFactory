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
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './my-icons.js';

import './my-toast.js';
import './plugins/my-web3.js';
import './plugins/my-factory-contract.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends PolymerElement {
	static get template() {
		return html`
		<style>
			:host {
			--app-primary-color: #006064;
			--app-secondary-color: black;

			display: block;
			}

			app-drawer-layout:not([narrow]) [drawer-toggle] {
			display: none;
			}

			app-header {
			color: #eeeeee;
			background-color: var(--app-primary-color);
			}

			app-header paper-icon-button {
			--paper-icon-button-ink-color: white;
			}

			.drawer-list {
			margin: 0 20px;
			}

			.drawer-list a {
			display: block;
			padding: 0 16px;
			text-decoration: none;
			color: var(--app-secondary-color);
			line-height: 40px;
			}

			.drawer-list a.iron-selected {
			color: black;
			font-weight: bold;
			}
		</style>

		<my-factory-contract web3="{{myweb3}}" address="0x8dA83c2e8182B420187a1Ce9D5E8797fF2dc3151" contract="{{factoryContract}}"></my-factory-contract>

		<app-location route="{{route}}" url-space-regex="^[[rootPath]]">
		</app-location>

		<app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
		</app-route>

		<app-drawer-layout fullbleed="" narrow="{{narrow}}" force-narrow>
			<!-- Drawer content -->
			<app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
				<app-toolbar>Menu</app-toolbar>
				<iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
					<a name="erc20-factory" href="[[rootPath]]erc20-factory">ERC20 Token Factory</a>
					<!-- <a name="view2" href="[[rootPath]]view2">View Two</a>
					<a name="view3" href="[[rootPath]]view3">View Three</a> -->
				</iron-selector>
			</app-drawer>

			<!-- Main content -->
			<app-header-layout has-scrolling-region="">

				<app-header slot="header" condenses="" reveals="" effects="waterfall">
					<app-toolbar>
					<paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
					<div main-title="" style="font-family: 'Berkshire Swash', cursive; color: #eeeeee;">MintGold</div>
					<my-web3 web3="{{myweb3}}" metamask="{{metaMask}}" accounts_available="{{isAvData}}" notification="{{notification_msg}}" account="{{current_account}}"></my-web3>
					</app-toolbar>
				</app-header>

				<iron-pages selected="[[page]]" attr-for-selected="name" role="main">
					<my-erc20-factory name="erc20-factory" accounts_available="{{isAvData}}" notification="{{notification_msg}}" contract="{{factoryContract}}" web3="{{myweb3}}" metamask="{{metaMask}}" account="{{current_account}}"></my-erc20-factory>
					<my-view2 name="view2"></my-view2>
					<my-view3 name="view3"></my-view3>
					<my-view404 name="view404"></my-view404>
				</iron-pages>

			</app-header-layout>
		</app-drawer-layout>

		<my-toast notification="{{notification_msg}}"></my-toast>
		`;
	}

	static get properties() {
		return {
		page: {
			type: String,
			reflectToAttribute: true,
			observer: '_pageChanged'
		},
		routeData: Object,
		subroute: Object
		};
	}

	static get observers() {
		return [
		'_routePageChanged(routeData.page)'
		];
	}

	_routePageChanged(page) {
		// Show the corresponding page according to the route.
		//
		// If no page was found in the route data, page will be an empty string.
		// Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
		if (!page) {
		this.page = 'erc20-factory';
		} else if (['erc20-factory', 'view2', 'view3'].indexOf(page) !== -1) {
		this.page = page;
		} else {
		this.page = 'view404';
		}

		// Close a non-persistent drawer when the page & route are changed.
		if (!this.$.drawer.persistent) {
		this.$.drawer.close();
		}
	}

	_pageChanged(page) {
		// Import the page component on demand.
		//
		// Note: `polymer build` doesn't like string concatenation in the import
		// statement, so break it up.
		switch (page) {
		case 'erc20-factory':
			import('./my-erc20-factory.js');
			break;
		case 'view2':
			import('./my-view2.js');
			break;
		case 'view3':
			import('./my-view3.js');
			break;
		case 'view404':
			import('./my-view404.js');
			break;
		}
	}
}

window.customElements.define('my-app', MyApp);
