import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, tileLayer, marker, icon, Marker, layerGroup } from 'leaflet';
import { map } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

import { PokemonService } from '../services/pokemon.service';
import { GlobalService } from '../services/global.service';


@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
	map: Map;
	pokemonMarkers = [];
	pokemonCaches = [];
	pokemonToCatch: string;

	constructor(private router: Router, private geolocation: Geolocation, private pokeService: PokemonService, private globalService: GlobalService,
		public toastController: ToastController, private network: Network) {
		// Subscribing previous urls
		this.router.events
			.subscribe((event) => {
				if (event instanceof NavigationStart) {
					// When url matches 'Catch pokemon page', someone tried to catch a pokemon
					if (this.router.url.includes('/tabs/tab2/catch-pokemon/')) {
						// This pokemon's name is split from the url and deleted from the map
						var pokemonName = this.router.url.split('/')[4];
						var pokemonId = parseInt(this.router.url.split('/')[5]);

						// Remove pokemon from map
						this.removeMarker(pokemonName);

						//Remove pokemon from chache list
						this.removePokemonFromList(pokemonName);

						// Add pokemon to list
						this.globalService.addPokemon(pokemonId);
					}
				}
			});
	}

	ionViewDidEnter() {
		if (!this.isConnected) {
			this.presentToast(`Couldn't load the map, check your connection`);
			return;
		}

		this.watchLocation().subscribe(data => {
			if (this.pokemonCaches.length == 0) {
				this.generateRandomPokemon(data.coords.latitude, data.coords.longitude);
			}
			this.loadmap(data.coords.latitude, data.coords.longitude);
			this.checkCoordsWithPokemon(data.coords.latitude, data.coords.longitude);

			// This is for testing at home, because Pokemons coords are based in Den Bosch
			// var lat = Math.random() * (51.7050 - 51.6850) + 51.6850
			// var lon = Math.random() * (5.3200 - 5.2800) + 5.2800
			// this.loadmap(lat, lon);
			// this.checkCoordsWithPokemon(lat, lon);
		})
	}

	isConnected(): boolean {
		let conntype = this.network.type;
		return conntype && conntype !== 'unknown' && conntype !== 'none';
	}

	removePokemonFromList(pokemonName: string) {
		this.pokemonCaches.forEach( (cache, index) => {
			if (cache.Pokemon == pokemonName) {
				this.pokemonCaches.splice(index, 1);
			}
		})
	}

	generateRandomPokemon(latitude: number, longitude: number) {
		for (var i = 0; i < 10; i++) {
			// Setting random numbers to make it as random as possible
			var offset = Math.floor((Math.random() * 125) + 1);
			var secondRandomNumber = Math.floor((Math.random() * 24) + 0);

			this.pokeService.getPokemon(offset).subscribe(res => {
				var pokemon = res[secondRandomNumber];

				var randomCoords = this.generateRandomCoords(latitude, longitude);

				var newCache = {
					'Latitude': randomCoords.Latitude, 'Longitude': randomCoords.Longitude, 'Pokemon': this.startPokemonNameUppercase(pokemon.name),
					'ImgURL': pokemon.image, 'Id': pokemon.pokeIndex
				};
				this.pokemonCaches.push(newCache);
			}, err => { this.presentToast(`Oops, something went wrong :( Pokemon could not be loaded`); })
		}
	}

	startPokemonNameUppercase(name: string): string {
		var firstLetter = name[0].toUpperCase();
		return firstLetter + name.slice(1);
	}

	generateRandomCoords(latitude: number, longitude: number) {
		// Coords for center Den Bosch: 51.6978, 5.3037

		var randomLat = Math.random() * ((latitude + 0.0100) - (latitude - 0.0100)) + (latitude - 0.0100)
		var randomLon = Math.random() * ((longitude + 0.0100) - (longitude - 0.0100)) + (longitude - 0.0100)

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

	watchLocation() {
		try {
			let watch = this.geolocation.watchPosition();
			return watch.pipe(
				map(data => {
					return data;
				})
			);
		} catch (error) {
			this.presentToast(`Oops, something went wrong :(`);
		}
	}

	checkCoordsWithPokemon(latitude: number, longitude: number) {
		this.pokemonCaches.forEach(cache => {
			var minLat = latitude - 0.005
			var maxLat = latitude + 0.005
			var minLon = longitude - 0.005
			var maxLon = longitude + 0.005

			this.pokemonMarkers.forEach(marker => {
				if (marker.Pokemon == cache.Pokemon) {
					return;
				}
			})

			// Coords between these numbers are considered 'close by'
			if (cache.Latitude >= minLat && cache.Latitude <= maxLat && cache.Longitude >= minLon && cache.Longitude <= maxLon && this.map != null) {
				this.addMarker(cache.Latitude, cache.Longitude, cache.Pokemon, cache.ImgURL, cache.Id);
			} else {
				this.removeMarker(cache.Pokemon);
			}
		});
	}

	setMarkerIcon(url: string) {
		// Setting defaults
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

	addMarker(latitude: number, longitude: number, pokemon: string, imgURL: string, pokemonId: number) {
		this.setMarkerIcon(imgURL);

		// If array is null or marker already exists -> exit method
		if (this.pokemonMarkers != null) {
			this.pokemonMarkers.forEach(marker => {
				if (marker.Pokemon == pokemon) {
					return;
				}
			})
		}

		var newMarker: any;

		newMarker = marker([latitude, longitude], {
			draggable:
				false
		}).on('click', () => {
			this.router.navigate(['/tabs/tab2/catch-pokemon', pokemon, pokemonId]);
		});

		var newLayerGroup = layerGroup([newMarker]);
		this.map.addLayer(newLayerGroup);

		var newPokemonMarker = { 'Pokemon': pokemon, 'LayerGroup': newLayerGroup }
		this.pokemonMarkers.push(newPokemonMarker);
	}

	removeMarker(pokemon: string) {
		if (this.pokemonMarkers != null) {
			this.pokemonMarkers.forEach((marker, index) => {
				if (marker.Pokemon == pokemon) {
					this.map.removeLayer(marker.LayerGroup);
					this.pokemonMarkers.splice(index, 1);
				}
			})
		}
	}

	async presentToast(message) {
		const toast = await this.toastController.create({
			message,
			duration: 2000
		});
		toast.present();
	}

}
