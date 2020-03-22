import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PhotoService } from '../services/photo.service';

@Component({
	selector: 'app-create',
	templateUrl: './create.page.html',
	styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
	types = []
	pokemon = {
		name: "",
		image: "data:image/jpeg;base64,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",
		type1: "",
		weight: 0,
		height: 0,
		types: [{
			type: {
				name: ""
			}
		}],
		stats: [{
			base_stat: 0,
			stat: {
				name: "speed"
			}
		}, {
			base_stat: 0,
			stat: {
				name: "special-defence"
			}
		}, {
			base_stat: 0,
			stat: {
				name: "special-attack"
			}
		}, {
			base_stat: 0,
			stat: {
				name: "defence"
			}
		}, {
			base_stat: 0,
			stat: {
				name: "attack",
			}
		}, {
			base_stat: 0,
			stat: {
				name: "hp"
			}
		},]
	}

	constructor(private pokeService: PokemonService, private router: Router, public toastController: ToastController, public photoService: PhotoService) { }

	ngOnInit() {
		if (navigator.onLine) {
			this.pokeService.getTypes().subscribe(res => {
				this.types = res['results'];
			})
		} else {
			this.presentToast(`Couldn't retrieve types, check your connection`);
		}
	}

	onSubmit() {
		if (this.pokemon.name === "" || this.pokemon.type1 === "") {
			this.presentToast(`Please fill in all the fields`)
		} else {
			this.generateStats()
			this.pokeService.savePokemon(this.pokemon)
			this.router.navigate(['/'])
		}
	}

	private generateStats() {
		this.pokemon.stats.forEach(stat => {
			stat.base_stat = Math.floor(Math.random() * 250) + 1;
		});
	}

	public async takePhoto() {
		let image = await this.photoService.addNewToGallery();
		this.pokemon.image = image;
	}

	async presentToast(message) {
		const toast = await this.toastController.create({
			message,
			duration: 2000
		});
		toast.present();
	}

}
