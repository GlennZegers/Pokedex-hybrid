import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})

export class DetailsPage implements OnInit {
  id= 0;
  pokemon={}
  image="";
  constructor(private pokeService: PokemonService) {

   }

  ngOnInit() {
    this.id = parseInt(document.URL.split('/')[document.URL.split('/').length - 1])
    if(this.id <= 964){
      this.pokeService.getSinglePokemon(this.id).subscribe(res=>{
        this.pokemon = res
        this.image=this.pokeService.getFullPokemonImage(this.pokemon["name"]);
      })
    }else{
      this.pokemon = this.pokeService.getSingleAddedPokemon(this.id)
    }
  }
}
