import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})

export class DetailsPage implements OnInit {
  id= 0;
  pokemon={}
  image="";
  constructor(private pokeService: PokemonService, private router: Router) {

   }

  ngOnInit() {
    this.id = parseInt(document.URL.split('/')[document.URL.split('/').length - 1])
    if(this.id <= 964){
      this.pokeService.getSinglePokemon(this.id).subscribe(res=>{
        this.pokemon = res
        this.image=this.pokeService.getFullPokemonImage(this.pokemon["name"]);
      })
      document.getElementById("buttons").style.display="none";

    }else{
      this.pokemon = this.pokeService.getSingleAddedPokemon(this.id)
      
    }
  }

  delete(){
    this.pokeService.deletePokemon(this.id)   
    this.router.navigate(['/'])
  }
}
