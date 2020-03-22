import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatchPokemonPage } from './catch-pokemon.page';

const routes: Routes = [
  {
    path: '',
    component: CatchPokemonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatchPokemonPageRoutingModule {}
