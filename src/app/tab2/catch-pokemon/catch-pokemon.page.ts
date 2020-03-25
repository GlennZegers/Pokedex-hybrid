import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GlobalService } from '../../services/global.service';

@Component({
	selector: 'app-catch-pokemon',
	templateUrl: './catch-pokemon.page.html',
	styleUrls: ['./catch-pokemon.page.scss'],
})
export class CatchPokemonPage implements OnInit {
	pokemonToCatch: string;
	inputPokemonName: string;
	resultMessage: string;
	userHasTried = false;

	constructor(private route: ActivatedRoute, private router: Router, private globalService: GlobalService) {
		this.route.params.subscribe(params => {
			this.pokemonToCatch = params['pokemon'];
		});
	}

	ngOnInit() {
	}

	catchPokemon(textInput: string) {
		this.userHasTried = true;

		if (this.pokemonToCatch == textInput) {
			this.resultMessage = "Congrats! " + this.pokemonToCatch + " is caught!"
			this.globalService.catchedCurrentPokemon = true;
		} else {
			this.resultMessage = "Too bad. " + this.pokemonToCatch + " ran away"
			this.globalService.catchedCurrentPokemon = false;
		}
		
		// Setting timeout before returning to map
		setTimeout(() => {
			this.router.navigate(['/tabs/tab2'])
		}, 2500);
	}
}
