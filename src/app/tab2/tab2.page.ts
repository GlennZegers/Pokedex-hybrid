import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Map, latLng, tileLayer, Layer, marker, icon, Marker } from 'leaflet';
// import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PokemonService } from '../services/pokemon.service';


@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
	map: Map;
	pokemonMarkers: [{ 'Pokemon': string, 'Icon': marker }];

	pokemonCaches = [];
	// pokemonCachesTest = [
	// 	{ 'Latitude': 51.824889999999996, 'Longitude': 4.8799534, 'Pokemon': 'Snorlax' },
	// 	{ 'Latitude': 51.82290070000001, 'Longitude': 4.880012499999999, 'Pokemon': 'Pikachu' }
	// ]

	pokemonToCatch: string;

	constructor(private router: Router, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder, private pokeService: PokemonService) {
	}

	ionViewDidEnter() {
		this.generateRandomPokemon();
		this.watchLocation().subscribe(data => {
			// this.loadmap(data.coords.latitude, data.coords.longitude);
			// this.checkCoordsWithPokemon(data.coords.latitude, data.coords.longitude);
			console.log(data)
			var lat = Math.random() * (51.7050 - 51.6850) + 51.6850
			var lon = Math.random() * (5.3200 - 5.2800) + 5.2800
			this.loadmap(lat, lon);
			this.checkCoordsWithPokemon(lat, lon);
		})
	}

	generateRandomPokemon() {
		for (var i = 0; i < 10; i++) {
			var offset = Math.floor((Math.random() * 125) + 1);
			var secondRandomNumber = Math.floor((Math.random() * 24) + 0);
			this.pokeService.getPokemon(offset).subscribe(res => {
				var pokemon = res[secondRandomNumber];
				var randomCoords = this.generateRandomCoords();

				var newCache = { 'Latitude': randomCoords.Latitude, 'Longitude': randomCoords.Longitude, 'Pokemon': pokemon.name, 'ImgURL': pokemon.image };
				this.pokemonCaches.push(newCache);
			})
		}
	}

	generateRandomCoords() {
		// Coords for center Den Bosch: 51.6978, 5.3037

		var randomLat = Math.random() * (51.7050 - 51.6850) + 51.6850
		var randomLon = Math.random() * (5.3200 - 5.2800) + 5.2800

		return { 'Latitude': randomLat, 'Longitude': randomLon };

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
			var minLat = latitude - 0.005
			var maxLat = latitude + 0.005
			var minLon = longitude - 0.005
			var maxLon = longitude + 0.005

			if (cache.Latitude >= minLat && cache.Latitude <= maxLat && cache.Longitude >= minLon && cache.Longitude <= maxLon && this.map != null) {
				this.addMarker(cache.Latitude, cache.Longitude, cache.Pokemon, cache.ImgURL);
			}
		});
	}

	setMarkerIcon(url: string) {
		// Setting defualts
		var iconRetinaUrl = '/assets/marker-icon-2x.png';
		var iconUrl = '/assets/marker-icon.png';

		// Setting icon of pokemon
		if (url != null || url != "") {
			iconRetinaUrl = url;
			iconUrl = url;
		}

		const iconDefault = icon({
			iconRetinaUrl,
			iconUrl,
			iconAnchor: [12, 41],
			tooltipAnchor: [16, -28],
		});
		Marker.prototype.options.icon = iconDefault;
	}

	addMarker(latitude: number, longitude: number, pokemon: string, imgURL: string) {
		this.setMarkerIcon(imgURL);

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
		//newMarker.bindPopup(pokemon).openPopup(); //dit is handig om gelijk naar de goede coordinaten te gaan
		newMarker.on('click', () => {
			this.router.navigate(['/tabs/tab2/catch-pokemon', pokemon]);
		});

		newPokemonMarker.Icon = newMarker;

		//dit werkt nog niet fantastisch
		//this.pokemonMarkers.push(newPokemonMarker);
		// console.log(this.pokemonMarkers);
		//});
	}

	// convertGeocodeToAdress(latitude, longitude) {
	// 	let options: NativeGeocoderOptions = {
	// 		useLocale: true,
	// 		maxResults: 5
	// 	};

	// 	this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, options)
	// 		.then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
	// 		.catch((error: any) => console.log(error));

	// 	this.nativeGeocoder.forwardGeocode('Berlin', options)
	// 		.then((result: NativeGeocoderResult[]) => console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude))
	// 		.catch((error: any) => console.log(error));
	// }
}
