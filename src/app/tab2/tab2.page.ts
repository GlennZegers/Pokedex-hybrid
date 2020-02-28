import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';

@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
	latitude = 0;
	longitude = 0;
	map: Map;

	constructor(private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
		//this.getCurrentLocation();
		this.watchLocation();
	}

	ionViewDidEnter() { this.loadmap(); }

	loadmap() {
		this.map = new Map("map").setView([46.879966, -121.726909], 7);

		tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(this.map);
	}

	getCurrentLocation() {
		this.geolocation.getCurrentPosition().then((resp) => {
			console.log(resp)
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	watchLocation() {
		let watch = this.geolocation.watchPosition();
		watch.subscribe((data) => {
			this.latitude = data.coords.latitude
			this.longitude = data.coords.longitude
			console.log(this.latitude)
			console.log(this.longitude)

			this.convertGeocodeToAdress(data.coords.latitude, data.coords.latitude)
		});
	}

	convertGeocodeToAdress(latitude, longitude) {
		let options: NativeGeocoderOptions = {
			useLocale: true,
			maxResults: 5
		};

		this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, options)
			.then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
			.catch((error: any) => console.log(error));

		this.nativeGeocoder.forwardGeocode('Berlin', options)
			.then((result: NativeGeocoderResult[]) => console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude))
			.catch((error: any) => console.log(error));
	}
}
