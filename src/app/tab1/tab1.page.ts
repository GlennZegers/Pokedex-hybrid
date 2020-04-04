import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  offset = 0;
  pokemon = [];
  @ViewChild(IonInfiniteScroll, {static: false}) infinite: IonInfiniteScroll;

  constructor(private pokeService: PokemonService,public toastController: ToastController, private network: Network) {}

  ngOnInit(){
    this.loadPokemon();
  }

  ionViewDidEnter(){
    this.offset=0;
    this.pokemon = [];
    this.loadPokemon();
  }

  isConnected(): boolean {
		let conntype = this.network.type;
		return conntype && conntype !== 'unknown' && conntype !== 'none';
	}

  loadPokemon(loadMore = false, event?){
    if(this.isConnected()){
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
