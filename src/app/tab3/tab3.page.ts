import { Component } from '@angular/core';

import { GlobalService } from '../services/global.service';

@Component({
	selector: 'app-tab3',
	templateUrl: 'tab3.page.html',
	styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
	myPokemon = [];

	constructor(private globalService: GlobalService) { }

	ionViewDidEnter() {
		this.myPokemon = this.globalService.catchedPokemon;
	}

}
