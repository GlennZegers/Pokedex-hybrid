import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Map, latLng, tileLayer, Layer, marker, icon, Marker } from 'leaflet';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PokemonService } from '../services/pokemon.service';

// const iconRetinaUrl = '/assets/marker-icon-2x.png';
const iconRetinaUrl = '/assets/images/pikachu.png'
//const iconUrl = '/assets/marker-icon.png';
const iconUrl = '/assets/images/pikachu.png'
const shadowUrl = '/assets/marker-shadow.png';
const iconDefault = icon({
	iconRetinaUrl,
	iconUrl,
	shadowUrl,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;

@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
	map: Map;
	pokemonMarkers: [{ 'Pokemon': string, 'Icon': marker }];

	pokemonCaches2 = [];
	pokemonCaches = [
		{ 'Latitude': 51.824889999999996, 'Longtitude': 4.8799534, 'Pokemon': 'Snorlax' },
		{ 'Latitude': 51.82290070000001, 'Longtitude': 4.880012499999999, 'Pokemon': 'Pikachu' }
	]

	pokemonToCatch: string;

	constructor(private router: Router, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder, private pokeService: PokemonService) {
	}

	ionViewDidEnter() {
		this.generateRandomPokemon();
		this.watchLocation().subscribe(data => {
			this.loadmap(data.coords.latitude, data.coords.longitude);
			this.checkCoordsWithPokemon(data.coords.latitude, data.coords.longitude);
		})
	}

	generateRandomPokemon() {
		for(var i = 0; i < 10; i++) {
			var offset = Math.floor((Math.random() * 125) + 1);
			var secondRandomNumber = Math.floor((Math.random() * 24) + 0);
			this.pokeService.getPokemon(offset).subscribe(res => {
				var pokemon = res[secondRandomNumber];
				//uiteraard moeten de lat en lon ook random gegenereerd worden binnen den bosch
				var newCache = {'Latitude': 51.824889999999996, 'Longtitude': 4.8799534, 'Pokemon': pokemon.name, 'ImgURL': pokemon.image};
				this.pokemonCaches2.push(newCache);
			})
		}
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
		this.pokemonCaches.forEach(cache => {
			var minLat = latitude - 2
			var maxLat = latitude + 2
			var minLon = longitude - 2
			var maxLon = longitude + 2

			if (cache.Latitude >= minLat && cache.Latitude <= maxLat && cache.Longtitude >= minLon && cache.Longtitude <= maxLon) {
				var today = new Date();
				var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
				console.log(time + " " + cache.Pokemon)

				if (this.map != null) {
					this.addMarker(cache.Latitude, cache.Longtitude, cache.Pokemon);
				}
			}
		});
	}

	addMarker(latitude: number, longitude: number, pokemon: string) {
		// var pikachuIcon = icon({
		// 	iconUrl: '/assets/images/pikachu.png',
		// 	iconSize: [38, 95], // size of the icon
		// 	iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
		// 	popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
		// });

		if (this.pokemonMarkers != null) {
			this.pokemonMarkers.forEach(marker => {
				if (marker.Pokemon == pokemon) {
					return;
				}
			})
		}

		var newMarker: any;
		var newPokemonMarker = { 'Pokemon': pokemon, 'Icon': null };

		//locationfound doet wss niks
		//this.map.locate({ setView: true }).on("locationfound", (e: any) => {
		newMarker = marker([latitude, longitude], {
			draggable:
				false
		}).addTo(this.map);
		newMarker.bindPopup(pokemon).openPopup();
		newMarker.on('click', () => {
			this.router.navigate(['/tabs/tab2/catch-pokemon', pokemon]);
		});

		newPokemonMarker.Icon = newMarker;

		//dit werkt nog niet fantastisch
		//this.pokemonMarkers.push(newPokemonMarker);
		//});

		//marker([51.5, -0.09], {icon: pikachuIcon}).addTo(map);
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
