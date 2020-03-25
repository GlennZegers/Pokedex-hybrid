import { Injectable } from '@angular/core';

import { PokemonService } from '../services/pokemon.service';

@Injectable({
	providedIn: 'root'
})
export class GlobalService {
	public catchedPokemon = [];
	public catchedCurrentPokemon = false;

	constructor(private pokeService: PokemonService) { }

	addPokemon(id: number) {
		if (this.catchedCurrentPokemon) {
			this.pokeService.getSinglePokemon(id).subscribe(res => {
				this.catchedPokemon.push(res);
			});
		}
	}
}
