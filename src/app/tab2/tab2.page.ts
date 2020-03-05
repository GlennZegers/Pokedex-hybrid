import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
	latitude;
	longitude;
	map: Map;
	pokemonCoords = [
		{ 'Latitude': 51.824889999999996, 'Longtitude': 4.8799534, 'Pokemon': 'Snorlax' },
		{ 'Latitude': 51.82490070000001, 'Longtitude': 4.880012499999999, 'Pokemon': 'Pikachu' }
	]

	constructor(private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
		//this.getCurrentLocation();
		this.watchLocation();
	}

	ionViewDidEnter() {
		// this.watchLocation().subscribe((data) => {
		// 	console.log(data)
		// 	this.loadmap(data.latitude, data.longitude);
		// })
		this.loadmap();
	}

	loadmap() { //(latitude: number, longitude: number)
		// while (this.latitude == null || this.longitude == null) {

		// }
		//this.map = new Map('map').setView([latitude, longitude], 7);
		this.map = new Map('map').setView([46.879966, -121.726909], 7);

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

		watchLocation() { //: Observable<Coordinates> => {
		let watch = this.geolocation.watchPosition();
		watch.subscribe((data) => {
			this.latitude = data.coords.latitude
			this.longitude = data.coords.longitude

			this.pokemonCoords.forEach(coord => {
				if (coord.Latitude == this.latitude && coord.Longtitude == this.longitude) {
					var today = new Date();
					var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
					console.log(time + " " + coord.Pokemon)
				}
			});

			// console.log(this.latitude)
			// console.log(this.longitude)

			this.convertGeocodeToAdress(data.coords.latitude, data.coords.latitude)

			console.log("return coords")
			return data.coords;
		});

		console.log("return null")
		//return null;
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
