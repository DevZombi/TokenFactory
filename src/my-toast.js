import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-toast/paper-toast.js';

class MyToast extends PolymerElement {

    static get template() {
        return html`
			<style>
				:host {
				--app-primary-color: #4285f4;
				--app-secondary-color: black;
		
				display: block;
				}
			</style>
			
            <paper-toast id="toast" text="{{notification}}"></paper-toast>
        `;
    }

    static get properties() {
		return {
			notification: {
                type: String,
                observer: '_notificationChanged'
            }
		};
    }

    _notificationChanged() {
        this.$.toast.close();
        this.$.toast.show();
    }
}

window.customElements.define('my-toast', MyToast);