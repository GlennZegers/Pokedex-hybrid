import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  offset = 0;
  pokemon = [];
  @ViewChild(IonInfiniteScroll, {static: false}) infinite: IonInfiniteScroll;

  constructor(private pokeService: PokemonService) {}

  ngOnInit(){
    this.loadPokemon();
  }

  loadPokemon(loadMore = false, event?){
    if(loadMore){
      this.offset += 25
    }
    this.pokeService.getPokemon(this.offset).subscribe(res=>{
      this.pokemon = [...this.pokemon, ...res]
      this.pokemon = [...this.pokemon, ...this.pokeService.getAddedPokemon()]
    })

    if(event){
      event.target.complete();
    }

    // if(this.offset === 125){
    //   this.infinite.disabled = true;
    // }
  }
}
