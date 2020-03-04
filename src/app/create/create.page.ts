import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  types=[]
  pokemon = {
    name:"",
    weight: 0,
    height: 0,
    types:[{
      type:{
        name:""
      }
    }],
    stats: [{
      base_stat:0,
      stat:{
        name:"speed"
      }
    },{
      base_stat:0,
      stat:{
        name:"special-defence"
      }
    },{
      base_stat:0,
      stat:{
        name:"special-attack"
      }
    },{
      base_stat:0,
      stat:{
        name:"defence"
      }
    },{
      base_stat:0,
      stat:{
        name:"attack",
      }
    },{
      base_stat:0,
      stat:{
        name:"hp"
      }
    },]
  }

  constructor(private pokeService: PokemonService) {}

  ngOnInit() {
    this.pokeService.getTypes().subscribe(res=>{
      this.types = res['results'];
    })
  }
  
  onSubmit(){
    this.generateStats()
    this.pokeService.savePokemon(this.pokemon)
  }

  private generateStats(){
    this.pokemon.stats.forEach(stat => {
      stat.base_stat = Math.floor(Math.random() * 250) + 1; 
    });
  }

}
