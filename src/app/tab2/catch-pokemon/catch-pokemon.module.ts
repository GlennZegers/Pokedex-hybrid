import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatchPokemonPageRoutingModule } from './catch-pokemon-routing.module';

import { CatchPokemonPage } from './catch-pokemon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatchPokemonPageRoutingModule
  ],
  declarations: [CatchPokemonPage]
})
export class CatchPokemonPageModule {}
