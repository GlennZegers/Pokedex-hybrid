import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  pokemon={
    name:"",
    height: 0,
    weight: 0
  }
  types=[]
  constructor(private pokeService: PokemonService, private router: Router,public toastController: ToastController) {

  }

  ngOnInit() {
    this.pokemon = this.pokeService.getSingleAddedPokemon(parseInt(document.URL.split('/')[document.URL.split('/').length - 1]))
    this.pokemon.height = this.pokemon.height / 10;
    this.pokemon.weight = this.pokemon.weight / 10;
    this.pokeService.getTypes().subscribe(res=>{
      this.types = res['results'];
    })
  }

  onSubmit(){
    if(this.pokemon.name===""){
      this.presentToast(`Please fill in all the fields`)
    }else{
      this.pokeService.updatePokemon(this.pokemon)
      this.router.navigate(['/'])
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
