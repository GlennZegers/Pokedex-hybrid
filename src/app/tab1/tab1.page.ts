import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  offset = 0;
  pokemon = [];
  @ViewChild(IonInfiniteScroll, {static: false}) infinite: IonInfiniteScroll;

  constructor(private pokeService: PokemonService,public toastController: ToastController) {}

  ngOnInit(){
    this.loadPokemon();
  }

  loadPokemon(loadMore = false, event?){
    if(navigator.onLine){
      if(loadMore){
        this.offset += 25
      }
      try {
        this.pokeService.getPokemon(this.offset).subscribe(res=>{
          this.pokemon = [...this.pokemon, ...res]
        })
    
        if(event){
          event.target.complete();
        }
              // if(this.offset === 125){
      //   this.infinite.disabled = true;
      // }
      } catch (error) {
        this.presentToast(`Oops, something went wrong :(`);
      }
    }else{
      this.presentToast(`Couldn't load all pokemon, check your connection`);
    }
    this.pokemon = [...this.pokemon, ...this.pokeService.getAddedPokemon()]
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
