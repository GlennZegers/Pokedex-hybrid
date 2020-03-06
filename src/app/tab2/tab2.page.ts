import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
	map: Map;
	marker: any;
	pokemonCoords = [
		{ 'Latitude': 51.824889999999996, 'Longtitude': 4.8799534, 'Pokemon': 'Snorlax' },
		{ 'Latitude': 51.82490070000001, 'Longtitude': 4.880012499999999, 'Pokemon': 'Pikachu' }
	]

	constructor(private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
	}

	ionViewDidEnter() {
		this.watchLocation().subscribe(data => {
			this.loadmap(data.coords.latitude, data.coords.longitude);
			this.checkCoordsWithPokemon(data.coords.latitude, data.coords.longitude);
		})
	}

	loadmap(latitude: number, longitude: number) {
		if (this.map == null) {
			this.map = new Map('map').setView([latitude, longitude], 17);
		}

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
		return watch.pipe(
			map(data => {
				this.checkCoordsWithPokemon(data.coords.latitude, data.coords.longitude);
				//this.convertGeocodeToAdress(data.coords.latitude, data.coords.longitude);

				return data;
			})
		);
	}

	checkCoordsWithPokemon(latitude: number, longitude: number) {
		this.pokemonCoords.forEach(coord => {
			var minLat = latitude - 2
			var maxLat = latitude + 2
			var minLon = longitude - 2
			var maxLon = longitude + 2

			if (coord.Latitude >= minLat && coord.Latitude <= maxLat && coord.Longtitude >= minLon && coord.Longtitude <= maxLon) {
				var today = new Date();
				var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
				console.log(time + " " + coord.Pokemon)

				// if (this.map != null) {
				// 	this.addMarker(coord.Latitude, coord.Longtitude);
				// }
			}
		});
	}

	addMarker(latitude: number, longitude: number) {
		this.map.locate({ setView: true }).on("locationfound", (e: any) => {
			this.marker = marker([latitude, latitude], {draggable: 
				false}).addTo(this.map);
			this.marker.bindPopup("You are located here!").openPopup();
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
