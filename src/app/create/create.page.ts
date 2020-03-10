import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  types=[]
  pokemon = {
    name:"",
    type1:"",
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

  constructor(private pokeService: PokemonService, private router: Router,public toastController: ToastController) {}

  ngOnInit() {
    if(navigator.onLine){
    this.pokeService.getTypes().subscribe(res=>{
      this.types = res['results'];
    })
    }else{
      this.presentToast(`Couldn't retrieve types, check your connection`);
    }
  }
  
  onSubmit(){
    if(this.pokemon.name==="" || this.pokemon.type1===""){
      this.presentToast(`Please fill in all the fields`)
    }else{
      this.generateStats()
      this.pokeService.savePokemon(this.pokemon)
      this.router.navigate(['/'])
    }
  }

  private generateStats(){
    this.pokemon.stats.forEach(stat => {
      stat.base_stat = Math.floor(Math.random() * 250) + 1; 
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
