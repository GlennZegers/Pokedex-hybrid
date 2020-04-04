import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { isCordovaAvailable } from '../common/is-cordova-available';
import { oneSignalAppId, sender_id } from '../main';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss']
})
export class AppComponent {
	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private oneSignal: OneSignal
	) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			if (isCordovaAvailable()) {
				this.oneSignal.startInit(oneSignalAppId, sender_id);
				this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
				this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
				this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload));
				this.oneSignal.endInit();
			}
		});
	}

	private onPushReceived(payload: OSNotificationPayload) {
		alert('Push recevied:' + payload.body);
	}
	
	private onPushOpened(payload: OSNotificationPayload) {
		alert('Push opened: ' + payload.body);
	}
}
